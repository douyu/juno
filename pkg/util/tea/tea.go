package tea_test

import (
	"bytes"
	"testing"

	"golang.org/x/crypto/tea"
	"golang.org/x/crypto/xtea"
)

func TestTeaDemo(t *testing.T) {

	key := []byte("mojotv.cn.=.good") //长度必须为16byte
	c, err := tea.NewCipherWithRounds(key, 8)
	if err != nil {
		t.Fatal(err)
	}
	raw := []byte("mojotvcn") //长度必须为8byte
	dst := make([]byte, 8)    //长度必须为8byte
	c.Encrypt(dst, raw)
	raw2 := make([]byte, 8) //长度必须为8byte
	c.Decrypt(raw2, dst[:])

	if !bytes.Equal(raw, raw2) {
		t.Error("失败")
	}
	t.Log("验证成功")
}
func TestXteaDemo(t *testing.T) {

	key := []byte("mojotv.cn.=.good") //长度必须为16byte
	c, err := xtea.NewCipher(key)
	if err != nil {
		t.Fatal(err)
	}
	raw := []byte("mojotvcn") //长度必须为8byte
	dst := make([]byte, 8)    //长度必须为8byte
	c.Encrypt(dst, raw)
	raw2 := make([]byte, 8) //长度必须为8byte
	c.Decrypt(raw2, dst[:])

	if !bytes.Equal(raw, raw2) {
		t.Error("失败")
	}
	t.Log("xtea验证成功")
}
