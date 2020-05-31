package util

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// DSN ...
type DSN struct {
	User   string            // Username
	Passwd string            // TplPassword (requires User)
	Net    string            // Network type
	Addr   string            // Network address (requires Net)
	DBName string            // Database name
	Params map[string]string // Connection parameters
}

var (
	errInvalidDSNUnescaped = errors.New("invalid DSN: did you forget to escape a param value?")
	errInvalidDSNAddr      = errors.New("invalid DSN: network address not terminated (missing closing brace)")
	errInvalidDSNNoSlash   = errors.New("invalid DSN: missing the slash separating the database name")
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
func ParseAddr(addr string) (ip string, port string) {
	if strings.Contains(addr, ":") {
		addrArr := strings.Split(addr, ":")
		if len(addrArr) == 2 {
			ip = addrArr[0]
			port = addrArr[1]
		}
		return
	}
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

// ParseDSN parses the DSN string to a Config
func ParseDSN(dsn string) (cfg *DSN, err error) {
	// New config with some default values
	cfg = new(DSN)

	// [user[:password]@][net[(addr)]]/dbname[?param1=value1&paramN=valueN]
	// Find the last '/' (since the password or the net addr might contain a '/')
	foundSlash := false
	for i := len(dsn) - 1; i >= 0; i-- {
		if dsn[i] == '/' {
			foundSlash = true
			var j, k int

			// left part is empty if i <= 0
			if i > 0 {
				// [username[:password]@][protocol[(address)]]
				// Find the last '@' in dsn[:i]
				for j = i; j >= 0; j-- {
					if dsn[j] == '@' {
						// username[:password]
						// Find the first ':' in dsn[:j]
						for k = 0; k < j; k++ {
							if dsn[k] == ':' {
								cfg.Passwd = dsn[k+1 : j]
								break
							}
						}
						cfg.User = dsn[:k]

						break
					}
				}

				// [protocol[(address)]]
				// Find the first '(' in dsn[j+1:i]
				for k = j + 1; k < i; k++ {
					if dsn[k] == '(' {
						// dsn[i-1] must be == ')' if an address is specified
						if dsn[i-1] != ')' {
							if strings.ContainsRune(dsn[k+1:i], ')') {
								return nil, errInvalidDSNUnescaped
							}
							return nil, errInvalidDSNAddr
						}
						cfg.Addr = dsn[k+1 : i-1]
						break
					}
				}
				cfg.Net = dsn[j+1 : k]
			}

			// dbname[?param1=value1&...&paramN=valueN]
			// Find the first '?' in dsn[i+1:]
			for j = i + 1; j < len(dsn); j++ {
				if dsn[j] == '?' {
					if err = parseDSNParams(cfg, dsn[j+1:]); err != nil {
						return
					}
					break
				}
			}
			cfg.DBName = dsn[i+1 : j]

			break
		}
	}
	if !foundSlash && len(dsn) > 0 {
		return nil, errInvalidDSNNoSlash
	}
	return
}

func parseDSNParams(cfg *DSN, params string) (err error) {
	for _, v := range strings.Split(params, "&") {
		param := strings.SplitN(v, "=", 2)
		if len(param) != 2 {
			continue
		}
		// lazy init
		if cfg.Params == nil {
			cfg.Params = make(map[string]string)
		}
		value := param[1]
		if cfg.Params[param[0]], err = url.QueryUnescape(value); err != nil {
			return
		}
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
	for k, _ := range setMap {
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
