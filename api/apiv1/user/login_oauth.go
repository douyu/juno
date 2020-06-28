package user

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"crypto/tls"
	"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/user"
	"github.com/douyu/juno/pkg/auth/authconfig"
	"github.com/douyu/juno/pkg/auth/social"
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/xlog"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
	"io/ioutil"
	"net/http"
	"net/url"
)

var (
	OauthStateCookieName = "oauth_state"
)

func GenStateString() (string, error) {
	rnd := make([]byte, 32)
	if _, err := rand.Read(rnd); err != nil {
		xlog.Error("failed to generate state string", zap.Error(err))
		return "", err
	}
	return base64.URLEncoding.EncodeToString(rnd), nil
}

func LoginOauth(c echo.Context) error {
	if authconfig.OAuthService == nil {
		return output.JSON(c, 1, "oauth not enabled")
	}

	name := c.Param("oauth")
	connect, ok := social.SocialMap[name]
	if !ok {
		return output.JSON(c, 2, fmt.Sprintf("No OAuth with name %s configured", name))
	}
	state := c.QueryParam("state")
	errorParam := c.QueryParam("error")
	if errorParam != "" {
		errorDesc := c.QueryParam("error_description")
		xlog.Error("failed to login ", zap.Any("error", errorParam), zap.String("errorDesc", errorDesc))
		//hs.redirectWithError(ctx, login.ErrProviderDeniedRequest, "error", errorParam, "errorDesc", errorDesc)
		return nil
	}

	code := c.QueryParam("code")
	if code == "" {
		state, err := GenStateString()
		if err != nil {
			xlog.Error("Generating state string failed", zap.Error(err))
			return output.JSON(c, 3, "An internal error occurred")
		}

		hashedState := hashStatecode(state, authconfig.OAuthService.OAuthInfos[name].ClientSecret)

		c.SetCookie(&http.Cookie{
			Name:     OauthStateCookieName,
			Value:    url.QueryEscape(hashedState),
			MaxAge:   cfg.Cfg.Auth.OauthStateCookieMaxAge,
			Path:     "/",
			Domain:   "",
			Secure:   false, // todo
			HttpOnly: true,
		})
		if authconfig.OAuthService.OAuthInfos[name].HostedDomain == "" {
			return c.Redirect(http.StatusFound, connect.AuthCodeURL(state, oauth2.AccessTypeOnline))
		} else {
			return c.Redirect(http.StatusFound, connect.AuthCodeURL(state, oauth2.SetAuthURLParam("hd", authconfig.OAuthService.OAuthInfos[name].HostedDomain), oauth2.AccessTypeOnline))
		}
	}

	cookie, err := c.Cookie(OauthStateCookieName)
	if err != nil {
		return output.JSON(c, 4, "system error: "+err.Error())
	}
	cookieState, _ := url.QueryUnescape(cookie.Value)

	// delete cookie
	c.SetCookie(&http.Cookie{
		Name:     OauthStateCookieName,
		Value:    "",
		MaxAge:   -1,
		Path:     "/",
		Domain:   "",
		Secure:   false, // todo
		HttpOnly: true,
	})

	if cookieState == "" {
		return output.JSON(c, 5, "login.OAuthLogin(missing saved state)")
	}

	queryState := hashStatecode(state, authconfig.OAuthService.OAuthInfos[name].ClientSecret)
	xlog.Info("state check", zap.Any("queryState", queryState), zap.Any("cookieState", cookieState))
	if cookieState != queryState {
		return output.JSON(c, 6, "login.OAuthLogin(state mismatch)")
	}

	// handle call back
	tr := &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: authconfig.OAuthService.OAuthInfos[name].TlsSkipVerify,
		},
	}
	oauthClient := &http.Client{
		Transport: tr,
	}

	if authconfig.OAuthService.OAuthInfos[name].TlsClientCert != "" || authconfig.OAuthService.OAuthInfos[name].TlsClientKey != "" {
		cert, err := tls.LoadX509KeyPair(authconfig.OAuthService.OAuthInfos[name].TlsClientCert, authconfig.OAuthService.OAuthInfos[name].TlsClientKey)
		if err != nil {
			xlog.Error("Failed to setup TlsClientCert", zap.String("oauth", name), zap.Error(err))
			return output.JSON(c, 7, "login.OAuthLogin(Failed to setup TlsClientCert)")
		}

		tr.TLSClientConfig.Certificates = append(tr.TLSClientConfig.Certificates, cert)
	}

	if authconfig.OAuthService.OAuthInfos[name].TlsClientCa != "" {
		caCert, err := ioutil.ReadFile(authconfig.OAuthService.OAuthInfos[name].TlsClientCa)
		if err != nil {
			xlog.Error("Failed to setup TlsClientCa", zap.String("oauth", name), zap.Error(err))
			return output.JSON(c, 8, "login.OAuthLogin(Failed to setup TlsClientCa)")
		}
		caCertPool := x509.NewCertPool()
		caCertPool.AppendCertsFromPEM(caCert)

		tr.TLSClientConfig.RootCAs = caCertPool
	}

	oauthCtx := context.WithValue(context.Background(), oauth2.HTTPClient, oauthClient)

	// get token from provider
	token, err := connect.Exchange(oauthCtx, code)
	if err != nil {
		return output.JSON(c, 9, "login.OAuthLogin(NewTransportWithCode)")
	}
	// token.TokenType was defaulting to "bearer", which is out of spec, so we explicitly set to "Bearer"
	token.TokenType = "Bearer"

	xlog.Debug("OAuthLogin Got token", zap.Any("token", token))

	// set up oauth2 client
	client := connect.Client(oauthCtx, token)

	// get user info
	userInfo, err := connect.UserInfo(client, token)
	if err != nil {
		if _, ok := err.(*social.Error); ok {
			// todo
			return c.Redirect(http.StatusFound, cfg.Cfg.AppSubUrl+"/login")
		} else {
			return output.JSON(c, 10, fmt.Sprintf("login.OAuthLogin(get info from %s)", name), err.Error())
		}
	}

	xlog.Debug("OAuthLogin got user info", zap.Any("userInfo", userInfo))

	// validate that we got at least an email address
	if userInfo.Email == "" {
		return c.Redirect(http.StatusFound, cfg.Cfg.AppSubUrl+"/login")
	}

	// validate that the email is allowed to login to juno
	if !connect.IsEmailAllowed(userInfo.Email) {
		//hs.redirectWithError(ctx, login.ErrEmailNotAllowed)
		return c.Redirect(http.StatusFound, cfg.Cfg.AppSubUrl+"/login")
	}

	mysqlUser := &db.User{
		Username: userInfo.Name + "_" + name,
		Nickname: userInfo.Login+ "_" + name,
		Email:    userInfo.Email,
		Oauth:    "oauth_" + name,
		OauthId:  userInfo.Id,
	}

	// create or update oauth user
	err = user.User.CreateOrUpdateOauthUser(mysqlUser)
	if err != nil {
		return output.JSON(c, 11, "create or update oauth user error", err.Error())
	}
	xlog.Debug("OAuthLogin got user info", zap.Any("mysqlUserInfo", mysqlUser))

	err = user.Session.Save(c, mysqlUser)
	if err != nil {
		return output.JSON(c, 12, "create or update oauth user error", err.Error())
	}

	toURULCookie, err :=c.Cookie("redirect_juno_to")
	toURL := cfg.Cfg.AppSubUrl + "/"
	if err != nil {
		return c.Redirect(http.StatusFound, toURL)
	}

	toURL, err = url.QueryUnescape(toURULCookie.Value)
	if err != nil {
		return c.Redirect(http.StatusFound, toURL)
	}
	return c.Redirect(http.StatusFound, toURL)


}

func hashStatecode(code, seed string) string {
	hashBytes := sha256.Sum256([]byte(code + cfg.Cfg.App.SecretKey + seed))
	return hex.EncodeToString(hashBytes[:])
}
