package confgo

import (
	"bytes"
	"fmt"
	"html/template"
	"net/http"
	"strings"
	"time"

	"github.com/douyu/juno/pkg/codec"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/douyu/jupiter/pkg/util/xcast"
	"github.com/douyu/jupiter/pkg/util/xmap"
	"github.com/labstack/echo/v4"

	// "github.com/pelletier/go-toml"

	jsoniter "github.com/json-iterator/go"
	"github.com/json-iterator/go/extra"
)

func init() {
	extra.RegisterTimeAsInt64Codec(time.Second)
}

func doJSON(ctx echo.Context, code int, v interface{}) (err error) {
	var body []byte
	if ctx.QueryParam("pretty") != "" {
		body, err = jsoniter.MarshalIndent(v, "", "    ")
	} else {
		body, err = jsoniter.Marshal(v)
	}
	if err != nil {
		return ctx.JSON(code, err)
	}

	return ctx.JSONBlob(code, body)
}

type ConfigFactory struct {
	*gorm.DB
}

// @Route /api/project [post]
func (cf *ConfigFactory) AddProject(ctx echo.Context) error {
	var project Project

	if err := ctx.Bind(&project); err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	if err := cf.Table("projects").Save(&project).Error; err != nil {
		return doJSON(ctx, http.StatusInternalServerError, err)
	}

	return doJSON(ctx, http.StatusCreated, project.ID)
}

// @Route /api/project?id=1
func (cf *ConfigFactory) GetProject(ctx echo.Context) error {
	var tid = strings.TrimSpace(ctx.QueryParam("id"))
	if tid == "" {
		return doJSON(ctx, http.StatusBadRequest, "invalid project id")
	}

	var project Project
	if err := cf.Model(&Project{}).Preload("Configs").Where("id=?", tid).First(&project).Error; err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	return doJSON(ctx, http.StatusOK, project)
}

// @Route /api/project/config?id=1 [get]
func (cf *ConfigFactory) GetProjectConfig(ctx echo.Context) error {
	var cid = strings.TrimSpace(ctx.QueryParam("id")) // config id
	var format = strings.TrimSpace(ctx.QueryParam("format"))
	if cid == "" {
		return doJSON(ctx, http.StatusBadRequest, "invalid project config id")
	}

	var config ProjectConfig
	if err := cf.Model(&ProjectConfig{}).Preload("Items").Where("id=?", cid).First(&config).Error; err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	content, err := codec.Unmarshal(format, unfold(config.Items))
	if err != nil {
		doJSON(ctx, http.StatusInternalServerError, err)
	}
	config.Preview = content
	fmt.Println("content: ", content)
	return doJSON(ctx, http.StatusOK, config)
}

func (cf *ConfigFactory) AddProjectConfigItems(ctx echo.Context) error {
	var config ProjectConfig
	if err := ctx.Bind(&config); err != nil {
		return doJSON(ctx, http.StatusInternalServerError, err)
	}
	if err := cf.Model(&ProjectConfigItem{}).Save(&config).Error; err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	return doJSON(ctx, http.StatusCreated, nil)
}

func (cf *ConfigFactory) UpdateProjectConfigItem(ctx echo.Context) error {
	var doEncrypt = strings.TrimSpace(ctx.QueryParam("encrypt"))
	var configItem ProjectConfigItem
	if err := ctx.Bind(&configItem); err != nil {
		return doJSON(ctx, http.StatusInternalServerError, err)
	}
	fmt.Printf("configItem => %+v\n", configItem)
	switch configItem.Kind {
	case ItemKindRef:
		var resource Resource
		if err := cf.Model(&Resource{}).Preload("Items").Where("id=?", configItem.Resource.ID).First(&resource).Error; err != nil {
			return doJSON(ctx, http.StatusBadRequest, err)
		}
		configItem.Value = applyResourceTemplate(configItem.Value, resource, doEncrypt == "")
	}
	if err := cf.Model(&ProjectConfigItem{}).Save(&configItem).Error; err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	return doJSON(ctx, http.StatusCreated, nil)
}

// tmpl: {{.user}}:{{.password}}@tcp({{.host}}:{{.port}}
// resource:
func applyResourceTemplate(tmpl string, resource Resource, encrypt bool) string {
	var pairs = make(map[string]interface{})
	for _, item := range resource.Items {
		value := item.Default
		if encrypt && item.Kind == ItemKindPassword {
			value = "******"
		}
		pairs[item.Key] = value
	}

	t, err := template.New("test").Parse(tmpl)
	if err != nil {
		panic(err)
	}

	var buff bytes.Buffer
	if err := t.Execute(&buff, pairs); err != nil {
		panic(err)
	}

	return buff.String()
}

func (cf *ConfigFactory) AddTemplate(ctx echo.Context) error {
	var template Template

	if err := ctx.Bind(&template); err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	var count int
	if err := cf.Table("templates").Where("prefix=?", template.Prefix).Count(&count).Error; err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	if count > 0 {
		return doJSON(ctx, http.StatusConflict, nil)
	}

	if err := cf.Table("templates").Save(&template).Error; err != nil {
		return doJSON(ctx, http.StatusInternalServerError, err)
	}

	return doJSON(ctx, http.StatusCreated, template.ID)
}

func (cf *ConfigFactory) GetTemplate(ctx echo.Context) error {
	var tid = strings.TrimSpace(ctx.QueryParam("id"))
	if tid == "" {
		return doJSON(ctx, http.StatusBadRequest, "invalid template id")
	}

	var template Template
	if err := cf.Model(&Template{}).Preload("Items").Where("id=?", tid).First(&template).Error; err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	return doJSON(ctx, http.StatusOK, template)
}

func (cf *ConfigFactory) DeleteTemplate(ctx echo.Context) error {
	var tid = strings.TrimSpace(ctx.QueryParam("id"))
	if tid == "" || xcast.ToInt(tid) == 0 {
		return doJSON(ctx, http.StatusBadRequest, "invalid template id")
	}

	var template Template
	template.ID = uint(xcast.ToInt(tid))
	if err := cf.Table("templates").Delete(&template).Error; err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	return doJSON(ctx, http.StatusAccepted, nil)
}

func (cf *ConfigFactory) ListTemplates(ctx echo.Context) error {
	var templates = make([]Template, 0)
	if err := cf.Table("templates").Preload("Items").Find(&templates).Error; err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	return doJSON(ctx, http.StatusAccepted, templates)
}

func (cf *ConfigFactory) AddResource(ctx echo.Context) error {
	var resource Resource
	if err := ctx.Bind(&resource); err != nil {
		return ctx.JSON(http.StatusBadRequest, err)
	}
	if err := cf.Table("resources").Save(&resource).Error; err != nil {
		return doJSON(ctx, http.StatusInternalServerError, err)
	}

	return doJSON(ctx, http.StatusCreated, resource.ID)
}

func (cf *ConfigFactory) ListResources(ctx echo.Context) error {
	var resources = make([]Resource, 0)
	if err := cf.Table("resources").Preload("Items").Find(&resources).Error; err != nil {
		return doJSON(ctx, http.StatusBadRequest, err)
	}

	return doJSON(ctx, http.StatusAccepted, resources)
}

type Model struct {
	ID        uint       `gorm:"column:id; primary_key" json:"id"`
	CreatedAt time.Time  `gorm:"column:created_at; not null; default:CURRENT_TIMESTAMP" json:"-"`
	UpdatedAt time.Time  `gorm:"column:updated_at; not null; default:CURRENT_TIMESTAMP" json:"-"`
	DeletedAt *time.Time `sql:"index" gorm:"column:deleted_at" json:"-"`
}

type ItemKind int

const (
	ItemKindUnknown ItemKind = iota
	ItemKindInt
	ItemKindString
	ItemKindBool
	ItemKindFloat
	ItemKindMap
	ItemKindBlock
	ItemKindRef
	ItemKindPassword
)

// Project 项目
type Project struct {
	Model
	Name    string
	Region  string
	Zone    string
	Env     string
	Configs []ProjectConfig
}

type ProjectConfig struct {
	Model
	ProjectID uint                `json:"project_id,omitempty"`
	Name      string              `json:"name,omitempty"`
	Version   int                 `json:"ver,omitempty"` // staging, published
	Items     []ProjectConfigItem `json:"items,omitempty"`
	Preview   string              `json:"preview,omitempty"`
	Published bool
}

func unfold(items []ProjectConfigItem) map[string]interface{} {
	var pairs = make(map[string]interface{})
	for _, item := range items {
		key := fmt.Sprintf("%s.%s.%s", item.Prefix, item.Key, item.Field)
		if item.IsArray {
			if _, ok := pairs[key]; !ok {
				pairs[key] = []interface{}{}
			}

			if arr, ok := pairs[key].([]interface{}); ok {
				arr = append(arr, item.Value)
				pairs[key+"$1"] = arr
			}
			continue
		}
		pairs[key] = item.Value
	}

	var override = make(map[string]interface{})
	for key, val := range pairs {
		paths := strings.Split(key, ".")
		lastKey := paths[len(paths)-1]
		m := deepSearch(override, paths[:len(paths)-1])
		m[lastKey] = val
		xmap.MergeStringMap(override, m)
	}
	return override
}

// ProjectConfigItem 配置项
type ProjectConfigItem struct {
	Model           `json:"model,omitempty"`
	ProjectConfigID uint         `json:"pcid,omitempty"`
	Prefix          string       `json:"prefix,omitempty"`
	Key             string       `json:"key,omitempty"`
	Field           string       `json:"field,omitempty"`
	Value           string       `json:"value,omitempty"`
	Kind            ItemKind     `json:"kind,omitempty"`
	IsArray         bool         `json:"is_array,omitempty"`
	TemplateItem    TemplateItem `json:"template,omitempty"` // 关联的模板项目
	Resource        Resource     `json:"resource,omitempty"`
}

// Template 模板
type Template struct {
	gorm.Model
	Prefix  string         `json:"prefix,omitempty"`
	Version int            `json:"version,omitempty"`
	Items   []TemplateItem `json:"items,omitempty"`
}

// myslq template
// 	field: dsn
// 	filed: readTimeout

// TemplateItem 模板项
// @Field ResourceExpr: 资源表达式
// 	比如有一个Mysql资源:
// 		Name: ali.bj01.rds.stt_config.master
// 		User: root
// 		Password: root
// 		Host: 127.0.0.1
//		Port: 3306
type TemplateItem struct {
	Model
	TemplateID uint     `json:"template_id,omitempty"`
	Field      string   `json:"field,omitempty"`
	Kind       ItemKind `json:"kind,omitempty"`
	// for resource: "{{.User}}:{{.Password}}@tcp({{.Host}}:{.Port}/juno?charset=utf8&parseTime=True&loc=Local)
	Default string `json:"default,omitempty"`
}

/*
aliyun.rds:
	name: bj01.rds.stt_config.master
	host: 127.0.0.1
	port: 3306
	user: root
	pass: root
aliyun.rds:
	name: bj01.rds.stt_config.slave1
	host: 127.0.0.1
	port: 3306
	user: root
	pass: root

aliyun.redis:
	host: 127.0.0.1
	port: 6379
	user: root
	pass: root
*/

// Resource 与CMC怎么互通？
type Resource struct {
	Model
	Name    string
	Version int
	Items   []ResourceItem
}

type ResourceItem struct {
	Model      `json:"model,omitempty"`
	ResourceID uint     `json:"resource_id,omitempty"`
	Key        string   `json:"key,omitempty"`
	Default    string   `json:"default,omitempty"`
	Kind       ItemKind `json:"kind,omitempty"`
}

func deepSearch(m map[string]interface{}, path []string) map[string]interface{} {
	for _, k := range path {
		m2, ok := m[k]
		if !ok {
			m3 := make(map[string]interface{})
			m[k] = m3
			m = m3
			continue
		}
		m3, ok := m2.(map[string]interface{})
		if !ok {
			m3 = make(map[string]interface{})
			m[k] = m3
		}
		m = m3
	}
	return m
}
