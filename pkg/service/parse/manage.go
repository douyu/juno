package parse

func GetParseManage(typ string) Parse {
	switch typ {
	case TypToml:
		return tp
	}
	return tp
}
