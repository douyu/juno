package util

import "testing"

func TestIsFileExists(t *testing.T) {
	type args struct {
		path string
	}
	tests := []struct {
		name    string
		args    args
		want    bool
		wantErr bool
	}{
		{
			name: "test-1",
			args: args{
				path: "/test",
			},
			want:    false,
			wantErr: false,
		},
		{
			name: "test-2",
			args: args{
				path: "/home",
			},
			want:    true,
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := IsFileExists(tt.args.path)
			if (err != nil) != tt.wantErr {
				t.Errorf("IsFileExists() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("IsFileExists() = %v, want %v", got, tt.want)
			}
		})
	}
}
