package codec

import (
	"bytes"
	"encoding/json"

	"github.com/BurntSushi/toml"
	"gopkg.in/yaml.v2"
)

func Unmarshal(format string, data map[string]interface{}) (string, error) {
	var encode = UnmarshalTOML
	switch format {
	case "yaml", "yml":
		encode = UnmarshalYAML
	case "toml":
		encode = UnmarshalTOML
	case "json":
		encode = UnmarshalJSON
	}
	return encode(data)
}

func UnmarshalTOML(data map[string]interface{}) (string, error) {
	var buff bytes.Buffer
	err := toml.NewEncoder(&buff).Encode(data)
	if err != nil {
		return "", err
	}

	return buff.String(), nil
}

func UnmarshalYAML(data map[string]interface{}) (string, error) {
	var buff bytes.Buffer
	err := yaml.NewEncoder(&buff).Encode(data)
	if err != nil {
		return "", err
	}

	return buff.String(), nil
}

func UnmarshalJSON(data map[string]interface{}) (string, error) {
	var buff bytes.Buffer
	err := json.NewEncoder(&buff).Encode(data)
	if err != nil {
		return "", err
	}

	return buff.String(), nil
}
