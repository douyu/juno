package parse

const (
	TypToml = "toml"
	TypYaml = "yaml"
)

var (
	tp  Parse
	tpy Parse
)

func Init() {
	tp = NewTomlParse()
	tpy = NewYanmlParse()
}
