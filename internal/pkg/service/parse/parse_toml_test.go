package parse_test

import (
	"fmt"
	"testing"

	"github.com/douyu/juno/internal/pkg/code"
	"github.com/douyu/juno/internal/pkg/service/parse"
	"github.com/douyu/juno/internal/pkg/util"
	"github.com/google/go-cmp/cmp"
)

func TestTomlParse_FormatStrict(t *testing.T) {
	var parseToml parse.TomlParse

	t.Run("fail", func(t *testing.T) {
		res, got := parseToml.FormatStrict([]byte(`
		123123123 = 123123
		`))
		fmt.Println(res)

		diff := cmp.Diff(code.ErrTomlFormatStrict.Error(), got.Error())
		if diff != "" {
			t.Fatalf(diff)
		}
	})

	t.Run("success", func(t *testing.T) {
		res, got := parseToml.FormatStrict([]byte(`
			
		[people]
mode = "live"

		`))
		fmt.Println(res)
		bool := cmp.Equal(nil, got)
		if !bool {
			t.Fatalf("error")
		}
	})
}

func TestTomlParse_Fusion(t *testing.T) {
	var (
		source []byte
		texts1 []string
		texts2 []string
	)

	source = []byte(`
	    [owner]
	    name = "Tom Preston-Werner"
	    organization = "Github"
	    bio = "Github Cofounder & CEO\nLikes tater tots and beer."
	    dob = 1979-05-27T07:32:00Z # 日期时间是一等公民.为什么不呢？`)

	texts1 = make([]string, 0)
	texts1 = append(texts1, `
	[owner]
	name = "Tom Preston-Werner"
	organization = "Github"
	bio = "Github Cofounder & CEO\nLikes tater tots and beer."
	dob = 1979-05-27T07:32:00Z # 日期时间是一等公民.为什么不呢？`)

	texts2 = make([]string, 0)
	texts2 = append(texts2, `
	[owner]
	name = "Tom Preston-Werner"
	organization = "Github"
	bio = "Github Cofounder & CEO\nLikes tater tots and beer."
	dob = 1979-05-27T07:32:00Z # 日期时间是一等公民.为什么不呢？`)

	var parseToml parse.TomlParse
	type item struct {
		source []byte
		texts  []string
	}
	var tests = map[string]struct {
		input   item
		want    error
		isLegal bool
	}{
		"demo-1": {
			input: item{
				source: source,
				texts:  texts1,
			},
			want:    nil,
			isLegal: true,
		},
		"demo-2": {
			input: item{
				source: source,
				texts:  texts2,
			},
			want:    nil,
			isLegal: false,
		},
	}
	for name, tc := range tests {
		fmt.Println(name)
		t.Run(name, func(t *testing.T) {
			res, got := parseToml.Fusion(tc.input.texts)
			util.PPP("res", string(res))
			util.PPP("got", got)
			diff := cmp.Diff(tc.want, got)
			if diff != "" {
				t.Fatalf(diff)
			}

			b, e := parseToml.IsLegal(tc.input.source)
			util.PPP("bool", b)
			util.PPP("e", e)
		})
	}
}
