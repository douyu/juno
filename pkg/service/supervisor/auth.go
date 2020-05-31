package supervisor

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"time"
)

type Mac struct {
	AccessKey    []byte
	AccessSecret []byte
}

func NewMac(accessKey, accessSecret string) *Mac {
	return &Mac{[]byte(accessKey), []byte(accessSecret)}
}

func (m *Mac) Sign() string {
	block, _ := aes.NewCipher(m.AccessSecret)

	encrypter := cipher.NewCBCEncrypter(block, m.AccessKey)

	// 加密信息为%Y%Y%m%d%H%M。刚好是16位
	message := time.Now().Format("2006200601021504")
	in := []byte(message)
	out := make([]byte, len(message))

	encrypter.CryptBlocks(out, in)

	return base64.StdEncoding.EncodeToString(out)
}

func (m *Mac) GenarateHeaderMap() map[string]string {
	headers := make(map[string]string, 0)
	headers["DY-Access-Token"] = m.Sign()
	headers["DY-Access-Key"] = string(m.AccessKey)

	return headers
}
