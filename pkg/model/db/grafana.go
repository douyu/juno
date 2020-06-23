// 本文件的 Model 对应 Grafana 数据库的数据表，用于和grafana共享数据

package db

import "time"

// GrafanaUser ...
type GrafanaUser struct {
	Id         int64
	Login      string
	Email      string
	OrgId      int
	IsAdmin    int
	Created    time.Time
	Updated    time.Time
	HelpFlags1 int
	Version    int
}

// TableName ...
func (GrafanaUser) TableName() string {
	return "user"
}

// GrafanaTeam ...
type GrafanaTeam struct {
	ID      int
	Name    string
	OrgID   int
	Created time.Time
	Updated time.Time
	Email   string
}

// TableName ...
func (GrafanaTeam) TableName() string {
	return "team"
}

// GrafanaOrgUser ...
type GrafanaOrgUser struct {
	ID      int       `json:"id"`
	OrgID   int       `json:"org_id"`
	UserID  int       `json:"user_id"`
	Role    string    `json:"role"`
	Created time.Time `json:"created"`
	Updated time.Time `json:"updated"`
}

// TableName ...
func (GrafanaOrgUser) TableName() string {
	return "org_user"
}

// GrafanaTeamMember ...
type GrafanaTeamMember struct {
	ID       int
	OrgID    int
	TeamID   int
	UserID   int
	Created  time.Time
	Updated  time.Time
	External int
}

// TableName ...
func (GrafanaTeamMember) TableName() string {
	return "team_member"
}

type GrafanaAlertNotification struct {
	Id                    int       `json:"id"`
	OrgId                 int       `json:"org_id"`
	Name                  string    `json:"name"`
	Type                  string    `json:"type"`
	Settings              string    `json:"settings"`
	Created               time.Time `json:"created"`
	Updated               time.Time `json:"updated"`
	IsDefault             bool      `json:"is_default"`
	Frequency             int       `json:"frequency"`
	SendReminder          bool      `json:"send_reminder"`
	Uid                   string    `json:"uid"`
	DisableResolveMessage bool      `json:"disable_resolve_message"`
}

func (GrafanaAlertNotification) TableName() string {
	return "alert_notification"
}
