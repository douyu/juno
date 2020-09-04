package db

import (
	"database/sql/driver"
	"encoding/json"
)

type (
	MapStringArray  map[string][]string
	MapStringString map[string]string
	StringArray     []string
)

func (h *MapStringArray) Scan(val interface{}) error {
	return json.Unmarshal(val.([]byte), h)
}

func (h MapStringArray) Value() (val driver.Value, err error) {
	if h == nil {
		val = "{}"
		return
	}
	val, err = json.Marshal(&h)
	return
}

func (h *MapStringString) Scan(val interface{}) error {
	return json.Unmarshal(val.([]byte), h)
}

func (h MapStringString) Value() (val driver.Value, err error) {
	if h == nil {
		val = "{}"
		return
	}
	val, err = json.Marshal(&h)
	return
}
func (h *StringArray) Scan(val interface{}) error {
	return json.Unmarshal(val.([]byte), h)
}

func (h StringArray) Value() (val driver.Value, err error) {
	if h == nil {
		val = []byte("[]")
		return
	}
	val, err = json.Marshal(&h)
	return
}
