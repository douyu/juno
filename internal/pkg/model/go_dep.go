package model

type GoDepProject struct {
	Name     string   `toml:"name"`
	Branch   string   `toml:"branch"`
	Revision string   `toml:"revision"`
	Version  string   `toml:"version"`
	Packages []string `toml:"packages"`
}

type PkgDep struct {
	Projects []GoDepProject `toml:"projects"`
}

type GomodProject struct {
	Name        string
	Version     string
	ModType     string
	Time        string
	Revision    string
	OriginValue string
	UpdateTime  int64
}
