package middleware

import (
	"testing"
	"time"
)

func Test_checkOpenAuthPayload(t *testing.T) {
	type args struct {
		appId     string
		nonceStr  string
		secret    string
		sign      string
		timestamp int64
	}
	var tests = []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Test Sign Success",
			args: args{
				appId:     "app-test",
				nonceStr:  "hellohellohelloh",
				secret:    "world",
				timestamp: time.Now().Unix(),
				sign:      openAuthSign("app-test", "hellohellohelloh", "world", time.Now().Unix()),
			},
			wantErr: false,
		}, {
			name: "Test Sign Failed",
			args: args{
				appId:     "app-test",
				nonceStr:  "hellohellohelloh",
				secret:    "world",
				timestamp: time.Now().Unix(),
				sign:      "fake sign",
			},
			wantErr: true,
		}, {
			name: "Test Expired Timestamp",
			args: args{
				appId:     "app-test",
				nonceStr:  "hellohellohelloh",
				secret:    "world",
				timestamp: time.Now().Unix() - 20,
				sign:      openAuthSign("app-test", "hellohellohelloh", "world", time.Now().Unix()-20),
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := checkOpenAuthPayload(tt.args.appId, tt.args.nonceStr, tt.args.secret, tt.args.sign, tt.args.timestamp); (err != nil) != tt.wantErr {
				t.Errorf("checkOpenAuthPayload() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
