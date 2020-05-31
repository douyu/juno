package util

import (
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"io"
	"mime/multipart"
)

// 生成32位MD5
func MD532(text string) string {
	ctx := md5.New()
	ctx.Write([]byte(text))
	return hex.EncodeToString(ctx.Sum(nil))
}

// MD5file 生成32位MD5file
func MD5file(file multipart.File) string {
	var returnMD5String string
	ctx := md5.New()
	if _, err := io.Copy(ctx, file); err != nil {
		return returnMD5String
	}
	returnMD5String = hex.EncodeToString(ctx.Sum(nil))
	return hex.EncodeToString(ctx.Sum(nil))
}

// GenerateUniqueID
func GenerateUniqueID() string {
	b := make([]byte, 16)
	n, err := rand.Read(b)
	if n != len(b) || err != nil {
	}
	return hex.EncodeToString(b)
}
