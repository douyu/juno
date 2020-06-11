package grpcgovern

import (
	"encoding/json"
	"fmt"
)

type ProfResp struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data string `json:"data"`
}

// 将appname设置config的value
func (g *GrpcGovern) Pprof(env, idcCode, ip, port, fileType string) (resp []byte, err error) {
	params := map[string]string{
		"ip":       ip,
		"port":     port,
		"fileType": fileType,
	}
	profResp := ProfResp{}
	resp, err = g.PostStream(env, idcCode, UrlPprofV2Info, params)
	if err != nil {
		return
	}

	if err = json.Unmarshal(resp, &profResp); err != nil {
		return resp, nil
		//return resp, fmt.Errorf("json Unmarshal error: %v", err)
	}
	if profResp.Code != 0 {
		return resp, fmt.Errorf("msg=%v,data=%v", profResp.Msg, profResp.Data)
	}
	return []byte(profResp.Data), nil
}
