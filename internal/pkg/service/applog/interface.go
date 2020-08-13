package applog

type applog interface {
	DashboardUrl(project, dashboard string) (string, error)
	LogStoreUrl(project, store, query string) (string, error)
}
