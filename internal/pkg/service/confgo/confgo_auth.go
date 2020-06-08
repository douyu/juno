package confgo

// IsEditor
func (c *confgo) IsEditor(uid, configID int32) (out bool) {
	// TODO 权限校验
	return true
}

// IsPublisher
func (c *confgo) IsPublisher(uid, configID int32) (out bool) {
	// TODO 权限校验
	return true
}
