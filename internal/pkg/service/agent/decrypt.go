package agent

import (
	"github.com/douyu/juno/pkg/cfg"
	"github.com/douyu/juno/pkg/util"
)

func Decrypt(cipherText string) (plainText string, err error) {
	return util.AESCBCDecrypt(cipherText, cfg.Cfg.Agent.Secret)
}
