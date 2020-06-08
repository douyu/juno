package mock

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/douyu/juno/internal/pkg/model/db"
	"github.com/labstack/echo/v4"
)

func mockApp(url string, router *echo.Echo) {
	file, err := ioutil.ReadFile("./cmd/install/mockdata/app.json")
	if err != nil {
		panic(err)
	}
	param := string(file)
	// 发起post请求，以表单形式传递参数
	body := PostForm(url, param, router)
	fmt.Println(string(body))
}

func mockAppNode(url string, router *echo.Echo) {
	mockAppNodeByFile("./cmd/install/mockdata/appnode1.json", url, router)
	mockAppNodeByFile("./cmd/install/mockdata/appnode2.json", url, router)
	mockAppNodeByFile("./cmd/install/mockdata/appnode3.json", url, router)
	mockAppNodeByFile("./cmd/install/mockdata/appnode4.json", url, router)
}

func mockAppNodeByFile(fileName, url string, router *echo.Echo) {
	file, err := ioutil.ReadFile(fileName)
	if err != nil {
		panic(err)
	}
	param := string(file)
	// 发起post请求，以表单形式传递参数
	body := PostForm(url, param, router)
	fmt.Println(string(body))
}

func mockTplCreate(url string, router *echo.Echo) {
	mockTplByFile("mysql", "./cmd/install/mockdata/configtpl1.json", url, router)
	mockTplByFile("mysql", "./cmd/install/mockdata/configtpl2.json", url, router)
	mockTplByFile("redis", "./cmd/install/mockdata/configtpl3.json", url, router)
	mockTplByFile("grpc", "./cmd/install/mockdata/configtpl4.json", url, router)
}

func mockTplByFile(tplType, fileName string, url string, router *echo.Echo) {
	file, err := ioutil.ReadFile(fileName)
	if err != nil {
		panic(err)
	}
	req := map[string]interface{}{
		"tpl_type": tplType,
		"content":  string(file),
	}
	paramByte, _ := json.Marshal(req)

	// 发起post请求，以表单形式传递参数
	PostForm(url, string(paramByte), router)
}

func mockConfig(urlFile string, urlContent string, router *echo.Echo) {
	mockConfigByFile("./cmd/install/mockdata/appconfigfile1.json", "./cmd/install/mockdata/appconfigcontent1.toml", urlFile, urlContent, router)
	mockConfigByFile("./cmd/install/mockdata/appconfigfile2.json", "./cmd/install/mockdata/appconfigcontent2.toml", urlFile, urlContent, router)
	mockConfigByFile("./cmd/install/mockdata/appconfigfile3.json", "./cmd/install/mockdata/appconfigcontent3.toml", urlFile, urlContent, router)
	mockConfigByFile("./cmd/install/mockdata/appconfigfile4.json", "./cmd/install/mockdata/appconfigcontent4.toml", urlFile, urlContent, router)
}

func mockConfigByFile(configFile string, configContent string, urlFile string, urlContent string, router *echo.Echo) {
	file, err := ioutil.ReadFile(configFile)
	if err != nil {
		panic(err)
	}
	// 发起post请求，以表单形式传递参数
	body := PostForm(urlFile, string(file), router)
	fmt.Println("urlFile------>", configFile)
	fmt.Println(string(body))
	resp := struct {
		Data db.CmcApp `json:"data"`
	}{}
	err = json.Unmarshal(body, &resp)
	if err != nil {
		panic(err)
	}

	file, err = ioutil.ReadFile(configContent)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(file))
	param1 := map[string]interface{}{
		"caid":  resp.Data.Id,
		"key":   "default",
		"value": string(file),
	}

	tt, _ := json.Marshal(param1)
	// 发起post请求，以表单形式传递参数
	body = PostForm(urlContent, string(tt), router)
	fmt.Println(string(body))
}

func mockParse(url string, router *echo.Echo) {
	// 发起post请求，以表单形式传递参数
	PostForm(url, "", router)
}

func mockCreateAdmin(url string, router *echo.Echo) {
	// 发起post请求，以表单形式传递参数
	param := `{
	"username": "admin",
	"nickname": "admin",
	"password": "21232f297a57a5a743894a0e4a801fc3",
	"access": "admin"
}`

	body := PostForm(url, param, router)
	fmt.Println(string(body))
}
