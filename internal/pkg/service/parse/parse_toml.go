package parse

import (
	"bytes"
	"encoding/json"

	"github.com/BurntSushi/toml"
)

type TomlParse struct {
}

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

// Fusion ...
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

// IsLegal ...
func (tp *TomlParse) IsLegal(source []byte) (res bool, err error) {
	var decodeRes interface{}
	_, err = toml.Decode(string(source), &decodeRes)
	if err != nil {
		return false, err
	}
	return true, nil
}
