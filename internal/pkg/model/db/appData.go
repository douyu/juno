package db

// AppData ...
type AppData struct {
	Id              int
	Aid             int
	Commit          string
	UpdateTime      int64
	UpdatedBy       int
	BuildPath       string
	WorkSpacePath   string
	BuildOutputPath string

	ProtoDocStatus int
	ProtoDocPath   string

	GrpcTesterStatus int
	GrpcTesterPath   string
}

// TableName ...
func (AppData) TableName() string {
	return `app_data`
}
