package authconfig

type OAuthInfo struct {
	ClientId           string
	ClientSecret       string
	Scopes             []string
	AuthUrl            string
	TokenUrl           string
	Enable             bool
	EmailAttributeName string
	EmailAttributePath string
	RoleAttributePath  string
	AllowedDomains     []string
	HostedDomain       string
	ApiUrl             string
	AllowSignup        bool
	Name               string
	TlsClientCert      string
	TlsClientKey       string
	TlsClientCa        string
	TlsSkipVerify      bool
}

type OAuther struct {
	OAuthInfos map[string]*OAuthInfo
}

var OAuthService *OAuther
