package configresource

import (
	"github.com/douyu/jupiter/pkg/xlog"
	"regexp"
	"strconv"
	"strings"
)

type (
	ResourceItem struct {
		Name    string `json:"name"`
		Version uint   `json:"version"`
	}
)

// GetAllConfigResource ..
func GetAllConfigResource(content string) (res []string) {
	reg := regexp.MustCompile(`{{[\w\W]*\@[0-9]*}}`)
	return reg.FindAllString(content, -1)
}

//ParseResourceFromConfig 从配置内容中解析出依赖的资源及其版本
func ParseResourceFromConfig(content string) (resourceItems []ResourceItem) {
	resources := GetAllConfigResource(content)
	for _, res := range resources {
		res = strings.Trim(strings.Trim(res, "{{"), "}}")
		splices := strings.Split(res, "@")
		if len(splices) != 2 {
			continue
		}

		version, err := strconv.Atoi(splices[1])
		if err != nil {
			xlog.Error("ParseResourceFromConfig", xlog.String("error", "parse version id failed:"+err.Error()))
			continue
		}

		resourceItems = append(resourceItems, ResourceItem{
			Name:    splices[0],
			Version: uint(version),
		})
	}

	return
}
