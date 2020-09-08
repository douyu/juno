package xtest

import (
	"context"
	"testing"
	"time"

	"github.com/robertkrimen/otto"
)

func TestJSInterpreter_Success(t *testing.T) {
	jsi := NewJSInterpreter(nil)
	ctxTimeout, _ := context.WithTimeout(context.Background(), 1*time.Second)
	script := TestScript{
		Source: `
test.preRequest = function() {
	test.log("preRequest", "hello");
};

test.onResponse = function(data) {
	test.log("onResponse", data.status);
	return true;
};
`,
	}

	result := jsi.Execute(ctxTimeout, script, func() (data Response, err error) {
		data = map[string]interface{}{
			"status": 200,
		}
		return
	})

	t.Logf("result: %#v", result)

	if err := result.Error; err != nil {
		t.Logf("err: %s", err.Error())
	}

	if !result.Success {
		t.FailNow()
	}

	res, ok := result.Logs["onResponse"]
	if !ok || res != `200` {
		t.FailNow()
	}
}

func TestJSInterpreter_ExecuteTestFail(t *testing.T) {
	jsi := NewJSInterpreter(nil)
	ctxTimeout, _ := context.WithTimeout(context.Background(), 3*time.Second)
	script := TestScript{
		Source: `
test.onResponse = function(data) {
	if (data.status !== 200 || data.data.username !== "duanlv") return false;
	return true;
};
`,
	}
	result := jsi.Execute(ctxTimeout, script, func() (data Response, err error) {
		data = map[string]interface{}{
			"status": 200,
			"data": map[string]interface{}{
				"username": "duanlv2",
			},
		}

		return
	})
	if result.Error != nil {
		t.Log("error", result.Error.Error())
		t.FailNow()
	}

	t.Logf("result: %#v", result)

	if result.Success {
		t.FailNow()
	}

}

func TestJSInterpreter_ExecuteTimeout(t *testing.T) {
	jsi := NewJSInterpreter(nil)
	script := TestScript{
		Source: `while(true) {}`,
	}

	ctxTimeout, cancel := context.WithCancel(context.Background())
	go func() {
		time.Sleep(1 * time.Second)
		cancel()
	}()

	result := jsi.Execute(ctxTimeout, script, func() (data Response, err error) {
		return
	})

	t.Logf("result: %#v", result)

	if result.Error != ErrTimeout {
		t.FailNow()
	}
}

func TestJSInterpreter_ExecuteShareData(t *testing.T) {
	gs := NewGlobalStore()
	{
		jsi := NewJSInterpreter(gs)

		script := TestScript{
			Source: `
test.onResponse = function() {
	var a = test.getData("a");
	test.setData("a", a + " a2");
};

test.preRequest = function() {
	test.setData("a", "a1");
};`,
		}

		result := jsi.Execute(context.Background(), script, func() (data Response, err error) {
			return
		})

		if result.Error != nil {
			t.Logf("err = %s", result.Error.Error())
			t.FailNow()
		}
	}

	{
		jsi := NewJSInterpreter(gs)

		script := TestScript{
			Source: `
test.onResponse = function() {
	var a = test.getData("a");
	test.setData("a", a + " b2");
};

test.preRequest = function() {
	var a = test.getData("a");
	test.setData("a", a + " b1");
};`,
		}

		result := jsi.Execute(context.Background(), script, func() (data Response, err error) {
			return
		})

		if result.Error != nil {
			t.Logf("err = %s", result.Error.Error())
			t.FailNow()
		}
	}

	a, _ := gs.Get("a").(otto.Value)
	t.Logf(a.String())
	if a.String() != "a1 a2 b1 b2" {
		t.FailNow()
	}
}

func TestJSInterpreter_RegisterFunc(t *testing.T) {
	gs := NewGlobalStore()
	{
		jsi := NewJSInterpreter(gs)

		script := TestScript{
			Source: `
test.onResponse = function() {
	var a = test.getData("a");
	test.setData("a", a + " a2");
};

test.preRequest = function() {
	test.setBody('{"hello": "world"}')
	test.setContentType('application/json')
};`,
		}

		req := map[string]string{
			"body": "hello,world",
		}

		_ = jsi.RegisterFunc("setBody", func(content string) {
			req["body"] = content
		})

		_ = jsi.RegisterFunc("setContentType", func(contentType string) {
			req["content-type"] = contentType
		})

		result := jsi.Execute(context.Background(), script, func() (data Response, err error) {
			return
		})

		if result.Error != nil {
			t.Logf("err = %s", result.Error.Error())
			t.FailNow()
		}

		if req["body"] != "{\"hello\": \"world\"}" {
			t.Logf("req[body] = %s", req["body"])
			t.FailNow()
		}

		if req["content-type"] != "application/json" {
			t.Logf("req[content-type] = %s", req["content-type"])
			t.FailNow()
		}
	}

}

func TestJSInterpreter_RegisterFuncWithMap(t *testing.T) {
	gs := NewGlobalStore()
	{
		jsi := NewJSInterpreter(gs)

		script := TestScript{
			Source: `
test.onResponse = function() {
	var a = test.getData("a");
	test.setData("a", a + " a2");
};

test.preRequest = function() {
	var payload = {
		name: "duanlv",
		body: "hello",
		user: {
			"name": "duanlv"
		}
	}
	test.setMap(payload)
};`,
		}

		req := map[string]interface{}{}

		_ = jsi.RegisterFunc("setMap", func(content map[string]interface{}) {
			req = content
		})

		result := jsi.Execute(context.Background(), script, func() (data Response, err error) {
			return
		})

		if result.Error != nil {
			t.Logf("err = %s", result.Error.Error())
			t.FailNow()
		}

		t.Logf("req[body] = %s", req["body"])
		if req["body"] != "hello" {
			t.FailNow()
		}

		t.Logf("req[user] = %s", req["user"])
	}
}
