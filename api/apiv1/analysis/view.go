package analysis

import "github.com/douyu/juno/pkg/model/db"

type ReqTopologyList struct {
	db.AppTopology
	CurrentPage int `query:"currentPage"`
	PageSize    int `query:"pageSize"`
}

type RespRelationship struct {
	Aid        int    `json:"aid"`
	Name       string `json:"name"`
	Type       string `json:"type"`
	Source     string `json:"source"`
	Target     string `json:"target"`
	MateData   string `json:"mate_data"`
	UpdateTime int64  `json:"update_time"`
}
