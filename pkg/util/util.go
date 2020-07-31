package util

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/url"
	"os"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// Now 返回当前时间戳。
func Now() int64 {
	return time.Now().Unix()
}

// InArray 会判断var是否在arr中。
func InArray(val string, arr []string) (index int, exist bool) {
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

func StringInArray(needle string, haystack []string) bool {
	result := false
	for _, item := range haystack {
		if needle == item {
			result = true
			break
		}
	}
	return result
}

// 判断是否是一个go包字符串
func StringPkg(str string) (ok bool, depth int) {
	reg := `^[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&~+#])?$`

	ok, err := regexp.Match(reg, []byte(str))
	if err != nil {
		return false, 0
	}
	depth = strings.Count(str, "/")

	return ok, depth
}

// Timestamp2String 会格式化当前时间。
func Timestamp2String(timestamp int) string {
	tm := time.Unix(int64(timestamp), 0)

	return tm.Format("2006-01-02 15:04:05")
}

func Timestamp2String64(timestamp int64) string {
	tm := time.Unix(timestamp, 0)

	return tm.Format("2006-01-02 15:04:05")
}

// String2Timestamp 会将当前时间转换为时间戳。
func String2Timestamp(str string) int64 {
	tm, _ := time.Parse("2006-01-02 15:04:05", str)

	return tm.Unix()
}

// FormValueArray 从post form中获取数组参数
func FormValueArray(key string, postForm url.Values) []string {
	var exist bool
	var res []string

	if res, exist = postForm[key]; !exist {
		errMsg := "Value '" + key + "' not exist in postform"
		fmt.Println(errMsg)
	}

	return res
}

// 字符串转int64
func StringToInt64(s string) int64 {
	data, err := strconv.ParseInt(s, 10, 64)

	if err != nil {
		data = int64(0)
	}

	return data
}

// RemoveDuplicatesAndEmpty 去重
func RemoveDuplicatesAndEmpty(a []string) (ret []string) {
	a_len := len(a)
	for i := 0; i < a_len; i++ {
		if (i > 0 && a[i-1] == a[i]) || len(a[i]) == 0 {
			continue
		}
		ret = append(ret, a[i])
	}
	return
}

// md5
func Md5(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

// Md5File ...
func Md5File(path string) string {
	var md5Str string
	file, err := os.Open(path)
	defer file.Close()

	if err != nil {
		return md5Str
	}

	md5h := md5.New()
	if _, err := io.Copy(md5h, file); err != nil {
		return md5Str
	}

	hashInBytes := md5h.Sum(nil)[:16]
	md5Str = hex.EncodeToString(hashInBytes)
	return md5Str
}

// Md5Bytes ...
func Md5Bytes(data []byte) string {
	hasher := md5.New()
	hasher.Write(data)
	return hex.EncodeToString(hasher.Sum(nil))
}

// ParseAddr ...
func ParseAddr(tplType, addr string) (ip string, port, user, psw string) {
	// grpc:wsd-live-srv-hours-go:v1:live
	if tplType == "grpc" {
		if !strings.Contains(addr, ":") {
			return
		}
		addrArr := strings.Split(addr, ":")
		if len(addrArr) == 4 {
			ip = addrArr[1]
			port = addrArr[3]
		} else {
			ip = addr
		}
		return
	}
	if tplType == "redis" {
		if !strings.Contains(addr, ":") {
			return
		}
		// addr = "redis://10.1.61.15:6001"
		addrArr := strings.Split(addr, ":")
		if len(addrArr) == 3 {
			ip = strings.TrimPrefix(addrArr[1], "//")
			port = addrArr[2]
		}
		// redis://:test:123456@r-xxxxxxxx.redis.rds.aliyuncs.com:6379
		if len(addrArr) == 5 {
			user = addrArr[2]
			ip = addrArr[3]
			// 账号密码
			if strings.Contains(ip, "@") {
				ipArr := strings.Split(ip, "@")
				if len(ipArr) == 2 {
					ip = ipArr[1]
					psw = ipArr[0]
				}
			}
			port = addrArr[4]
		}
		return

	}

	if strings.Contains(addr, ":") {
		if strings.HasPrefix(addr, "http:") || strings.HasPrefix(addr, "https:") {
			ip = addr
			return
		}

		addrArr := strings.Split(addr, ":")
		if len(addrArr) == 2 {
			ip = addrArr[0]
			port = addrArr[1]
		}
		return
	}
	ip = addr
	return
}

// ParseRedisAddr ...
func ParseRedisAddr(addrOrigin string) (addr string) {
	if strings.Contains(addrOrigin, "//") {
		addrArr := strings.Split(addrOrigin, "//")
		addrTmp := addrArr[1]
		if !strings.Contains(addrTmp, "@") {
			addr = addrTmp
			return
		}
		addrArr = strings.Split(addrTmp, "@")
		addr = addrArr[1]
		return
	}
	return
}

// IntNumberSet ...
func IntNumberSet(ids []int) []int {
	setMap := make(map[int]int)
	for _, number := range ids {
		setMap[number] = 1
	}
	sets := make([]int, 0)
	for k := range setMap {
		sets = append(sets, k)
	}
	return sets
}

// GetTodayZeroPoint ..
func GetTodayZeroPoint() int64 {
	timeStr := time.Now().Format("2006-01-02")
	loc, _ := time.LoadLocation("Local")
	t, _ := time.ParseInLocation("2006-01-02", timeStr, loc)
	return t.Unix()
}

// GetTodayZeroPointTime ..
func GetTodayZeroPointTime() time.Time {
	timeStr := time.Now().Format("2006-01-02")
	loc, _ := time.LoadLocation("Local")
	t, _ := time.ParseInLocation("2006-01-02", timeStr, loc)
	return t
}

// GetYesterdayZeroPoint ..
func GetYesterdayZeroPoint() int64 {
	timeStr := time.Now().Format("2006-01-02")
	loc, _ := time.LoadLocation("Local")
	t, _ := time.ParseInLocation("2006-01-02", timeStr, loc)
	return t.Unix() - int64(60*60*24)
}

func checkIntNumber(num float64) (int64, bool) {
	fs := strconv.FormatFloat(num, 'f', -1, 64)
	intNum, err := strconv.ParseInt(fs, 10, 64)
	if err != nil {
		return 0, false
	}
	return intNum, true
}

func GetVal(val string, typeStr string) (result interface{}, typ reflect.Kind, err error) {
	switch typeStr {
	case "string":
		var value string
		if err = json.Unmarshal([]byte(val), &value); err != nil {
			return
		}
		result, typ = value, reflect.String
	case "int":
		var value int
		if err = json.Unmarshal([]byte(val), &value); err != nil {
			return
		}
		result, typ = value, reflect.Int
	case "int32":
		var value int32
		if err = json.Unmarshal([]byte(val), &value); err != nil {
			return
		}
		result, typ = value, reflect.Int32
	case "int64":
		var value int64
		if err = json.Unmarshal([]byte(val), &value); err != nil {
			return
		}
		result, typ = value, reflect.Int64
	case "float64":
		var value float64
		if err = json.Unmarshal([]byte(val), &value); err != nil {
			return
		}
		result, typ = value, reflect.Float64
	case "bool":
		var value bool
		if err = json.Unmarshal([]byte(val), &value); err != nil {
			return
		}
		result, typ = value, reflect.Bool
	case "slice":
		var value []interface{}
		if err = json.Unmarshal([]byte(val), &value); err != nil {
			return
		}
		for index, item := range value {
			if reflect.TypeOf(item).String() == "float64" {
				num, ok := checkIntNumber(item.(float64))
				if ok && !strings.Contains(val, ".") {
					value[index] = num
				}
			}
		}
		result, typ = value, reflect.Slice
	}
	return
}

func GetTyp(typeStr string) (typ reflect.Kind, err error) {
	switch typeStr {
	case "string":
		typ = reflect.String
	case "int":
		typ = reflect.Int
	case "int32":
		typ = reflect.Int32
	case "int64":
		typ = reflect.Int64
	case "float64":
		typ = reflect.Float64
	case "bool":
		typ = reflect.Bool
	case "slice":
		typ = reflect.Slice
	}
	return
}

func Md5Str(val string) string {
	// 计算md5值
	h := md5.New()
	if _, err := io.WriteString(h, val); err != nil {
		return ""
	}
	return fmt.Sprintf("%x", h.Sum(nil))
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

// 生成短hash
func ShortHash(longstr string, number int) string {
	baseVal := 0x3FFFFFFF
	indexVal := 0x0000003D
	charset := []byte("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

	if number < 1 || number > 4 {
		number = 1
	}
	key := "juno666"
	urlhash := Md5(key + longstr)
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
			//将得到的值与0x0000003d,3d为61，即charset的坐标最大值
			index = hexcc & int64(indexVal)
			short_url = append(short_url, charset[index])
			//循环完以后将hex右移5位
			hexcc = hexcc >> 5
		}
		result[i] = string(short_url)
	}

	return result[number]

}

// FileExists reports whether the named file or directory exists.
func IsExist(path string) bool {
	_, err := os.Stat(path)
	return err == nil || os.IsExist(err)
}

func CreatePath(filePath string) error {
	if !IsExist(filePath) {
		err := os.MkdirAll(filePath, os.ModePerm)
		return err
	}
	return nil
}
