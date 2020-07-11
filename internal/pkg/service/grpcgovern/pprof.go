package grpcgovern

import (
	"encoding/json"
	"errors"
	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/pkg/model/view"
)

type ProfResp struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data []byte `json:"data"`
}

// 将appname设置config的value
func (g *GrpcGovern) Pprof(env, zoneCode, ip, port, fileType string) (resp []byte, err error) {
	conn, err := clientproxy.ClientProxy.ServerProxyHTTPConn(env, zoneCode)
	if err != nil {
		return resp, err
	}

	req := view.ReqHTTPProxy{}
	//req.URL = fmt.Sprintf(QueryAgentUsedStatus, ipPort)
	req.Params = map[string]interface{}{
		"ip":       ip,
		"port":     port,
		"fileType": fileType,
	}
	response, err := conn.R().SetBody(req).Post(UrlPprofV1Info)
	if err != nil {
		return resp, err
	}
	profResp := ProfResp{}
	//fmt.Println(">>>>>>> response.Body()", string(response.Body()))
	if err = json.Unmarshal(response.Body(), &profResp); err != nil {
		return resp, err
	}
	if profResp.Code != 0 {
		return []byte(profResp.Data), errors.New(profResp.Msg)
	}
	return []byte(profResp.Data), nil
}
