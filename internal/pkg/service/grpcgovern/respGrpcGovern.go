package grpcgovern

import govern "github.com/douyu/juno/internal/pkg/model/view/respGovern"

type respHealthStats struct {
	Code int                  `json:"code"`
	Msg  string               `json:"msg"`
	Data []govern.HealthStats `json:"data"`
}

type respAppInfo struct {
	Code int              `json:"code"`
	Msg  string           `json:"msg"`
	Data []govern.AppInfo `json:"data"`
}

type respServerStats struct {
	Code int                  `json:"code"`
	Msg  string               `json:"msg"`
	Data []govern.ServerStats `json:"data"`
}

type respGustyStats struct {
	Code int                 `json:"code"`
	Msg  string              `json:"msg"`
	Data []govern.GustyStats `json:"data"`
}

type respGormStats struct {
	Code int                `json:"code"`
	Msg  string             `json:"string"`
	Data []govern.GormStats `json:"data"`
}

type respRedixStats struct {
	Code int                 `json:"code"`
	Msg  string              `json:"string"`
	Data []govern.RedixStats `json:"data"`
}

type respMongoStats struct {
	Code int                 `json:"code"`
	Msg  string              `json:"string"`
	Data []govern.MongoStats `json:"data"`
}

type respRestyStats struct {
	Code int                 `json:"code"`
	Msg  string              `json:"string"`
	Data []govern.RestyStats `json:"data"`
}

type respRocketmqStats struct {
	Code int                    `json:"code"`
	Msg  string                 `json:"string"`
	Data []govern.RocketmqStats `json:"data"`
}

type respDyrpcStats struct {
	Code int                 `json:"code"`
	Msg  string              `json:"string"`
	Data []govern.DyrpcStats `json:"data"`
}

type respBigmapStats struct {
	Code int                  `json:"code"`
	Msg  string               `json:"string"`
	Data []govern.BigmapStats `json:"data"`
}

type respBigcacheStats struct {
	Code int                    `json:"code"`
	Msg  string                 `json:"string"`
	Data []govern.BigcacheStats `json:"data"`
}

type respLeveldbStats struct {
	Code int                   `json:"code"`
	Msg  string                `json:"string"`
	Data []govern.LeveldbStats `json:"data"`
}

type respAppConfig struct {
	Code int                `json:"code"`
	Msg  string             `json:"msg"`
	Data []govern.AppConfig `json:"data"`
}

type respAppEnv struct {
	Code int             `json:"code"`
	Msg  string          `json:"msg"`
	Data []govern.AppEnv `json:"data"`
}

// 获取Grpc接口响应的类型的指针
func (g *GrpcGovern) buildGrpcResponse(typeId int) interface{} {
	switch typeId {
	case 1:
		return new(respHealthStats)
	case 2:
		return new(respAppInfo)
	case 3:
		return new(respServerStats)
	case 4:
		return new(respGustyStats)
	case 5:
		return new(respGormStats)
	case 6:
		return new(respRedixStats)
	case 7:
		return new(respMongoStats)
	case 8:
		return new(respRestyStats)
	case 9:
		return new(respRocketmqStats)
	case 10:
		return new(respDyrpcStats)
	case 11:
		return new(respBigmapStats)
	case 12:
		return new(respBigcacheStats)
	case 13:
		return new(respLeveldbStats)
	case 14:
		return new(respAppConfig)
	case 15:
		return new(respAppEnv)
	}

	return nil
}
