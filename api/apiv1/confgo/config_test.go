package confgo

import (
	"testing"

	"github.com/labstack/echo/v4"
)

func TestConfigStatics(t *testing.T) {
	type args struct {
		c echo.Context
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := ConfigStatics(tt.args.c); (err != nil) != tt.wantErr {
				t.Errorf("ConfigStatics() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestTplCreate(t *testing.T) {
	type args struct {
		c echo.Context
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := TplCreate(tt.args.c); (err != nil) != tt.wantErr {
				t.Errorf("TplCreate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestTplDelete(t *testing.T) {
	type args struct {
		c echo.Context
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := TplDelete(tt.args.c); (err != nil) != tt.wantErr {
				t.Errorf("TplDelete() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestTplInfo(t *testing.T) {
	type args struct {
		c echo.Context
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := TplInfo(tt.args.c); (err != nil) != tt.wantErr {
				t.Errorf("TplInfo() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestTplList(t *testing.T) {
	type args struct {
		c echo.Context
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := TplList(tt.args.c); (err != nil) != tt.wantErr {
				t.Errorf("TplList() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestTplUpdate(t *testing.T) {
	type args struct {
		c echo.Context
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := TplUpdate(tt.args.c); (err != nil) != tt.wantErr {
				t.Errorf("TplUpdate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
