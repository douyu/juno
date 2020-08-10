package openauth

import (
	"fmt"
	"sync"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/jinzhu/gorm"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"github.com/labstack/gommon/random"
	"golang.org/x/sync/errgroup"
)

const (
	AppIdLen  = 16
	SecretLen = 32
)

var (
	// 无效的 OpenAuth 应用
	ErrAppNotFound = fmt.Errorf("open auth 应用未找到")
)

type (
	openAuthService struct {
		db *gorm.DB

		// 为了防止每次查询Access Token带来的损耗，将AccessToken写入内存中
		accessTokens    map[string]db.AccessToken // AppId -> AppSecret
		accessTokensMtx sync.Mutex
	}
)

func (o *openAuthService) init() {
	err := o.loadAccessTokens()
	if err != nil {
		log.Errorf("openAuthService.init: load access token failed:%s", err.Error())
	}
}

//IntervalUpdateTokens 定时更新Token，为了防止其他进程往AccessToken数据表写数据
func (o *openAuthService) IntervalUpdateTokens() (err error) {
	return o.loadAccessTokens()
}

func (o *openAuthService) loadAccessTokens() (err error) {
	var accessTokens []db.AccessToken
	err = o.db.Find(&accessTokens).Error
	if err != nil {
		return
	}

	o.accessTokensMtx.Lock()
	defer o.accessTokensMtx.Unlock()
	for _, token := range accessTokens {
		o.accessTokens[token.AppID] = token
	}
	return
}

func (o *openAuthService) Create(param view.ReqCreateAccessToken) (token view.AccessTokenItem, err error) {
	var accessToken db.AccessToken

	tx := o.db.Begin()
	err = tx.Where("name = ?", param.Name).First(&accessToken).Error
	if err != nil && !gorm.IsRecordNotFoundError(err) {
		tx.Rollback()
		return
	} else if err == nil {
		tx.Rollback()
		err = fmt.Errorf("存在相同的应用名")
		return
	}

	// 这里直接生成随机数，如果存在重复的，写入Unique列会失败，用户重新提交即可
	appId := random.String(AppIdLen, random.Alphanumeric)
	secret := random.String(SecretLen, random.Alphanumeric)
	accessToken = db.AccessToken{
		Name:   param.Name,
		AppID:  appId,
		Secret: secret,
	}

	err = tx.Save(&accessToken).Error
	if err != nil {
		tx.Rollback()
		return
	}

	err = tx.Commit().Error
	if err != nil {
		tx.Rollback()
		return
	}

	o.accessTokensMtx.Lock()
	defer o.accessTokensMtx.Unlock()
	o.accessTokens[appId] = accessToken

	token.Name = accessToken.Name
	token.AppID = accessToken.AppID
	token.AppSecret = accessToken.Secret

	return
}

func (o *openAuthService) Delete(param view.ReqDeleteAccessToken) (err error) {
	err = o.db.Where("app_id = ?", param.AppID).Limit(1).Delete(&db.AccessToken{}).Error
	if err != nil {
		return err
	}

	o.accessTokensMtx.Lock()
	defer o.accessTokensMtx.Unlock()
	delete(o.accessTokens, param.AppID)

	return
}

func (o *openAuthService) List(param view.ReqListAccessToken) (resp view.RespListAccessToken, err error) {
	var list []db.AccessToken

	page := param.Page
	pageSize := param.PageSize
	offset := page * pageSize

	eg := errgroup.Group{}
	eg.Go(func() error {
		return o.db.Model(&db.AccessToken{}).Count(&resp.Pagination.Total).Error
	})

	eg.Go(func() error {
		return o.db.Limit(pageSize).Offset(offset).Order("id desc").Find(&list).Error
	})

	err = eg.Wait()
	if err != nil {
		return view.RespListAccessToken{}, err
	}

	resp.Pagination.PageSize = int(pageSize)
	resp.Pagination.Current = int(page)

	for _, token := range list {
		resp.List = append(resp.List, view.AccessTokenItem{
			Name:      token.Name,
			AppID:     token.AppID,
			AppSecret: token.Secret,
		})
	}

	return
}

//GetAccessTokenByAppID 从内存缓存中取Access Token
func (o *openAuthService) GetAccessTokenByAppID(appId string) (accessToken db.AccessToken, err error) {
	o.accessTokensMtx.Lock()
	defer o.accessTokensMtx.Unlock()

	accessToken, ok := o.accessTokens[appId]
	if !ok {
		err = ErrAppNotFound
		return
	}

	return
}

func GetAccessToken(c echo.Context) (bool, db.AccessToken) {
	openAuthInfo, ok := c.Get("OpenAuthAccessToken").(db.AccessToken)
	return ok, openAuthInfo
}
