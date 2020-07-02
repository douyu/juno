package parse

import (
	"bytes"
	"encoding/json"
	"errors"
	"strings"

	"github.com/BurntSushi/toml"
)

// TomlParse ..
type TomlParse struct {
}

// NewTomlParse ..
func NewTomlParse() Parse {
	return &TomlParse{}
}

// Convert ...
func (tp *TomlParse) Convert(text string) (res []byte, err error) {
	return
}

// Fusion only useful with configuration format
func (tp *TomlParse) Fusion(sources []string) (out string, err error) {
	//buffer := new(bytes.Buffer)
	//encode := toml.NewEncoder(buffer)
	//for _ ,val := range sources  {
	//	var decodeRes interface{}
	//	md, _ := toml.Decode(val, &decodeRes)
	//	util.PPP("md", md.Keys())
	//	err = encode.Encode(decodeRes)
	//
	//	if err != nil {
	//		return
	//	}
	//}

	var tmp []byte
	for _, v := range sources {
		tmp = append(tmp, []byte(v)...)
		tmp = append(tmp, []byte("\n")...)
	}
	return tp.Format(tmp)
	//return tp.Format(buffer.Bytes())
	//return buffer.String(), nil
}

// FusionWithTpl ...
func (tp *TomlParse) FusionWithTpl(source string, texts []string) (out string, err error) {
	buffer := new(bytes.Buffer)
	encode := toml.NewEncoder(buffer)
	var decodeRes interface{}
	_, err = toml.Decode(source, &decodeRes)
	if err != nil {
		return
	}
	err = encode.Encode(decodeRes)
	if err != nil {
		return
	}

	for _, text := range texts {
		var textBytes interface{}
		// json to byte
		err = json.Unmarshal([]byte(text), &textBytes)
		if err != nil {
			return
		}
		err = encode.Encode(textBytes)
		if err != nil {
			return
		}
	}
	//return tp.Format(buffer.Bytes())
	return buffer.String(), nil
}

// Format ..
func (tp *TomlParse) Format(source []byte) (out string, err error) {
	var decodeRes interface{}
	_, err = toml.Decode(string(source), &decodeRes)
	if err != nil {
		return
	}

	buffer := new(bytes.Buffer)
	encode := toml.NewEncoder(buffer)
	err = encode.Encode(decodeRes)
	if err != nil {
		return
	}
	res := string(buffer.Bytes())
	return res, nil
}

// FormatStrict ..
func (tp *TomlParse) FormatStrict(source []byte) (out string, err error) {

	var decodeRes interface{}
	_, err = toml.Decode(string(source), &decodeRes)
	if err != nil {
		return
	}

	buffer := new(bytes.Buffer)
	encode := toml.NewEncoder(buffer)
	err = encode.Encode(decodeRes)
	if err != nil {
		return
	}
	res := string(buffer.Bytes())
	if strings.HasPrefix(res, "[") {
		return res, nil
	}
	return "", errors.New("非application block，需要以 [xxx] 开头进行编辑，不能直接输入 key=value")
}

// IsLegal ...
func (tp *TomlParse) IsLegal(source []byte) (res bool, err error) {
	var decodeRes interface{}
	_, err = toml.Decode(string(source), &decodeRes)
	if err != nil {
		return false, err
	}
	return true, nil
}
