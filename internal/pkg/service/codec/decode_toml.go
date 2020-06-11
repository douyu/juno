package codec

import (
	"reflect"
	"strings"

	toml "github.com/achun/tom-toml"
	toml2 "github.com/douyu/juno/internal/pkg/service/codec/go-toml"
)

// DecodeToml 将字符串转化成为标准item list
func DecodeToml(str string, isEncodeAfter bool) (list []*Item, err error) {
	list = make([]*Item, 0)
	keys, valTree, _ := GetKeys(str)

	// 这里Toml 是一个 maps, 不是 tree 实现
	tree, paserErr := toml.Parse([]byte(str))

	if paserErr != nil { // 注释解析失败时降级到解析k-v
		tree = toml.New()
	}

	for _, key := range keys {
		v := valTree.Get(key)

		item := &Item{
			Key: key,
			Val: v,
		}
		if v != nil {
			item.Typ = reflect.TypeOf(v).Kind()
		}
		// 添加注释
		val, ok := tree[key]
		if ok {
			// 去除前缀#
			c := strings.TrimPrefix(val.Comment(), "#")
			item.Comment = c
			item.SourceTyp = int(val.Kind())
		}
		list = append(list, item)
	}
	if !isEncodeAfter {
		decodeTomlSetATV(list, valTree)
	}
	return
}

func decodeTomlSetATV(items []*Item, valTree *toml2.Tree) {
	atMap := make(map[string]int)
	for itemKey, itemVal := range items {
		key := itemVal.Key
		if itemVal.SourceTyp == int(toml.ArrayOfTables) {
			atMap[key]++
		}
		for atKey, atVal := range atMap {
			if strings.Contains(key, atKey) {
				keyArr := strings.Split(itemVal.Key, ".")
				items[itemKey].Val = valTree.Get(atKey).([]*toml2.Tree)[atVal-1].Get(keyArr[len(keyArr)-1])
			}
		}
	}
}
