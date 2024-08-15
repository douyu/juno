package codeplatform

import "testing"

func TestPull(t *testing.T) {
	instance := New(Option{
		StorageDir: "/tmp",
		Token:      "NM5ULtnVtZMy1KfJi29_",
	})

	type args struct {
		repoUrlStr string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name:    "test pull private repo by token",
			args:    args{repoUrlStr: "https://gitlab.com/itsxld/example"},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// gotProgress, err := instance.CloneOrPull(tt.args.repoUrlStr, "/tmp/example")
			// t.Logf("progress: %s", gotProgress)
			// if (err != nil) != tt.wantErr {
			// 	t.Errorf("CloneOrPull() error = %v, wantErr %v", err, tt.wantErr)
			// 	return
			// }
		})
	}
}
