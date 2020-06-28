package social

type OAuthType int

const (
	GITHUB OAuthType = iota + 1
	GOOGLE
	GENERIC
	GRAFANA_COM
	GITLAB
)
