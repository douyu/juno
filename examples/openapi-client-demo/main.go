// Open API 调用示例

package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/douyu/juno/pkg/util"
	"github.com/go-resty/resty/v2"
	"github.com/labstack/gommon/random"
)

var (
	client        = resty.New()
	configID uint = 0
)

const (
	appId     = "0aVlSejG9ydwyw5z"
	appSecret = "WbRH1u3TIwHDdTv4Jvq7jYp967LwHHKv"
)

func main() {
	printConfigList()
	createConfig()
	publishConfig()
	updateConfig()
	deleteConfig()
}

func genSign() (int64, string, string) {
	nonceStr := random.String(16, random.Alphanumeric)
	ts := time.Now().Unix()
	return ts, nonceStr, openAuthSign(appId, nonceStr, appSecret, ts)
}

func printConfigList() {
	req := client.R()
	ts, nonceStr, sign := genSign()
	req.SetQueryParams(map[string]string{
		"app_id":    appId,
		"timestamp": strconv.Itoa(int(ts)),
		"nonce_str": nonceStr,
		"sign":      sign,
		"app_name":  "juno-admin",
		"env":       "dev",
	})

	resp, err := req.Get("http://127.0.0.1:50000/api/v1/confgo/config/list")
	if err != nil {
		fmt.Printf("err: %s", err.Error())
		return
	}

	fmt.Printf("%s", string(resp.Body()))
}

func createConfig() {
	req := client.R()
	ts, nonceStr, sign := genSign()
	req.SetBody(map[string]interface{}{
		"app_id":    appId,
		"timestamp": int(ts),
		"nonce_str": nonceStr,
		"sign":      sign,
		"app_name":  "juno-admin",
		"env":       "dev",
		"host_name": []string{"dev_1"},
		"zone":      "WH",
		"file_name": "openapi-test",
		"format":    "toml",
	})

	resp, err := req.Post("http://127.0.0.1:50000/api/v1/confgo/config/create")
	if err != nil {
		fmt.Printf("err: %s", err.Error())
		return
	}

	respObj := struct {
		Data struct {
			ID uint `json:"id"`
		}
	}{}
	_ = json.Unmarshal(resp.Body(), &respObj)
	configID = respObj.Data.ID

	fmt.Printf("%s", string(resp.Body()))
}

func updateConfig() {
	req := client.R()
	ts, nonceStr, sign := genSign()
	req.SetBody(map[string]interface{}{
		"app_id":    appId,
		"timestamp": int(ts),
		"nonce_str": nonceStr,
		"sign":      sign,
		"host_name": []string{"dev_1"},
		"content":   "[database]\nmysql = \"{mysql_dev_1@1}}\"\nstr  = \"{{mysql_dev_1@1}}\"\n[asdsad.asdasd]\nasdasd = [\"{{mysql_dev_1@1}}\"]\n",
		"id":        configID,
		"message":   "sss",
	})

	resp, err := req.Post("http://127.0.0.1:50000/api/v1/confgo/config/update")
	if err != nil {
		fmt.Printf("err: %s", err.Error())
		return
	}

	fmt.Printf("%s", string(resp.Body()))
}

func publishConfig() {
	req := client.R()
	ts, nonceStr, sign := genSign()
	req.SetBody(map[string]interface{}{
		"app_id":    appId,
		"timestamp": int(ts),
		"nonce_str": nonceStr,
		"sign":      sign,
		"app_name":  "juno-admin",
		"env":       "dev",
		"host_name": []string{"dev_1"},
		"id":        1,
		"version":   "709229e560d4ff8a1fd978bb2f694900",
	})

	resp, err := req.Post("http://127.0.0.1:50000/api/v1/confgo/config/publish")
	if err != nil {
		fmt.Printf("err: %s", err.Error())
		return
	}

	fmt.Printf("%s", string(resp.Body()))
}

func deleteConfig() {
	req := client.R()
	ts, nonceStr, sign := genSign()
	req.SetBody(map[string]interface{}{
		"app_id":    appId,
		"timestamp": int(ts),
		"nonce_str": nonceStr,
		"sign":      sign,
		"id":        configID,
	})

	resp, err := req.Post("http://127.0.0.1:50000/api/v1/confgo/config/delete")
	if err != nil {
		fmt.Printf("err: %s", err.Error())
		return
	}

	fmt.Printf("%s", string(resp.Body()))
}

//计算签名
func openAuthSign(appId, nonceStr, secret string, timestamp int64) (sign string) {
	plainText := fmt.Sprintf("%s%s%s%d", appId, nonceStr, secret, timestamp)

	return util.Md5Str(plainText)
}
