package appDep

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/BurntSushi/toml"
	"github.com/douyu/juno/internal/pkg/service/resource"
	depModel "github.com/douyu/juno/pkg/model"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/go-resty/resty/v2"
	"go.uber.org/zap"
)

const (
	Url_Gitlab = "/api/v4/projects/%d/repository/files/%s?ref=%s"
)

//DepApp ..
type DepApp interface {
	ParseDepFile(app db.AppInfo) ([]*db.AppPackage, error) // 获取依赖文件内容并解析
	SaveToMysql(aid int, records []*db.AppPackage) error   // 解析结果存储到mysql
}

type appDep struct {
	DB *gorm.DB
	*resty.Client
}

type FileContent struct {
	FileName     string `json:"file_name"`
	FilePath     string `json:"file_path"`
	Size         int64  `json:"size"`
	Encoding     string `json:"encoding"`
	Content      string `json:"content"`
	Ref          string `json:"ref"`
	BlobId       string `json:"blob_id"`
	CommitId     string `json:"commit_id"`
	LastCommitId string `json:"last_commit_id"`
}

func (p *appDep) SyncAppVersion() error {
	xlog.Info("SyncAppVersion", zap.String("run", "start"))

	// 拿到app信息
	apps, err := resource.Resource.GetAllApp()
	if err != nil {
		xlog.Error("SyncAppVersion", zap.Error(err), zap.String("msg", "GetAllApp"))
		return err
	}

	for _, app := range apps {

		var depApp DepApp

		depApp = p

		appPackages, err := depApp.ParseDepFile(app)
		if err != nil {
			xlog.Error("ParseDepFile", zap.Error(err), zap.String("appName", app.AppName))
		} else {
			xlog.Info("ParseDepFile success", zap.String("appName", app.AppName))
		}

		if err = depApp.SaveToMysql(app.Aid, appPackages); err != nil {
			xlog.Error("SaveToMysql", zap.Error(err), zap.String("appName", app.AppName))
		} else {
			xlog.Info("SaveToMysql success", zap.String("appName", app.AppName))
		}

		/*		if err := p.handleOneApp(app); err != nil {
					xlog.Error("handleOneApp", zap.Error(err), zap.String("appName", app.AppName))
				} else {
					xlog.Info("handleOneApp success", zap.String("appName", app.AppName))
				}*/
	}

	xlog.Info("SyncAppVersion", zap.String("run", "end"))

	return nil
}

func (p *appDep) ParseDepFile(app db.AppInfo) ([]*db.AppPackage, error) {
	resp := make([]*db.AppPackage, 0)

	// 先查询是否有 go.mod 文件
	fc, err := p.RepoRawFileRefParse(app.Gid, "master", "go.mod")
	// 如果存在 go.mod 文件，优先以 go.mod 文件解析包依赖
	if err == nil {
		content, err := p.decode(fc)
		if err != nil {
			return resp, err
		}
		return parseGoModPkg(content, app.Aid)
	}

	xlog.Warn("RepoRawFileRefParse", zap.Error(err), zap.Any("app", app), zap.Int("gid", app.Gid), zap.String("file name", "go.mod"))

	fc, err = p.RepoRawFileRefParse(app.Gid, "master", "Gopkg.lock")
	if err != nil {
		return resp, err
	}

	content, err := p.decode(fc)
	if err != nil {
		return resp, err
	}

	return parseGoDepPkg(content, app.Aid)
}

func (p *appDep) decode(fc *FileContent) ([]byte, error) {
	if fc.Encoding != "base64" {
		return nil, fmt.Errorf("can't support %s except for base64", fc.Encoding)
	}
	content, err := base64.StdEncoding.DecodeString(fc.Content)
	if err != nil {
		return nil, fmt.Errorf("decode %s content err", fc.FileName)
	}
	return content, nil
}

func parseGoDepPkg(content []byte, aid int) ([]*db.AppPackage, error) {
	resp := make([]*db.AppPackage, 0)
	deps := struct {
		Projects []depModel.GoDepProject `toml:"projects"`
	}{}
	if err := toml.Unmarshal(content, &deps); err != nil {
		return resp, err
	}

	for _, p := range deps.Projects {
		item := db.AppPackage{
			Aid:        aid,
			Name:       p.Name,
			Branch:     p.Branch,
			Version:    p.Version,
			Revision:   p.Revision,
			Packages:   strings.Join(p.Packages, ","),
			UpdateTime: time.Now().Unix(),
		}
		resp = append(resp, &item)
	}
	return resp, nil
}

func parseGoModPkg(content []byte, aid int) ([]*db.AppPackage, error) {
	pkgs := make([]*db.AppPackage, 0)
	l, r := bytesIndex(content)
	if l < 0 || r < 0 || l == len(content)-1 {
		return pkgs, errors.New("can't find packages content in go.mod")
	}
	strs := strings.TrimSpace(string(content[l+1 : r-1]))
	lines := strings.Split(strs, "\n")
	pkgs = parseModLines(lines)
	return pkgs, nil
}

func (p *appDep) SaveToMysql(aid int, records []*db.AppPackage) error {
	tx := p.DB.Begin()
	if err := tx.Where("aid = ?", aid).Delete(db.AppPackage{}).Error; err != nil && err != gorm.ErrRecordNotFound {
		tx.Rollback()
		return err
	}
	for _, p := range records {
		p.Aid = aid
		if err := tx.Create(p).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()
	return nil
}

func (p *appDep) RepoRawFileRefParse(id int, ref, f string) (*FileContent, error) {
	url := fmt.Sprintf(Url_Gitlab, id, f, ref)
	response, err := p.Get(url)
	fc := &FileContent{}
	if err != nil {
		return fc, fmt.Errorf("err:%v,response:%v", err, response)
	}
	if err = json.Unmarshal(response, &fc); err != nil {
		return fc, err
	}
	return fc, nil
}

func (p *appDep) Get(url string) ([]byte, error) {
	response, err := p.Client.R().Get(url)
	if err != nil {
		return []byte{}, err
	}
	if response.StatusCode() != 200 {
		return response.Body(), fmt.Errorf("状态码不为200，statusCode:%v,body:%s", response.StatusCode(), string(response.Body()))
	}
	return response.Body(), nil
}

func bytesIndex(content []byte) (int, int) {
	l, r := -1, -1
	for i := 0; i < len(content); i++ {
		if content[i] == '(' {
			l = i
			break
		}
	}
	for i := len(content) - 1; i >= 0; i-- {
		if content[i] == ')' {
			r = i
		}
	}
	return l, r
}

func parseModLines(lines []string) []*db.AppPackage {
	pkgs := make([]*db.AppPackage, 0)
	// parse lines
	for _, line := range lines {
		arr := strings.Split(strings.TrimSpace(line), " ")
		if len(arr) < 2 {
			xlog.Warn("invalid line in go.mod", zap.String("line", line))
			continue
		}
		version, revision := "", ""
		version = strings.Split(arr[1], " ")[0]
		// if no tag, but use branch
		if parts := strings.Split(arr[1], "-"); len(parts) >= 3 {
			version = parts[0]
			revision = parts[2]
		}
		// has +incompatible
		if strings.IndexByte(arr[1], '+') > 0 {
			parts := strings.Split(arr[1], "+")
			version = parts[0]
		}
		// has indirect
		if strings.HasSuffix(arr[1], "indirect") {
			// 先不处理
		}

		pkgs = append(pkgs, &db.AppPackage{
			Name:       arr[0],
			Branch:     "master",
			Version:    version,
			Revision:   revision,
			Packages:   ".",
			UpdateTime: time.Now().Unix(),
		})
	}
	return pkgs
}
