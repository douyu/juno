package parse


const(
	TypToml = "toml"
)

var (
	tp Parse
)

func Init(){
	tp = NewTomlParse()
}