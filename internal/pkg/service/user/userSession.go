package user

import (
	"github.com/douyu/jupiter/pkg/xlog"

	"github.com/douyu/jupiter/pkg/conf"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

const DefaultKey = "session_juno"

type userSession struct {
	option sessions.Options
}

func InitUserSession() *userSession {
	return &userSession{
		option: sessions.Options{
			Path:     "/",
			MaxAge:   conf.GetInt("session.maxAge"),
			HttpOnly: true,
		},
	}
}

func (u *userSession) Save(c echo.Context, user *db.User) error {
	sess, err := session.Get(DefaultKey, c)
	if err != nil {
		xlog.Error("userSession", xlog.Any("userSession get session err:", err.Error()))
		return err
	}
	sess.Options = &u.option
	sess.Values["user"] = user
	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		xlog.Error("userSession", xlog.Any("userSession save session err:", err.Error()))
		return err
	}
	return err
}

func (u *userSession) Read(c echo.Context) *db.User {
	sess, err := session.Get(DefaultKey, c)
	if err != nil {
		xlog.Error("userSession", xlog.Any("userSession read session err:", err.Error()))
		return nil
	}
	userTemp := sess.Values["user"]
	user, ok := userTemp.(*db.User)
	if !ok {
		return nil
	}
	return user
}

func (u *userSession) Logout(c echo.Context) error {
	sess, _ := session.Get(DefaultKey, c)
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	}
	delete(sess.Values, "user")
	return sess.Save(c.Request(), c.Response())
}

func NewSessionStore() sessions.Store {
	storeTyp := conf.GetString("session.type")
	switch storeTyp {
	case "redis":
	case "files":
	default:
		xlog.Info("NewSessionStore", xlog.Any("cookie", conf.GetString("session.secret")))
		return sessions.NewCookieStore([]byte(conf.GetString("session.secret")))
	}
	return nil
}
