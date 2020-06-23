package confgo

import (
	"errors"
	"strings"
	"time"

	"github.com/BurntSushi/toml"
	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/model"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/store/gorm"
	log "github.com/sirupsen/logrus"
)

// parse packages dependencies
// ParseGoDepPkg parse content of Gopkg.lock
func ParseGoDepPkg(content []byte, aid int) error {
	deps := struct {
		Projects []model.GoDepProject `toml:"projects"`
	}{}
	if err := toml.Unmarshal(content, &deps); err != nil {
		return err
	}
	tx := invoker.JunoMysql.Begin()
	if err := tx.Where("aid = ?", aid).Delete(db.AppPackage{}).Error; err != nil && err != gorm.ErrRecordNotFound {
		tx.Rollback()
		return err
	}
	for _, p := range deps.Projects {
		if err := tx.Create(&db.AppPackage{
			Aid:        aid,
			Name:       p.Name,
			Branch:     p.Branch,
			Version:    p.Version,
			Revision:   p.Revision,
			Packages:   strings.Join(p.Packages, ","),
			UpdateTime: time.Now().Unix(),
		}).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()

	return nil
}

// ParseGoModPkg parse content of go.mod
func ParseGoModPkg(content []byte, aid int) error {
	l, r := bytesIndex(content)
	if l < 0 || r < 0 || l == len(content)-1 {
		return errors.New("can't find packages content in go.mod")
	}
	strs := strings.TrimSpace(string(content[l+1 : r-1]))
	lines := strings.Split(strs, "\n")
	pkgs := parseModLines(lines)
	tx := invoker.JunoMysql.Begin()
	if err := tx.Where("aid = ?", aid).Delete(db.AppPackage{}).Error; err != nil && err != gorm.ErrRecordNotFound {
		tx.Rollback()
		return err
	}
	for _, p := range pkgs {
		p.Aid = aid
		if err := tx.Create(p).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()
	return nil
}

func parseModLines(lines []string) []*db.AppPackage {
	pkgs := make([]*db.AppPackage, 0)
	// parse lines
	for _, line := range lines {
		arr := strings.Split(strings.TrimSpace(line), " ")
		if len(arr) < 2 {
			log.Warn("invalid line in go.mod", line)
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

type ConfuData struct {
	ID         int
	Caid       int
	Aid        int
	Env        string
	FileName   string
	OriginToml string
}

func GetConfuContent(aid int, fileName string) string {
	confu := ConfuData{}
	invoker.JunoMysql.Table("cmc_history").Where("aid = ? AND file_name = ?", aid, fileName).Order("create_time desc").First(&confu)
	if confu.Aid == 0 {
		return ""
	}
	return confu.OriginToml
}
