package middleware

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"math"
	"time"

	"github.com/douyu/juno/internal/pkg/packages/contrib/output"
	"github.com/douyu/juno/internal/pkg/service/openauth"
	"github.com/douyu/juno/pkg/util"
	"github.com/labstack/echo/v4"
)

type OpenAuthCommonPayload struct {
	AppID     string `json:"app_id" query:"app_id" validate:"required"`
	Timestamp int64  `json:"timestamp" query:"timestamp" validate:"required"`
	NonceStr  string `json:"nonce_str" query:"nonce_str" validate:"required"`
	Sign      string `json:"sign" query:"sign" validate:"required"`
}

func OpenAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		bodyContent, _ := ioutil.ReadAll(c.Request().Body)
		authParam := OpenAuthCommonPayload{}

		err := c.Bind(&authParam)
		if err != nil {
			return output.JSON(c, output.MsgOpenAuthFailed, err.Error(), nil)
		}

		err = c.Validate(&authParam)
		if err != nil {
			return output.JSON(c, output.MsgOpenAuthFailed, err.Error(), nil)
		}

		// 写回Body
		c.Request().Body = ioutil.NopCloser(bytes.NewReader(bodyContent))

		token, err := openauth.OpenAuthService.GetAccessTokenByAppID(authParam.AppID)
		if err != nil {
			return output.JSON(c, output.MsgOpenAuthFailed, err.Error(), nil)
		}

		err = checkOpenAuthPayload(authParam.AppID, authParam.NonceStr, token.Secret, authParam.Sign, authParam.Timestamp)
		if err != nil {
			return output.JSON(c, output.MsgOpenAuthFailed, err.Error(), nil)
		}

		return next(c)
	}
}

func checkOpenAuthPayload(appId, nonceStr, secret, sign string, timestamp int64) (err error) {
	if len(nonceStr) != 16 {
		return fmt.Errorf("nonceStr 长度无效")
	}

	if math.Abs(float64(time.Now().Unix()-timestamp)) > 10 {
		return fmt.Errorf("token expired")
	}

	realSign := openAuthSign(appId, nonceStr, secret, timestamp)
	if realSign != sign {
		return fmt.Errorf("签名无效")
	}

	return
}

//计算签名
func openAuthSign(appId, nonceStr, secret string, timestamp int64) (sign string) {
	plainText := fmt.Sprintf("%s%s%s%d", appId, nonceStr, secret, timestamp)

	return util.Md5Str(plainText)
}
