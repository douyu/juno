package permission

import (
	"encoding/json"
	"fmt"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/go-resty/resty/v2"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
)

const (
	GitlabLevelNoAuth     = 0
	GitlabLevelGuest      = 10
	GitlabLevelReporter   = 20
	GitlabLevelDeveloper  = 30
	GitlabLevelMaintainer = 40
	GitlabLevelOwner      = 50
)

var (
	Permission *permission
)

type (
	permission struct {
		db           *gorm.DB
		gitlabClient *resty.Client

		option Option
	}
)

func initPermission(o Option) {
	Permission = &permission{
		db:           o.DB,
		gitlabClient: resty.New().SetHostURL(o.GitlabOAuthApiUrl),
		option:       o,
	}
}

func (p *permission) CheckGitlabAuth(uid uint, appName, env string) (err error) {
	level, err := p.GetGitlabAccessLevel(uid, appName)
	if err != nil {
		return
	}

	if level <= GitlabLevelGuest {
		return fmt.Errorf("无应用权限")
	}

	prodEnv := false
	for _, e := range p.option.ProductionEnvs {
		if e == env {
			prodEnv = true
			break
		}
	}

	if prodEnv && level <= GitlabLevelReporter {
		return fmt.Errorf("无应用权限")
	}

	return nil
}

func (p *permission) GetGitlabAccessLevel(uid uint, appName string) (level int, err error) {
	var user db.User
	var app db.AppInfo
	var projectPermission struct {
		Permissions struct {
			GroupAccess *struct {
				AccessLevel       int `json:"access_level"`
				NotificationLevel int `json:"notification_level"`
			} `json:"group_access"`
			ProjectAccess *struct {
				AccessLevel       int `json:"access_level"`
				NotificationLevel int `json:"notification_level"`
			} `json:"project_access"`
		} `json:"permissions"`
	}

	if !p.option.GitlabOAuthEnabled {
		return 0, fmt.Errorf("未启用Gitlab授权")
	}

	err = p.db.Where("uid = ?", uid).First(&user).Error
	if err != nil {
		return 0, err
	}

	err = p.db.Where("app_name = ?", appName).First(&app).Error
	if err != nil {
		return 0, err
	}

	req := p.gitlabClient.R()
	if user.OauthToken.Token == nil {
		return 0, fmt.Errorf("登录信息")
	}

	req.SetAuthToken(user.OauthToken.AccessToken)

	projectUrl := fmt.Sprintf("/projects/%d", app.Gid)
	resp, err := req.Get(projectUrl)
	if err != nil {
		return 0, errors.Wrap(err, "请求Gitlab API错误")
	}

	err = json.Unmarshal(resp.Body(), &projectPermission)
	if err != nil {
		return 0, errors.Wrap(err, "解析Gitlab响应失败")
	}

	projectAccess := projectPermission.Permissions.ProjectAccess
	if projectAccess != nil {
		level = projectAccess.AccessLevel
	}

	groupAccess := projectPermission.Permissions.GroupAccess
	if groupAccess != nil && groupAccess.AccessLevel > level {
		level = groupAccess.AccessLevel
	}

	return
}
