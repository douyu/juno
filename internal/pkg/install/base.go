package install

import (
	"io/ioutil"
	"net/http/httptest"
	"strings"

	"github.com/douyu/juno/api/apiv1/confgo"
	"github.com/douyu/juno/api/apiv1/resource"
	"github.com/douyu/juno/api/apiv1/system"
	"github.com/douyu/juno/api/apiv1/user"
	"github.com/labstack/echo/v4"
)

func MockData() {
	router := echo.New()
	var (
		urlAppPut          = "/app/put"
		urlAppNodePut      = "/app_node/put"
		urlConfigTplCreate = "/config/tpl/create"
		//urlConfigFileCreate := "/config/file/create"
		//urlConfigContentUpdate := "/config/content/update"
		//urlConfigGeneratorParse := "/config/parse"
		urlSystemSetUpdate = "/system/setting/create"
		urlUserCreate      = "/user/create"
	)

	router.POST(urlAppPut, resource.AppPut)
	router.POST(urlAppNodePut, resource.AppNodePut)
	router.POST(urlConfigTplCreate, confgo.TplCreate)
	router.POST(urlUserCreate, user.Create)
	router.POST(urlSystemSetUpdate, system.SettingCreate)

	mockApp(urlAppPut, router)
	mockAppNode(urlAppNodePut, router)
	//mockTplCreate(urlConfigTplCreate, router)
	mockSystemSet(urlSystemSetUpdate, router)
	// mockParse(urlConfigGeneratorParse, router)
	mockCreateUser(urlUserCreate, router)
}

func MustMockSysTemSetData() {
	router := echo.New()
	urlSystemSetUpdate := "/system/setting/create"
	router.POST(urlSystemSetUpdate, system.SettingCreate)
	mockSystemSet(urlSystemSetUpdate, router)
	mockAdminUser()
}

func MustMockData() {
	router := echo.New()
	urlSystemCreate := "/system/setting/create"
	router.POST(urlSystemCreate, system.SettingCreate)
	mockGrafanaSetting(urlSystemCreate, router)
	mockAdminUser()

}

func PostForm(uri string, param string, router *echo.Echo) []byte {
	// 构造post请求
	req := httptest.NewRequest("POST", uri, strings.NewReader(param))
	req.Header.Set("Content-Type", "application/json")

	// 初始化响应
	w := httptest.NewRecorder()

	// 调用相应handler接口
	router.ServeHTTP(w, req)

	// 提取响应
	result := w.Result()
	defer result.Body.Close()

	// 读取响应body
	body, _ := ioutil.ReadAll(result.Body)
	return body
}

func Get(uri string, router *echo.Echo) []byte {
	// 构造get请求
	req := httptest.NewRequest("GET", uri, nil)
	// 初始化响应
	w := httptest.NewRecorder()

	// 调用相应的handler接口
	router.ServeHTTP(w, req)

	// 提取响应
	result := w.Result()
	defer result.Body.Close()

	// 读取响应body
	body, _ := ioutil.ReadAll(result.Body)
	return body
}
