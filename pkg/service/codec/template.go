package codec

import (
	"fmt"
	"strings"
)

func TomlVarDecode(varStr string, varMap map[string]string) string {
	if strings.HasPrefix(varStr, "\"{{") && strings.HasSuffix(varStr, "}}\"") {
		varName := varStr[3 : len(varStr)-3]
		fmt.Println(varName)
		if varValue, ok := varMap[varName]; ok {
			return varValue
		}
	}
	return varStr
}

func VarDecode(varStr string) string {
	if strings.HasPrefix(varStr, "\"{{") && strings.HasSuffix(varStr, "}}\"") {
		varName := varStr[3 : len(varStr)-3]
		return varName
	}
	return varStr
}

func TomlVarEncode(varStr string) string {
	return fmt.Sprintf("{{%s}}", varStr)
}

func IsTemplateStr(str string) bool {
	if strings.HasPrefix(str, "\"{{") && strings.HasSuffix(str, "}}\"") {
		return true
	}
	return false
}
