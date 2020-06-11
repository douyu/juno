package parse

const (
	// TypToml ..
	TypToml = "toml"
	// TypYaml ..
	TypYaml = "yaml"
)

var (
	tp  Parse
	tpy Parse
)

// Init ..
func Init() {
	tp = NewTomlParse()
	tpy = NewYanmlParse()
}
