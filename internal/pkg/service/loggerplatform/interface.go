package loggerplatform

type loggerP interface {
	LogStore(env, query, typ, appName string) (string, error)
}
