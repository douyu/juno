package db

// swagger:model user
type User struct {
	Uid           int    `gorm:"not null;primary_key;AUTO_INCREMENT"json:"uid"`
	Oaid          int    `gorm:"not null;comment:'oa uid'"json:"id"`
	Username      string `gorm:"not null;comment:'用户名'"json:"username"`
	Nickname      string `gorm:"not null;comment:'昵称'"json:"nickname"`
	Token         string `gorm:"not null;comment:'token信息'"json:"token"`
	Secret        string `gorm:"not null;comment:'秘钥'"json:"secret"`
	Email         string `gorm:"not null;comment:'email'"json:"email"`
	Avatar        string `gorm:"not null;comment:'avatart'"json:"avatar"`
	WebUrl        string `gorm:"not null;comment:'注释'"json:"webUrl"`
	State         string `gorm:"not null;comment:'注释'"json:"state"`
	Hash          string `gorm:"not null;comment:'注释'"json:"hash"`
	CreateTime    int64  `gorm:"not null;comment:'注释'"json:"createTime"`
	UpdateTime    int64  `gorm:"not null;comment:'注释'"json:"updateTime"`
	authenticated bool   `form:"-" db:"-" json:"-"`
	Password      string `gorm:"not null;comment:'注释'"json:"password"`
	// open source user data
	CurrentAuthority string `json:"currentAuthority"`
	Access           string `json:"access"`
}

func (u *User) TransformUserInfo() UserInfo {
	return UserInfo{
		Oaid:          u.Oaid,
		Uid:           u.Uid,
		Username:      u.Username,
		Nickname:      u.Nickname,
		Token:         u.Token,
		Secret:        u.Secret,
		Email:         u.Email,
		Avatar:        u.Avatar,
		WebUrl:        u.WebUrl,
		State:         u.State,
		Hash:          u.Hash,
		CreateTime:    u.CreateTime,
		UpdateTime:    u.UpdateTime,
		Authenticated: u.authenticated,
		Access:        u.Access,
	}

}

// UserInfo ...
type UserInfo struct {
	// the id for this user.
	//
	// required: true
	// oa uid
	Oaid int `json:"oaid"`
	// gitlab uid
	Uid int `json:"uid"`

	// Login is the username for this user.
	//
	// required: true
	Username string `json:"username"`
	Nickname string `json:"nickname"`

	// Token is the oauth2 token.
	Token string `json:"token"`

	// Secret is the oauth2 token secret.
	Secret string `json:"secret"`

	// Email is the email address for this user.
	// required: true
	Email string `json:"email"`

	// the avatar url for this user.
	Avatar string `json:"avatarUrl"`
	WebUrl string `json:"webUrl"`
	State  string `json:"state"`

	// Hash is a unique token used to sign tokens.
	Hash string `json:"hash"`

	// DEPRECATED Admin indicates the user is a system administrator.
	CreateTime int64 `json:"create_time"`
	UpdateTime int64 `json:"update_time"`
	// GitlabUid is the id of gitlab user

	Authenticated bool   `form:"-" db:"-" json:"-"`
	Access        string `json:"access"`
}

// TableName 指定Menu结构体对应的表名
func (User) TableName() string {
	return "user"
}
