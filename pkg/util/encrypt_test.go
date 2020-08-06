package util

import (
	"reflect"
	"testing"
)

func TestPKCS7UnPadding(t *testing.T) {
	type args struct {
		origData []byte
	}
	tests := []struct {
		name string
		args args
		want []byte
	}{
		{
			name: "test panic",
			args: args{origData: []byte{}},
			want: []byte{},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := PKCS7UnPadding(tt.args.origData); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("PKCS7UnPadding() = %v, want %v", got, tt.want)
			}
		})
	}
}
