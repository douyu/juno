package app

import (
	"testing"

	"github.com/douyu/juno/internal/pkg/service/clientproxy"
	"github.com/douyu/juno/pkg/cfg"
)

func TestGovernPort(t *testing.T) {
	type args struct {
		port     string
		env      string
		zoneCode string
		appName  string
		nodeName string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "test",
			args: args{
				port:     "",
				env:      "live",
				zoneCode: "guanggu",
				appName:  "juno-admin",
				nodeName: "localhost",
			},
			want: "21",
		},
	}
	cfg.InitCfg()
	clientproxy.Init()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := GovernPort(tt.args.port, tt.args.env, tt.args.zoneCode, tt.args.appName, tt.args.nodeName); got != tt.want {
				t.Errorf("GovernPort() = %v, want %v", got, tt.want)
			}
		})
	}
}
