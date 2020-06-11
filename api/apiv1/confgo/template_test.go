package confgo

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/douyu/jupiter/pkg/store/gorm"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func TestConfigFactory_Template(t *testing.T) {
	config := gorm.DefaultConfig()
	config.Debug = true
	config.DSN = "root:root@tcp(127.0.0.1:3306)/juno?charset=utf8&parseTime=True&loc=Local"
	factory := ConfigFactory{
		DB: config.Build(),
	}

	factory.DropTable("templates")
	factory.DropTable("template_items")
	factory.AutoMigrate(&Template{})
	factory.AutoMigrate(&TemplateItem{})
	var tid string
	t.Run("add template", func(t *testing.T) {
		reqJSON := `{"prefix":"jupiter.mysql", "version":0, "items": [{"field":"timeout", "kind":1}]}`
		req := httptest.NewRequest(http.MethodPost, "/template", strings.NewReader(reqJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.AddTemplate(c)
		assert.Nil(t, err)
		tid = rec.Body.String()
		assert.NotEmpty(t, tid)
		t.Log(tid)
		assert.Equal(t, 201, rec.Code)
	})

	t.Run("get template", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/template", nil)
		q := req.URL.Query()
		q.Add("id", tid)
		req.URL.RawQuery = q.Encode()
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.GetTemplate(c)
		assert.Nil(t, err)
		t.Log(rec.Body.String(), rec.Code)
	})

	t.Run("list template", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/template", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.ListTemplates(c)
		assert.Nil(t, err)
		t.Log("list templates", rec.Body.String(), rec.Code)
	})

	t.Run("delete template", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/template", nil)
		q := req.URL.Query()
		q.Add("id", tid)
		req.URL.RawQuery = q.Encode()
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.DeleteTemplate(c)
		assert.Nil(t, err)
		t.Log(rec.Body.String(), rec.Code)
	})
}

func TestConfigFactory_Project(t *testing.T) {
	config := gorm.DefaultConfig()
	config.Debug = true
	config.DSN = "root:root@tcp(127.0.0.1:3306)/juno?charset=utf8&parseTime=True&loc=Local"
	factory := ConfigFactory{
		DB: config.Build(),
	}

	factory.DropTableIfExists("projects")
	factory.DropTableIfExists("project_configs")
	factory.DropTableIfExists("project_config_items")
	factory.AutoMigrate(&Project{})
	factory.AutoMigrate(&ProjectConfig{})
	factory.AutoMigrate(&ProjectConfigItem{})
	var pid string
	t.Run("add project", func(t *testing.T) {
		reqJSON := `{"name":"main", "env":"pre"}`
		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(reqJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.AddProject(c)
		assert.Nil(t, err)
		pid = rec.Body.String()
		assert.NotEmpty(t, pid)
		t.Log(pid)
		assert.Equal(t, 201, rec.Code)
	})

	t.Run("get project", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/project", nil)
		q := req.URL.Query()
		q.Add("id", pid)
		req.URL.RawQuery = q.Encode()
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.GetProject(c)
		assert.Nil(t, err)
		t.Log(rec.Body.String(), rec.Code)
	})
	t.Run("add project config items", func(t *testing.T) {
		reqJSON := `{"id":2, "items":[
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"timeout", "value":"1s", "kind":3},
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"close", "value":"1s", "kind":2},
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"endpoints", "value":"A", "kind":2, "is_array":true},
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"endpoints", "value":"B", "kind":2, "is_array":true}
		]}`
		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(reqJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.AddProjectConfigItems(c)
		assert.Nil(t, err)
		assert.NotEmpty(t, c)
		assert.Equal(t, 201, rec.Code)
		t.Log("body: ", rec.Body.String(), err)
	})

	t.Run("get config", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/project/config", nil)
		q := req.URL.Query()
		q.Add("id", "2")
		q.Add("format", "yaml")
		q.Add("pretty", "true")
		req.URL.RawQuery = q.Encode()
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.GetProjectConfig(c)
		assert.Nil(t, err)
		assert.NotEmpty(t, c)
		assert.Equal(t, 200, rec.Code)
		t.Log("body: ", rec.Body.String(), err)
	})
}

func TestConfigFactory_Resource(t *testing.T) {
	config := gorm.DefaultConfig()
	config.Debug = true
	config.DSN = "root:root@tcp(127.0.0.1:3306)/juno?charset=utf8&parseTime=True&loc=Local"
	factory := ConfigFactory{
		DB: config.Build(),
	}

	factory.DropTableIfExists("resources")
	factory.DropTableIfExists("resource_items")
	factory.AutoMigrate(&Resource{})
	factory.AutoMigrate(&ResourceItem{})
	var pid string
	t.Run("add resource", func(t *testing.T) {
		reqJSON := `{"name":"main", "items":[{"key":"user","default":"root", "kind":2}, {"key":"password", "default":"123456", "kind":7}]}`
		req := httptest.NewRequest(http.MethodPost, "/resource", strings.NewReader(reqJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.AddResource(c)
		assert.Nil(t, err)
		pid = rec.Body.String()
		assert.NotEmpty(t, pid)
		t.Log(pid)
		assert.Equal(t, 201, rec.Code)
	})

	t.Run("list resource", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/resource", nil)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.ListResources(c)
		assert.Nil(t, err)
		t.Log(rec.Body.String(), rec.Code)
	})
}

func Test_applyResourceTemplate(t *testing.T) {
	tmpl := `{{.user}}:{{.password}}@tcp({{.host}}:{{.port}})`
	resource := Resource{
		Items: []ResourceItem{
			{Key: "user", Default: "root", Kind: 2},
			{Key: "password", Default: "root", Kind: 8},
			{Key: "host", Default: "127.0.0.1", Kind: 2},
			{Key: "port", Default: "3306", Kind: 1},
		},
	}

	content := applyResourceTemplate(tmpl, resource, true)
	fmt.Printf("content => %+v\n", content)
	content2 := applyResourceTemplate(tmpl, resource, false)
	fmt.Printf("content => %+v\n", content2)
}

func TestConfigFactory_Demo(t *testing.T) {
	config := gorm.DefaultConfig()
	config.Debug = true
	config.DSN = "root:root@tcp(127.0.0.1:3306)/juno?charset=utf8&parseTime=True&loc=Local"
	factory := ConfigFactory{
		DB: config.Build(),
	}

	factory.DropTable("templates")
	factory.DropTable("template_items")
	factory.DropTableIfExists("projects")
	factory.DropTableIfExists("project_configs")
	factory.DropTableIfExists("project_config_items")
	factory.DropTableIfExists("resources")
	factory.DropTableIfExists("resource_items")

	factory.AutoMigrate(&Template{})
	factory.AutoMigrate(&TemplateItem{})
	factory.AutoMigrate(&Project{})
	factory.AutoMigrate(&ProjectConfig{})
	factory.AutoMigrate(&ProjectConfigItem{})
	factory.AutoMigrate(&Resource{})
	factory.AutoMigrate(&ResourceItem{})

	// --------------- 准备数据
	var tid string
	// 1. 添加一个mysql模板
	t.Run("add template", func(t *testing.T) {
		reqJSON := `{"prefix":"jupiter.mysql", "version":0, "items": [
			{"field":"timeout", "kind":2, "default":"1s"}, 
			{"field":"dsn", "kind":7, "default":"{{.user}}:{{.password}}@tcp({{.host}}:{{.port}})"}
		]}`
		req := httptest.NewRequest(http.MethodPost, "/template", strings.NewReader(reqJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.AddTemplate(c)
		assert.Nil(t, err)
		tid = rec.Body.String()
		assert.NotEmpty(t, tid)
		t.Log(tid)
		assert.Equal(t, 201, rec.Code)
	})

	// 2. 添加一个资源
	var rid string
	t.Run("add resource", func(t *testing.T) {
		reqJSON := `{"name":"ali.rds.stt.master", "items":[
			{"key":"user","default":"root", "kind":2}, 
			{"key":"password", "default":"123456", "kind":8},
			{"key":"host", "default":"127.0.0.1", "kind":2},
			{"key":"port", "default":"3306", "kind":1}
		]}`
		req := httptest.NewRequest(http.MethodPost, "/resource", strings.NewReader(reqJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.AddResource(c)
		assert.Nil(t, err)
		rid = rec.Body.String()
		assert.NotEmpty(t, rid)
		t.Log(rid)
		assert.Equal(t, 201, rec.Code)
	})

	/*
		reqJSON := `{"id":2, "items":[
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"timeout", "value":"1s", "kind":3},
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"close", "value":"1s", "kind":2},
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"endpoints", "value":"A", "kind":2, "is_array":true},
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"endpoints", "value":"B", "kind":2, "is_array":true}
		]}`
	*/

	// 3. 添加一个应用
	var pid string
	t.Run("add project", func(t *testing.T) {
		reqJSON := `{"name":"myapp", "env":"pre", "items": []}`
		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(reqJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.AddProject(c)
		assert.Nil(t, err)
		pid = rec.Body.String()
		assert.NotEmpty(t, pid)
		t.Log(pid)
		assert.Equal(t, 201, rec.Code)
	})

	// 4. 为应用添加配置项, 客户端选择模板，并弹窗设置实例化名(stt_config), 然后调用接口创建配置项
	t.Run("add project config items", func(t *testing.T) {
		reqJSON := `{"id":` + pid + `,"items":[
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"timeout", "value":"1s", "kind":3},
			{"prefix":"jupiter.mysql", "key":"stt_config", "field":"dsn", "value":"{{.user}}:{{.password}}@tcp({{.host}}:{{.port}})", "kind":7}
		]}`
		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(reqJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.AddProjectConfigItems(c)
		assert.Nil(t, err)
		assert.NotEmpty(t, c)
		assert.Equal(t, 201, rec.Code)
		t.Log("body: ", rec.Body.String(), err)
	})

	// 5. 前端通过get config接口获取应用的配置项
	t.Run("get config", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/project/config", nil)
		q := req.URL.Query()
		q.Add("id", pid)
		q.Add("format", "yaml")
		q.Add("pretty", "true")
		req.URL.RawQuery = q.Encode()
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.GetProjectConfig(c)
		assert.Nil(t, err)
		assert.NotEmpty(t, c)
		assert.Equal(t, 200, rec.Code)
		t.Log("body: ", rec.Body.String(), err)
	})

	// 6. 对kind为资源的配置项，进行标记。让用户从资源列表中选择资源, 填充配置项. value为资源ID
	t.Run("update project config", func(t *testing.T) {
		reqJSON := `{"id":2, "prefix":"jupiter.mysql", "key":"stt_config", "field":"dsn", "value":"{{.user}}:{{.password}}@tcp({{.host}}:{{.port}})", "kind":7, "resource":{"id":1}}}`
		req := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(reqJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.UpdateProjectConfigItem(c)
		assert.Nil(t, err)
		assert.NotEmpty(t, c)
		assert.Equal(t, 201, rec.Code)
		t.Log("body: ", rec.Body.String(), err)
	})

	// 7. 前端通过get config接口获取应用的配置项
	t.Run("get config", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/project/config", nil)
		q := req.URL.Query()
		q.Add("id", pid)
		q.Add("format", "yaml")
		q.Add("pretty", "true")
		req.URL.RawQuery = q.Encode()
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := echo.New().NewContext(req, rec)
		err := factory.GetProjectConfig(c)
		assert.Nil(t, err)
		assert.NotEmpty(t, c)
		assert.Equal(t, 200, rec.Code)
		t.Log("body: ", rec.Body.String(), err)
	})

	// ---- 测试通过模板添加配置项

	// ---- 填充配置项中的资源项
}
