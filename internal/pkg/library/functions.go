package library

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var emailPattern = regexp.MustCompile("[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[a-zA-Z0-9](?:[\\w-]*[\\w])?")

// Now 当前时间戳
func Now() int {
	return int(time.Now().Unix())
}

// Timestamp2String 时间格式化
func Timestamp2String(timestamp int) string {
	tm := time.Unix(int64(timestamp), 0)

	return tm.Format("2006-01-02 15:04:05")
}

// String2Timestamp 时间格式化为时间戳
func String2Timestamp(str string) int64 {
	tm, _ := time.Parse("2006-01-02 15:04:05", str)

	return tm.Unix()
}

// VerCompare 版本对比 v1比v2大返回1，小于返回-1，等于返回0
func VerCompare(ver1, ver2 string) int {
	ver1 = strings.TrimLeft(ver1, "ver") // 清除v,e,r
	ver2 = strings.TrimLeft(ver2, "ver") // 清除v,e,r
	p1 := strings.Split(ver1, ".")
	p2 := strings.Split(ver2, ".")

	ver1 = ""
	for _, v := range p1 {
		iv, _ := strconv.Atoi(v)
		ver1 = fmt.Sprintf("%s%04d", ver1, iv)
	}

	ver2 = ""
	for _, v := range p2 {
		iv, _ := strconv.Atoi(v)
		ver2 = fmt.Sprintf("%s%04d", ver2, iv)
	}

	return strings.Compare(ver1, ver2)
}

// InArray 判断是否在数组中
func InArray(val string, arr []string) (exist bool, index int) {
	exist = false
	index = -1

	for i, v := range arr {
		if val == v {
			exist = true
			index = i
			return
		}
	}

	return
}

// InIntArray 判断是否在int数组中
func InIntArray(v int, sl []int) bool {
	for _, vv := range sl {
		if vv == v {
			return true
		}
	}
	return false
}

// InUint64Array 判断是否在int数组中
func InUint64Array(v uint64, sl []uint64) bool {
	for _, vv := range sl {
		if vv == v {
			return true
		}
	}
	return false
}

// IsDir 判断是否为目录
func IsDir(dir string) bool {
	f, e := os.Stat(dir)
	if e != nil {
		return false
	}
	return f.IsDir()
}

// IsFile 判断是否为文件
func IsFile(filePath string) bool {
	f, e := os.Stat(filePath)
	if e != nil {
		return false
	}
	return !f.IsDir()
}

// FileExists reports whether the named file or directory exists.
func FileExists(name string) bool {
	if _, err := os.Stat(name); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}

// IsEmail 判断是否为邮箱格式
func IsEmail(b []byte) bool {
	return emailPattern.Match(b)
}

// Nl2br 换行符换成<br />
func Nl2br(s string) string {
	s = strings.Replace(s, "\r\n", "\n", -1)
	s = strings.Replace(s, "\r", "\n", -1)
	s = strings.Replace(s, "\n", "<br />", -1)
	return s
}

// IsChineseChar 判断字符串是否包含中文字符
func IsChineseChar(str string) bool {
	var hzRegexp = regexp.MustCompile("^[\u4e00-\u9fa5]{3,8}$")
	return hzRegexp.MatchString(str)
}

// Substr returns the substr from start to length.
func Substr(s string, start, length int) string {
	bt := []rune(s)
	if start < 0 {
		start = 0
	}
	if start > len(bt) {
		start = start % len(bt)
	}
	var end int
	if (start + length) > (len(bt) - 1) {
		end = len(bt)
	} else {
		end = start + length
	}
	return string(bt[start:end])
}
