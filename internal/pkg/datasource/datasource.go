package datasource

type DataSource interface {
	Read() error
}
