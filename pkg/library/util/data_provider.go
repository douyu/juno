package util

import (
	"fmt"
	"sync"

	"github.com/BurntSushi/toml"
)

type DataProvider struct {
	sync.RWMutex
	content []byte
	conf    map[string]interface{}
}

func NewDataProvider(content []byte) *DataProvider {
	return &DataProvider{
		content: content,
		conf:    make(map[string]interface{}),
	}
}

func (d *DataProvider) Read() (data map[string]interface{}, err error) {
	d.RLock()
	defer d.RUnlock()
	d.conf = make(map[string]interface{})
	err = toml.Unmarshal(d.content, &d.conf)
	data = d.conf
	return
}

func (d *DataProvider) Write(conf map[string]interface{}) (err error) {
	d.Lock()
	defer d.Unlock()
	d.conf = conf
	return
}

func (d *DataProvider) Watch(dataCall func(map[string]interface{})) {
	fmt.Println("watch")
}
