package model

import "encoding/json"

type ConfigInfo struct {
	RegisterKey
	meta configServerMeta
}

// 治理的configurators信息
type ConfiguratorsEtcdInfo struct {
	RawValue string `json:"rawValue"` // 检验数据
	RegKey   string `json:"regKey"`
	Type     string `json:"type"` // govern,grpc,http
	Ip       string `json:"ip"`
	Port     string `json:"port"`
	Address  string `json:"address"`
	Labels   struct {
		Enable   string `json:"enable"`
		Env      string `json:"env"`
		Group    string `json:"group"`
		Hostname string `json:"hostname"`
		Weight   string `json:"weight"`
	} `json:"labels"`
}

func (k *ConfigInfo) ParseValue(bs []byte) (err error) {
	if err = json.Unmarshal(bs, &k.meta); err != nil {
		return
	}
	k.meta.originValue = bs
	return nil
}

type configServerMeta struct {
	originValue []byte
	Name        string `json:"name"`
	Scheme      string `json:"schema"`
	Address     string `json:"address"`
	Labels      struct {
		Enable   string `json:"enable"`
		Env      string `json:"env"`
		Group    string `json:"group"`
		Hostname string `json:"hostname"`
		Weight   string `json:"weight"`
	} `json:"labels"`
	Services map[string]registerOneService `json:"services"`
}

func (k *ConfigInfo) Enable() string {
	return k.meta.Labels.Enable
}

func (k *ConfigInfo) Group() string {
	return k.meta.Labels.Group
}

func (k *ConfigInfo) Weight() string {
	return k.meta.Labels.Weight
}
func (k *ConfigInfo) Value() []byte {
	return k.meta.originValue
}
