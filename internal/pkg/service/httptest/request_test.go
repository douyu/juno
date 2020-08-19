package httptest

import (
	"context"
	"net/http"
	"testing"

	"github.com/douyu/juno/internal/pkg/packages/xtest"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/go-resty/resty/v2"
)

func initClient() {
	Init(Option{
		DB:     nil,
		client: resty.New(),
	})
}

func Test_HttpScriptTest(t *testing.T) {
	initClient()

	type args struct {
		script string
		param  view.ReqSendHttpRequest
	}
	tests := []struct {
		name    string
		args    args
		success bool
	}{
		{
			name: "HTTP script testing",
			args: args{
				script: `
test.preRequest = function() {
	test.setQueryParam("wd", "hello");
};

test.onResponse = function(res) {
	var body = res.body || "";
	if (body.search(/value\="hello"/) < 0) {
		return false
	}
	return true
}
`,
				param: view.ReqSendHttpRequest{
					URL:    "http://www.baidu.com/s",
					Method: http.MethodGet,
				},
			},
			success: true,
		},
		{
			name: "HTTP script testing",
			args: args{
				script: `
test.preRequest = function() {
	test.setQueryParam("wd", "hello");
};

test.onResponse = function(res) {
	return false;
}
`,
				param: view.ReqSendHttpRequest{
					URL:    "http://www.baidu.com/s",
					Method: http.MethodGet,
				},
			},
			success: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tester := xtest.New(xtest.WithInterpreter(xtest.InterpreterTypeJS))
			result, err := NewRequest(resty.New(), tt.args.script, tt.args.param, tester).Send(context.Background())
			if err != nil {
				t.Logf("err = %v", err)
				t.FailNow()
			}

			if result.Error != nil {
				t.Logf("err = %s", result.Error.Error())
			}
			if result.Success != tt.success {
				t.Logf("want success = %v, but success = %v", tt.success, result.Success)
				t.FailNow()
			}
		})
	}
}
