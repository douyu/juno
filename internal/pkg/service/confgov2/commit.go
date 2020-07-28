package confgov2

import (
	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/jupiter/pkg/xlog"
)

// commitMsg ..
func commitMsg(version string, configurationID uint) string {
	var cm db.ConfigurationHistory
	err := mysql.Select("change_log").Where("configuration_id =? and version = ?", configurationID, version).First(&cm).Error
	if err != nil {
		xlog.Error("commitMsg", xlog.String("version", version), xlog.String("err", err.Error()))
		return ""
	}
	return cm.ChangeLog
}
