package parse

import (
	"bytes"
	"encoding/json"
	"fmt"
	yaml "gopkg.in/yaml.v2"
	"reflect"
	"strings"
)

type YamlParse struct {
}

type Item struct {
	Key       string
	Val       interface{}
	Typ       reflect.Kind
	Comment   string
	SourceTyp int
	Id        uint64
	DiffKey   string
}

func NewYanmlParse() Parse {
	return &YamlParse{}
}

// Convert ...
func (tp *YamlParse) Convert(text string) (res []byte, err error) {
	return
}

// Fusion only useful with configuration format 组合两个配置
func (tp *YamlParse) Fusion(sources []string) (out string, err error) {

	var tmp []byte
	for _, v := range sources {
		tmp = append(tmp, []byte(v)...)
		tmp = append(tmp, []byte("\n")...)
	}
	return tp.Format(tmp)
}

// Fusion ...
func (tp *YamlParse) FusionWithTpl(source string, texts []string) (out string, err error) {
	var decodeRes interface{}
	dec := yaml.NewDecoder(strings.NewReader(source))
	dec.SetStrict(true)
	if err := dec.Decode(&decodeRes); err != nil {
		fmt.Println("****** FusionWithTpl err 1", err)
		return out, err
	}

	resp, err := yaml.Marshal(decodeRes)
	if err != nil {
		return string(resp), err
	}
	//return string(sourceRes), nil
	for _, text := range texts {
		var textBytes interface{}
		// json to byte
		err = json.Unmarshal([]byte(text), &textBytes)
		if err != nil {
			return
		}
		textBytesRes, err := yaml.Marshal(textBytes)
		if err != nil {
			return string(resp), err
		}
		resp = append(resp, textBytesRes...)
	}
	return tp.Format(resp)
}

func (tp *YamlParse) Format(source []byte) (out string, err error) {
	// 	// 使用UnMarshal和Decode效果一样
	var decodeRes interface{}
	dec := yaml.NewDecoder(bytes.NewReader(source))
	dec.SetStrict(true)
	if err := dec.Decode(&decodeRes); err != nil {
		return out, err
	}

	// 使用Marshal和Encode效果一样
	/*	res, err := yaml.Marshal(decodeRes)
		if err != nil {
			return string(res), err
		}
		return string(res), nil*/

	buffer := new(bytes.Buffer)
	enc := yaml.NewEncoder(buffer)
	if err := enc.Encode(decodeRes); err != nil {
		return out, err
	}
	out = buffer.String()
	if err := enc.Close(); err != nil {
		return out, err
	}
	return out, nil
}

// IsLegal ... 是否合法
func (tp *YamlParse) IsLegal(source []byte) (res bool, err error) {
	var decodeRes interface{}
	dec := yaml.NewDecoder(bytes.NewReader(source))
	dec.SetStrict(true)
	if err := dec.Decode(&decodeRes); err != nil {
		return false, err
	}
	fmt.Println("res --- ", decodeRes)
	return true, nil
}

// 解析成kv
func (tp *YamlParse) ParseItem(source []byte) (res []*Item, err error) {
	res = make([]*Item, 0)
	resp := make(map[interface{}]interface{})
	err = yaml.UnmarshalStrict(source, &resp)
	// err = yaml.Unmarshal(yamlFile, &resultMap)
	if err != nil {
		fmt.Println("ParseItem -- ", err)
	}

	scanMap("", resp, &res)

	return res, nil
}

func scanMap(pre string, itemMap map[interface{}]interface{}, res *[]*Item) {
	for k, v := range itemMap {
		keyType := reflect.TypeOf(k)
		valType := reflect.TypeOf(v)
		if keyType.Kind() != reflect.String {
			continue
		}
		if valType.Kind() == reflect.Map {
			newPre := fmt.Sprintf("%v", k)
			if pre != "" {
				newPre = pre + "." + newPre
			}
			res := res
			scanMap(newPre, v.(map[interface{}]interface{}), res)
		} else {
			key := fmt.Sprintf("%v", k)
			if pre != "" {
				key = pre + "." + key
			}
			item := Item{
				Key: key,
				Val: v,
			}
			*res = append(*res, &item)
		}
	}
}
