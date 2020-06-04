package parse_test

import (
	"fmt"
	"testing"

	"github.com/douyu/juno/pkg/service/parse"
)

var (
	source1 = `
cache:
  enable : false
  list : [redis,mongoDB]
mysql:
  user : root
  user1 : root2
  password : Tech2501
  host : 10.11.22.33
  port : 3306
  name : cwi`
	source2 = `
cache2:
  enable : false
  list : 
   - redis
   - mongoDB
mysql3:
  user : root
  user1 : root2
  password : Tech2501
  host : 10.11.22.33
  port : 3306
  name : cwi`
	source3 = `
cache3:
  enable : false
  list : 
   - redis
   - mongoDB
mysql4:
  user: 
    child : root
  user1 : root2
  password : Tech2501
  host : 10.11.22.33
  port : 3306
  name : cwi`
	jsonSource = `
{
"liaorj":124,
"hh":"1212",
"hh":"1212"
}
`
)

func TestYamlParse_ParseItem(t *testing.T) {
	var parseYaml parse.YamlParse
	tmp := []string{source1, source2}
	out, err := parseYaml.FusionWithTpl(source3, []string{jsonSource})
	if err != nil {
		fmt.Println("FusionWithTpl err", err)
	}
	fmt.Printf("==== out\n%v\n====\n", out)
	source, err := parseYaml.Fusion(tmp)
	if err != nil {
		fmt.Println("Fusion err", err)
	}
	fmt.Println("source", source)
	flag, err := parseYaml.IsLegal([]byte(source))
	if err != nil {
		fmt.Println("err ", err)
	}
	fmt.Println("flag ", flag)

	_, err = parseYaml.ParseItem([]byte(source))
	if err != nil {
		fmt.Println("err ", err)
	}
	//fmt.Println("----", source)
	/*	for _, v := range resp {
		fmt.Println("### ", v.Key, v.Val)
	}*/
	out, err = parseYaml.Format([]byte(source))
	if err != nil {
		fmt.Println("err ", err)
	}
	fmt.Printf("---- \n%v\n----\n", out)
}

func TestYamlParse_FusionWithTpl(t *testing.T) {
	var parseYaml parse.YamlParse
	resp, err := parseYaml.ParseItem([]byte(source3))
	if err != nil {
		fmt.Println("err ", err)
	}
	for _, v := range resp {
		fmt.Println("### ", v.Key, v.Val)
	}
}
