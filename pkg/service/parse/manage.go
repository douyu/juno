package parse

func GetParseManage(typ string) Parse {
	switch typ {
	case TypToml:
		return tp
	case TypYaml:
		return tpy
	}
	return tp
}
