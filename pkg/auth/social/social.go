package social

import (
	"context"
	"github.com/davecgh/go-spew/spew"
	"github.com/douyu/juno/pkg/auth/authconfig"
	"github.com/douyu/jupiter/pkg/conf"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/spf13/cast"
	"golang.org/x/oauth2"
	"net/http"
	"strings"
)

type BasicUserInfo struct {
	Id      string
	Name    string
	Email   string
	Login   string
	Company string
	Role    string
	Groups  []string
}

type SocialConnector interface {
	Type() int
	UserInfo(client *http.Client, token *oauth2.Token) (*BasicUserInfo, error)
	IsEmailAllowed(email string) bool
	IsSignupAllowed() bool

	AuthCodeURL(state string, opts ...oauth2.AuthCodeOption) string
	Exchange(ctx context.Context, code string, authOptions ...oauth2.AuthCodeOption) (*oauth2.Token, error)
	Client(ctx context.Context, t *oauth2.Token) *http.Client
	TokenSource(ctx context.Context, t *oauth2.Token) oauth2.TokenSource
}

type SocialBase struct {
	*oauth2.Config
	log            *xlog.Logger
	allowSignup    bool
	allowedDomains []string
}

type Error struct {
	s string
}

func (e *Error) Error() string {
	return e.s
}


var (
	SocialBaseUrl = "/api/admin/user/login/"
	SocialMap     = make(map[string]SocialConnector)
	allOauthes    = []string{"github", "gitlab", "google", "generic_oauth" }
)

func newSocialBase(name string, config *oauth2.Config, info *authconfig.OAuthInfo) *SocialBase {
	logger := xlog.DefaultLogger
	return &SocialBase{
		Config:         config,
		log:            logger,
		allowSignup:    info.AllowSignup,
		allowedDomains: info.AllowedDomains,
	}
}

func NewOAuthService() {
	authconfig.OAuthService = &authconfig.OAuther{}
	authconfig.OAuthService.OAuthInfos = make(map[string]*authconfig.OAuthInfo)

	for _, name := range allOauthes {
		key := "auth." + name + "."
		info := &authconfig.OAuthInfo{
			ClientId:           conf.GetString(key + "clientId"),
			ClientSecret:       conf.GetString(key + "clientSecret"),
			Scopes:             conf.GetStringSlice(key + "scopes"),
			AuthUrl:            conf.GetString(key + "authUrl"),
			TokenUrl:           conf.GetString(key + "tokenUrl"),
			ApiUrl:             conf.GetString(key + "apiUrl"),
			Enabled:            conf.GetBool(key + "enabled"),
			EmailAttributeName: conf.GetString(key + "emailAttributeName"),
			EmailAttributePath: conf.GetString(key + "emailAttributePath"),
			RoleAttributePath:  conf.GetString(key + "roleAttributePath"),
			AllowedDomains:     conf.GetStringSlice(key + "allowedDomains"),
			HostedDomain:       conf.GetString(key + "hostedDomain"),
			AllowSignup:        conf.GetBool(key + "allowSignUp"),
			Name:               name,
			TlsClientCert:      conf.GetString(key + "tlsClientCert"),
			TlsClientKey:       conf.GetString(key + "tlsClientKey"),
			TlsClientCa:        conf.GetString(key + "tlsClientCa"),
			TlsSkipVerify:      conf.GetBool(key + "tlsSkipVerifyInsecure"),
		}

		if !info.Enabled {
			continue
		}

		authconfig.OAuthService.OAuthInfos[name] = info

		config := oauth2.Config{
			ClientID:     info.ClientId,
			ClientSecret: info.ClientSecret,
			Endpoint: oauth2.Endpoint{
				AuthURL:  info.AuthUrl,
				TokenURL: info.TokenUrl,
			},
			RedirectURL: strings.TrimSuffix(cfg.Cfg.AppUrl, "/") + SocialBaseUrl + name,
			Scopes:      info.Scopes,
		}

		spew.Dump("config",config)

		// GitHub.
		if name == "github" {
			SocialMap["github"] = &SocialGithub{
				SocialBase:           newSocialBase(name, &config, info),
				apiUrl:               info.ApiUrl,
				teamIds:              cast.ToIntSlice(conf.GetSlice(key + "team_ids")),
				allowedOrganizations: conf.GetStringSlice(key + "allowed_organizations"),
			}
		}

		// GitLab.
		if name == "gitlab" {
			SocialMap["gitlab"] = &SocialGitlab{
				SocialBase:    newSocialBase(name, &config, info),
				apiUrl:        info.ApiUrl,
				allowedGroups: conf.GetStringSlice(key + "allowed_groups"),
			}
		}

		// Google.
		if name == "google" {
			SocialMap["google"] = &SocialGoogle{
				SocialBase:   newSocialBase(name, &config, info),
				hostedDomain: info.HostedDomain,
				apiUrl:       info.ApiUrl,
			}
		}

		// Generic - Uses the same scheme as Github.
		if name == "generic_oauth" {
			SocialMap["generic_oauth"] = &SocialGenericOAuth{
				SocialBase:           newSocialBase(name, &config, info),
				apiUrl:               info.ApiUrl,
				emailAttributeName:   info.EmailAttributeName,
				emailAttributePath:   info.EmailAttributePath,
				roleAttributePath:    info.RoleAttributePath,
				teamIds:              cast.ToIntSlice(conf.GetSlice(key + "team_ids")),
				allowedOrganizations: conf.GetStringSlice(key + "allowed_organizations"),
			}
		}
	}
}

// GetOAuthProviders returns available oauth providers and if they're enabled or not
var GetOAuthProviders = func() map[string]bool {
	result := map[string]bool{}

	for _, name := range allOauthes {
		result[name] = conf.GetBool("auth." + name + ".enabled")
	}
	return result
}
