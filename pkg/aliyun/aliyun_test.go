package aliyun

import (
	"testing"
)

func TestAliyun_Auth(t1 *testing.T) {
	//type fields struct {
	//	client          *resty.Client
	//	key             string
	//	secret          string
	//	roleArn         string
	//	roleSessionName string
	//	loginURL        string
	//	regionID        string
	//}
	//tests := []struct {
	//	name         string
	//	fields       fields
	//	wantResponse *sts.AssumeRoleResponse
	//	wantErr      bool
	//}{
	//	// TODO: Add test cases.
	//	{
	//		name: "test",
	//		fields: struct {
	//			client          *resty.Client
	//			key             string
	//			secret          string
	//			roleArn         string
	//			roleSessionName string
	//			loginURL        string
	//			regionID        string
	//		}{client: resty.New().SetDebug(true).SetTimeout(3*time.Second).SetHeader("Content-Type", "application/json;charset=utf-8"),
	//			key:             "",
	//			secret:          "",
	//			roleArn:         "acs:ram:::role/",
	//			roleSessionName: "-go",
	//			loginURL:        "http://..com",
	//			regionID:        "cn-beijing"},
	//	},
	//}
	//for _, tt := range tests {
	//	t1.Run(tt.name, func(t1 *testing.T) {
	//		t := &Aliyun{
	//			client:          tt.fields.client,
	//			key:             tt.fields.key,
	//			secret:          tt.fields.secret,
	//			roleArn:         tt.fields.roleArn,
	//			roleSessionName: tt.fields.roleSessionName,
	//			loginURL:        tt.fields.loginURL,
	//			regionID:        tt.fields.regionID,
	//		}
	//		gotResponse, err := t.Auth()
	//		if (err != nil) != tt.wantErr {
	//			t1.Errorf("Auth() error = %v, wantErr %v", err, tt.wantErr)
	//			return
	//		}
	//		if !reflect.DeepEqual(gotResponse, tt.wantResponse) {
	//			t1.Errorf("Auth() gotResponse = %v, want %v", gotResponse, tt.wantResponse)
	//		}
	//	})
	//}
}

func TestAliyun_Token(t1 *testing.T) {
	//type fields struct {
	//	client          *resty.Client
	//	key             string
	//	secret          string
	//	roleArn         string
	//	roleSessionName string
	//	loginURL        string
	//	regionID        string
	//}
	//type args struct {
	//	accessKeyId     string
	//	accessKeySecret string
	//	safeToken       string
	//}
	//tests := []struct {
	//	name            string
	//	fields          fields
	//	args            args
	//	wantSignInToken string
	//	wantErr         bool
	//}{
	//	{
	//		name: "test",
	//		fields: struct {
	//			client          *resty.Client
	//			key             string
	//			secret          string
	//			roleArn         string
	//			roleSessionName string
	//			loginURL        string
	//			regionID        string
	//		}{client: resty.New().SetDebug(true).SetTimeout(3*time.Second).SetHeader("Content-Type", "application/json;charset=utf-8"),
	//			key:             "",
	//			secret:          "",
	//			roleArn:         "acs:ram:::role/",
	//			roleSessionName: "-go",
	//			loginURL:        "http://..com",
	//			regionID:        "cn-beijing"},
	//	},
	//}
	//for _, tt := range tests {
	//	t1.Run(tt.name, func(t1 *testing.T) {
	//		t := &Aliyun{
	//			client:          tt.fields.client,
	//			key:             tt.fields.key,
	//			secret:          tt.fields.secret,
	//			roleArn:         tt.fields.roleArn,
	//			roleSessionName: tt.fields.roleSessionName,
	//			loginURL:        tt.fields.loginURL,
	//			regionID:        tt.fields.regionID,
	//		}
	//		gotSignInToken, err := t.Token(tt.args.accessKeyId, tt.args.accessKeySecret, tt.args.safeToken)
	//		if (err != nil) != tt.wantErr {
	//			t1.Errorf("Token() error = %v, wantErr %v", err, tt.wantErr)
	//			return
	//		}
	//		if gotSignInToken != tt.wantSignInToken {
	//			t1.Errorf("Token() gotSignInToken = %v, want %v", gotSignInToken, tt.wantSignInToken)
	//		}
	//	})
	//}
}

func TestAliyun_Url(t1 *testing.T) {
	//type fields struct {
	//	client          *resty.Client
	//	key             string
	//	secret          string
	//	roleArn         string
	//	roleSessionName string
	//	loginURL        string
	//	regionID        string
	//}
	//type args struct {
	//	destination string
	//}
	//tests := []struct {
	//	name    string
	//	fields  fields
	//	args    args
	//	wantUrl string
	//	wantErr bool
	//}{
	//	{
	//		name: "test",
	//		fields: struct {
	//			client          *resty.Client
	//			key             string
	//			secret          string
	//			roleArn         string
	//			roleSessionName string
	//			loginURL        string
	//			regionID        string
	//		}{client: resty.New().SetDebug(true).SetTimeout(3*time.Second).SetHeader("Content-Type", "application/json;charset=utf-8"),
	//			key:             "",
	//			secret:          "",
	//			roleArn:         "acs:ram:::role/",
	//			roleSessionName: "-go",
	//			loginURL:        "http://..com",
	//			regionID:        "cn-beijing"},
	//	},
	//}
	//for _, tt := range tests {
	//	t1.Run(tt.name, func(t1 *testing.T) {
	//		t := &Aliyun{
	//			client:          tt.fields.client,
	//			key:             tt.fields.key,
	//			secret:          tt.fields.secret,
	//			roleArn:         tt.fields.roleArn,
	//			roleSessionName: tt.fields.roleSessionName,
	//			loginURL:        tt.fields.loginURL,
	//			regionID:        tt.fields.regionID,
	//		}
	//		gotUrl, err := t.Url("http://baidu.com")
	//		if (err != nil) != tt.wantErr {
	//			t1.Errorf("Url() error = %v, wantErr %v", err, tt.wantErr)
	//			return
	//		}
	//		if gotUrl != tt.wantUrl {
	//			t1.Errorf("Url() gotUrl = %v, want %v", gotUrl, tt.wantUrl)
	//		}
	//	})
	//}
}
