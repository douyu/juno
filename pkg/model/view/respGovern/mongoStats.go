package respGovern

import mgo "gopkg.in/mgo.v2"

// mongo 状态信息
type MongoStats struct {
	RuntimeStats
	Mongos map[string]OneMongo `json:"mongos"`
}

type OneMongo struct {
	LiveServers []string `json:"liveServers"`
	Mode        mgo.Mode `json:"mode"`
}
