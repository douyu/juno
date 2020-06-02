package util

import (
	"crypto/md5"
	"encoding/json"
	"fmt"
	"io"
	"reflect"
	"strconv"
	"strings"
)

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

func PPP(key string, in interface{}) {
	d, _ := json.Marshal(in)
	fmt.Println(key, ": ", string(d))
}
