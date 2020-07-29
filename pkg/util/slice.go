package util

import (
	"bytes"
	"encoding/gob"
	"reflect"
)

func Diff(a map[string]interface{}, b map[string]interface{}) map[string]interface{} {
	res := make(map[string]interface{}, 0)
	for name, id := range a {
		if _, ok := b[name]; !ok {
			res[name] = id
		}
	}
	return res
}

//DiffList 求 source 和 dest 的 交/差集
//此函数效率较低(O(n^2))，请在列表长度较小时使用
func DiffList(source, dest interface{}, cmp func(a, b interface{}) bool) (res []interface{}) {
	if reflect.TypeOf(source).Kind() != reflect.Array && reflect.TypeOf(source).Kind() != reflect.Slice {
		return
	}

	lenA := reflect.ValueOf(source).Len()
	lenB := reflect.ValueOf(dest).Len()
	valA := reflect.ValueOf(source)
	valB := reflect.ValueOf(dest)

	for i := 0; i < lenA; i++ {
		exist := false
		for j := 0; j < lenB; j++ {
			if cmp(valA.Index(i).Interface(), valB.Index(j).Interface()) {
				exist = true
				break
			}
		}
		if !exist {
			res = append(res, valA.Index(i).Interface())
		}
	}

	return
}

// 深度拷贝

func DeepCopy(dst, src interface{}) error {
	var buf bytes.Buffer
	if err := gob.NewEncoder(&buf).Encode(src); err != nil {
		return err
	}
	return gob.NewDecoder(bytes.NewBuffer(buf.Bytes())).Decode(dst)
}
