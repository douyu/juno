package openauth

import (
	"fmt"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/jinzhu/gorm"
	"github.com/labstack/gommon/random"
	"golang.org/x/sync/errgroup"
	"log"
	"sync"
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
	var accessTokens []db.AccessToken
	err := o.db.Find(&accessTokens).Error
	if err != nil {
		log.Panicf("openAuthService.init(): load access token failed: %s", err.Error())
	}

	o.accessTokensMtx.Lock()
	defer o.accessTokensMtx.Unlock()
	for _, token := range accessTokens {
		o.accessTokens[token.AppID] = token
	}
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
	return o.db.Where("id = ?", param.ID).Limit(1).Delete(&db.AccessToken{}).Error
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
		return o.db.Limit(pageSize).Offset(offset).Find(&list).Error
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

func (o *openAuthService) GetAccessTokenByAppID(appId string) (accessToken db.AccessToken, err error) {
	err = o.db.Where("app_id = ?", appId).First(&accessToken).Error
	if err != nil {
		if gorm.IsRecordNotFoundError(err) {
			err = ErrAppNotFound
			return
		}
		return
	}

	return
}
