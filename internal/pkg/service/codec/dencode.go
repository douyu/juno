package codec

import (
	"io"
	"reflect"
	"sort"
	"strings"

	"github.com/douyu/juno/internal/pkg/service/codec/go-toml"
)

// Item config item
type Item struct {
	Key       string
	Val       interface{}
	Typ       reflect.Kind
	Comment   string
	SourceTyp int
	Id        uint64
	DiffKey   string
}

// Encode encode items to toml string
func Encode(w io.Writer, items []*Item, isDecodeBefore bool) error {

	var mm = make(map[string]interface{})
	tree, _ := toml.TreeFromMap(mm)

	// 常规配置项
	for _, item := range items {
		if !isDecodeBefore {
			noDecodeBefore(tree, item, items)
		} else {
			// 默认
			tree.SetWithOptions(item.Key, toml.SetOptions{
				Comment:   item.Comment,
				Commented: false,
				Multiline: false,
			}, item.Val)
		}
	}
	_, err := tree.WriteTo(w)

	return err
}

func noDecodeBefore(tree *toml.Tree, item *Item, items []*Item) {
	// 自定义 arrayTable 处理模式
	if item.SourceTyp != 13 {
		tree.SetWithOptions(item.Key, toml.SetOptions{
			Comment:   item.Comment,
			Commented: false,
			Multiline: false,
		}, item.Val)
		return
	}

	switch item.Val.(type) {
	case []interface{}:
		val, isSet := getArrayTableContent(item.Id, item.Key, items, len(item.Val.([]interface{})))
		if !isSet {
			return
		}
		tree.SetWithOptions(item.Key, toml.SetOptions{
			Comment:   item.Comment,
			Commented: false,
			Multiline: false,
		}, val)
	}
}

func getArrayTableContent(itemId uint64, itemKey string, items []*Item, lens int) ([]*toml.Tree, bool) {
	res := make([]*toml.Tree, 0)
	flag := false
	id := itemId
	key := itemKey

	row := make(map[string]interface{}, 0)

	for k, itemVal := range items {

		if id != itemVal.Id && key == itemVal.Key && flag == false {
			return nil, false
		}

		if (id != itemVal.Id && key == itemVal.Key) || k == len(items)-1 {
			inTree, _ := toml.TreeFromMap(row)
			res = append(res, inTree)

			flag = false
			id = itemVal.Id
			key = itemVal.Key
			row = make(map[string]interface{}, 0)

		}
		if flag && strings.Contains(itemVal.Key, key) {
			keyArr := strings.Split(itemVal.Key, ".")
			row[keyArr[len(keyArr)-1]] = itemVal.Val
		}
		if id == itemVal.Id {
			flag = true
		}

	}

	return res, true
}

// Decode decode toml string to items
func Decode(content string) ([]*Item, error) {
	items := make([]*Item, 0)
	tree, err := toml.Load(content)
	if err != nil {
		return items, err
	}

	keys := deepSearch(tree, "")
	sort.Strings(keys)
	for _, key := range keys {
		val := tree.Get(key)
		items = append(items, &Item{
			Key: key,
			Val: val,
			Typ: reflect.TypeOf(val).Kind(),
		})
	}
	return items, nil
}

// 这个函数问题很严重哇
func deepSearch(tree *toml.Tree, prefix string) []string {
	var key = func(k string) string {
		if prefix == "" {
			return k
		}
		return prefix + "." + k
	}
	var rets = make([]string, 0)
	for _, sub := range tree.Keys() {
		switch node := tree.Get(sub).(type) {
		case *toml.Tree:
			tr := deepSearch(node, key(sub))
			rets = append(rets, tr...)
		case []*toml.Tree:
			for _, n := range node {
				rets = append(rets, key(sub)) // 我为啥要加这个
				rets = append(rets, deepSearch(n, key(sub))...)
			}
		default:
			rets = append(rets, key(sub))
		}
	}
	return rets
}

func GetKeys(content string) (keys []string, tree *toml.Tree, err error) {
	keys = make([]string, 0)
	tree, err = toml.Load(content)
	if err != nil {
		return
	}
	keys = deepSearch(tree, "")
	return
}
