package db

// GitlabEvent ...
type GitlabEvent struct {
	Gid        int // project id
	Uid        int
	UserName   string
	UserEmail  string
	UserAvatar string
	Refs       string
	Id         int
	Changes    string
	CreateTime int
}

// TableName ...
func (GitlabEvent) TableName() string {
	return "gitlab_event"
}

// CommitChange ...
type CommitChange struct {
	Before string
	After  string
	Ref    string
}

// GitlabEventList ...
type GitlabEventList struct {
	Gid      int    `json:"gid"` // project id
	UserName string `json:"userName" gorm:"user_name"`
	Changes  string
}
