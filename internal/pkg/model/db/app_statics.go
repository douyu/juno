package db

import "time"

type AppStatics struct {
	Aid             int    `gorm:"not null;"json:"aid"`
	AppName         string `gorm:"not null;"json:"appName"`
	GitPush         int    `gorm:"not null;"json:"gitPush"`
	GitTagPush      int    `gorm:"not null;"json:"gitTagPush"`
	GitIssue        int    `gorm:"not null;"json:"gitIssue"`
	GitMergeRequest int    `gorm:"not null;"json:"gitMergeRequest"`
	GitWikiPage     int    `gorm:"not null;"json:"gitWikiPage"`
	GitPipeline     int    `gorm:"not null;"json:"gitPipeline"`
	GitJob          int    `gorm:"not null;"json:"gitJob"`

	CmcCreate int `gorm:"not null;"json:"cmcCreate"`
	CmcUpdate int `gorm:"not null;"json:"cmcUpdate"`
	CmcDelete int `gorm:"not null;"json:"cmcDelete"`

	AppCreate int `gorm:"not null;"json:"appCreate"`
	AppUpdate int `gorm:"not null;"json:"appUpdate"`
	AppDelete int `gorm:"not null;"json:"appDelete"`

	NodeCreate int `gorm:"not null;"json:"nodeCreate"`
	NodeUpdate int `gorm:"not null;"json:"nodeUpdate"`
	NodeDelete int `gorm:"not null;"json:"nodeDelete"`

	PprofCreate int `gorm:"not null;"json:"pprofCreate"`

	DevopsUpdate     int `gorm:"not null;"json:"devopsUpdate"`
	DevopsRegister   int `gorm:"not null;"json:"devopsRegister"`
	DevopsUnregister int `gorm:"not null;"json:"devopsUnregister"`
	DevopsStart      int `gorm:"not null;"json:"devopsStart"`
	DevopsRestart    int `gorm:"not null;"json:"devopsRestart"`
	DevopsStop       int `gorm:"not null;"json:"devopsStop"`
	DevopsDeploy     int `gorm:"not null;"json:"devopsDeploy"`
	DevopsRollback   int `gorm:"not null;"json:"devopsRollback"`

	UpdatedAt time.Time `gorm:""json:"updatedAt"`
	CreatedAt time.Time `gorm:""json:"createdAt"`
}

func (AppStatics) TableName() string {
	return "app_statics"
}
