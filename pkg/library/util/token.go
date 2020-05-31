package util

import (
	"crypto/md5"
	"fmt"
	"github.com/douyu/jupiter/pkg/conf"
	"strconv"
)

func TokenValid(token string) bool {
	origin := conf.GetString("app.token")
	return token == origin
}

// 将字符串加密成 md5
func String2md5(str string) string {
	data := []byte(str)
	has := md5.Sum(data)
	return fmt.Sprintf("%x", has) // 将[]byte转成16进制
}

// 字符串截取
func Substr(str string, start int, length int) string {
	rs := []rune(str)
	rl := len(rs)
	end := 0

	if start < 0 {
		start = rl - 1 + start
	}
	end = start + length

	if start > end {
		start, end = end, start
	}

	if start < 0 {
		start = 0
	}
	if start > rl {
		start = rl
	}
	if end < 0 {
		end = 0
	}
	if end > rl {
		end = rl
	}
	return string(rs[start:end])
}

// 生成字符串短hash
func ShortTag(longstr string, number int) string {
	baseVal := 0x3FFFFFFF
	indexVal := 0x0000003D
	charset := []byte("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

	if number < 1 || number > 4 {
		number = 1
	}
	key := "cheer"
	urlhash := String2md5(key + longstr)
	len := len(urlhash)

	var hexcc int64
	var short_url []byte
	var result [4]string

	for i := 0; i < 4; i++ {
		urlhash_piece := Substr(urlhash, i*len/4, len/4)
		hexDec, _ := strconv.ParseInt(urlhash_piece, 16, 64)
		hexcc = hexDec & int64(baseVal)

		var index int64
		short_url = []byte{}
		for j := 0; j < 6; j++ {
			// 将得到的值与0x0000003d,3d为61，即charset的坐标最大值
			index = hexcc & int64(indexVal)
			short_url = append(short_url, charset[index])
			// 循环完以后将hex右移5位
			hexcc = hexcc >> 5
		}
		result[i] = string(short_url)
	}

	return result[number]

}
