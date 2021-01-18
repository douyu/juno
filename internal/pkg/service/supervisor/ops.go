package supervisor

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

// DefaultAPIHost 默认API接口地址
const DefaultAPIHost string = "http://www.gitcenter.dev"

type Client struct {
	Host string
	mac  *Mac
}

func NewOpsClient(host string, mac *Mac) *Client {
	if host == "" {
		host = DefaultAPIHost
	}
	return &Client{host, mac}
}

type BaseRet struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

type CreateProjectReq struct {
	ProjectName string `json:"project_name"`
	DeployPath  string `json:"deploy_path"`
	Username    string `json:"username"`
	Password    string `json:"password"`
}

type CreateProjectRet struct {
	BaseRet
	Data CreateProjectDataRet `json:"data"`
}

type CreateProjectDataRet struct {
	AccessKey    string `json:"access_key"`
	AccessSecret string `json:"access_secret"`
}

func (t *CreateProjectReq) ToString() string {
	tmp, err := json.Marshal(t)
	if err != nil {
		return ""
	}
	return string(tmp)
}

func (t *CreateProjectRet) ToString() string {
	tmp, err := json.Marshal(t)

	if err != nil {
		return ""
	}

	return string(tmp)
}

func (c *Client) CreateProject(req *CreateProjectReq) (*CreateProjectRet, error) {
	var url = c.Host + "/v2/project"

	response, err := PostJSON(url, req)
	if err != nil {
		return nil, err
	}

	var ret *CreateProjectRet
	err = json.Unmarshal(response, &ret)
	if err != nil {
		return nil, fmt.Errorf(fmt.Sprintf("CreateProject json.Unmarshal(%s) error(%v)", response, err))
	}

	return ret, nil
}

func (c *Client) Supervisor(req *OpsSupervisorReq) (*OpsSupervisorRet, error) {
	var url = c.Host + "/ctrl_supervisor"
	opsHeaders := c.mac.GenarateHeaderMap()

	reqJson, _ := json.Marshal(req)
	response, err := PostJSON(url, req, opsHeaders)
	if err != nil {
		return nil, err
	}

	var ret *OpsSupervisorRet
	err = json.Unmarshal(response, &ret)
	if err != nil {
		return nil, fmt.Errorf(fmt.Sprintf("Supervisor json.Unmarshal(%s) error(%v)", response, err))
	}

	return ret, nil
}

// PostJSON post json 数据请求
func PostJSON(uri string, v interface{}, headers ...map[string]string) ([]byte, error) {
	var bs []byte
	bs, err := json.Marshal(v)
	if err != nil {
		return nil, err
	}

	bf := bytes.NewBuffer(bs)

	transCfg := &http.Transport{
		TLSClientConfig:   &tls.Config{InsecureSkipVerify: true},
		DisableKeepAlives: true,
	}
	client := &http.Client{Transport: transCfg, Timeout: time.Second * 300} // 根据情况调整超时时间
	req, err := http.NewRequest("POST", uri, bf)
	if err != nil {
		return nil, err
	}

	// set header
	req.Header.Set("Content-Type", "application/json;charset=utf-8")

	if len(headers) > 0 {
		for field, value := range headers[0] {
			req.Header.Set(field, value)
		}
	}

	// fmt.Println("=======> requests:", req, "\n", v)

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode != http.StatusOK {
		err = fmt.Errorf("http get error : uri=%v , statusCode=%v", uri, resp.StatusCode)
	}

	return ioutil.ReadAll(resp.Body)
}

type OpsSupervisorReq struct {
	ProjectName string   `json:"project_name"`
	ServersId   []string `json:"servers_id"`
	Cmd         string   `json:"cmd"`
	Args        []string `json:"args"`
}

type OpsSupervisorRet struct {
	BaseRet
	Data map[string]OpsSupervisorExecInfo `json:"data"`
}

type OpsSupervisorExecInfo struct {
	RetCode int    `json:"retcode"`
	StdErr  string `json:"stderr"`
	StdOut  string `json:"stdout"`
}
