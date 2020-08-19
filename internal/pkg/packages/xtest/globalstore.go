package xtest

//GlobalStore 用于测试用例在执行过程中设置全局变量从而在测试用例之间共享数据
type GlobalStore struct {
	data map[string]interface{}
}

func NewGlobalStore() *GlobalStore {
	return &GlobalStore{
		data: map[string]interface{}{},
	}
}

func (g *GlobalStore) Set(key string, value interface{}) {
	g.data[key] = value
}

func (g *GlobalStore) Get(key string) (value interface{}) {
	value, _ = g.data[key]

	return
}
