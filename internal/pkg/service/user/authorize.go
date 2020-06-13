package user

import (
	"encoding/base32"
	"errors"
	"fmt"
	"time"

	"github.com/douyu/juno/internal/pkg/model/db"

	"github.com/douyu/juno/internal/pkg/packages/gitlab"
	"github.com/gorilla/securecookie"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

func GitlabAuthCHeck(c echo.Context) (err error) {
	// when dealing with redirects we may need to adjust the content type. I
	// cannot, however, remember why, so need to revisit this line.
	c.Response().Header().Del("Content-Type")
	tmpUser, err := gitlab.IGitlab.Login(c.Response(), c.Request())
	if err != nil {
		fmt.Println("auth login error", "err", err.Error(), "host", c.Request().Host)
		return
	}
	// this will happen when the user is redirected by the remote provider as
	// part of the authorization workflow.
	if tmpUser == nil {
		log.Info("Gitlab user is nil", "Url", c.Request().URL, "Host", c.Request().Host)
		err = errors.New("git.xxx.com user is nil")
		return
	}
	var u db.User
	//// get the user from the database
	u = User.GetUserByUID(tmpUser.Uid)

	if u.Uid == 0 {
		// create the user account
		u = db.User{
			Uid:      tmpUser.Uid,
			Oaid:     tmpUser.Oaid,
			Username: tmpUser.Username,
			Nickname: tmpUser.Nickname,
			Token:    tmpUser.Token,
			Secret:   tmpUser.Secret,
			Email:    tmpUser.Email,
			Avatar:   tmpUser.Avatar,
			State:    tmpUser.State,
			WebUrl:   tmpUser.WebUrl,
			Hash: base32.StdEncoding.EncodeToString(
				securecookie.GenerateRandomKey(32),
			),
			CreateTime: time.Now().Unix(),
			UpdateTime: time.Now().Unix(),
		}
		User.Create(u)
	} else {
		// create the user account
		User.Update(u.Uid, &db.User{
			Token:      tmpUser.Token,
			Secret:     tmpUser.Secret,
			Email:      tmpUser.Email,
			Avatar:     tmpUser.Avatar,
			State:      tmpUser.State,
			UpdateTime: time.Now().Unix(),
		})
	}
	return nil
}
