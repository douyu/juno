package util

import "testing"

func TestCommonPrefix(t *testing.T) {
	type args struct {
		arr []string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "test1",
			args: args{
				arr: []string{
					"/a/b/c", "/a/c/d", "/a/b/a",
				},
			},
			want: "/a/",
		},
		{
			name: "test2",
			args: args{
				arr: []string{
					"/a/b/c", "/a/b/c", "/a/b/c",
				},
			},
			want: "/a/b/c",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := CommonPrefix(tt.args.arr); got != tt.want {
				t.Errorf("CommonPrefix() = %v, want %v", got, tt.want)
			}
		})
	}
}
