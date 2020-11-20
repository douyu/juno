package configresource

import (
	"testing"

	"github.com/douyu/juno/internal/pkg/invoker"
	"github.com/douyu/juno/pkg/cfg"
)

func TestIsUseConfigResource(t *testing.T) {
	//type args struct {
	//	content string
	//}
	//tests := []struct {
	//	name    string
	//	args    args
	//	wantRes []string
	//}{
	//	{
	//		name: "test-1",
	//		args: args{
	//			content: "etcd={{注册中心ETCD@2}}",
	//		},
	//		wantRes: []string{"{{注册中心ETCD@2}}"},
	//	},
	//}
	//for _, tt := range tests {
	//	t.Run(tt.name, func(t *testing.T) {
	//		if gotRes := GetAllConfigResource(tt.args.content); !reflect.DeepEqual(gotRes, tt.wantRes) {
	//			t.Errorf("IsUseConfigResource() = %v, want %v", gotRes, tt.wantRes)
	//		}
	//	})
	//}
}

func TestFillConfigResource(t *testing.T) {
	cfg.InitCfg()
	invoker.Init()
	Init(invoker.JunoMysql)

	type args struct {
		content string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "test-1",
			args: args{
				content: "etcd={{注册中心ETCD@2}}",
			},
			want: `etcd=["127.0.0.1:2730"]`,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := FillConfigResource(tt.args.content); got != tt.want {
				t.Errorf("FillConfigResource() = %v, want %v", got, tt.want)
			}
		})
	}
}
