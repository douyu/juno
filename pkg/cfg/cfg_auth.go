package cfg

type Auth struct {
	// Auth
	LoginCookieName                  string
	LoginMaximumInactiveLifetimeDays int
	LoginMaximumLifetimeDays         int
	TokenRotationIntervalMinutes     int
	DisableLoginForm                 bool
	DisableSignoutMenu               bool
	SignoutRedirectUrl               string
	OauthAutoLogin                   bool
	OauthStateCookieMaxAge           int
	ApiKeyMaxSecondsToLive           int
}

type Server struct {
	Host           string
	Port           int
	Domain         string
	RootUrl        string
	StaticRootPath string
	EnableGzip     bool
}

type App struct {
	SecretKey string
}
