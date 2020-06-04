package stringx

import (
	"reflect"
	"strings"
	"unsafe"

	"github.com/douyu/juno/pkg/packages/util/runex"
)

func FromBytes(bs []byte) string {
	bytesHeader := (*reflect.SliceHeader)(unsafe.Pointer(&bs))
	strHeader := reflect.StringHeader{Data: bytesHeader.Data, Len: bytesHeader.Len}
	return *(*string)(unsafe.Pointer(&strHeader))
}

// IsEmpty returns true if the string is empty
func IsEmpty(text string) bool {
	return len(text) == 0
}

// IsNotEmpty returns true if the string is not empty
func IsNotEmpty(text string) bool {
	return !IsEmpty(text)
}

// IsBlank returns true if the string is blank (all whitespace)
func IsBlank(text string) bool {
	return len(strings.TrimSpace(text)) == 0
}

// IsNotBlank returns true if the string is not blank
func IsNotBlank(text string) bool {
	return !IsBlank(text)
}

// Length counts the input while respecting UTF8 encoding and combined characters
func Length(text string) int {
	textRunes := []rune(text)
	textRunesLength := len(textRunes)

	sum, i, j := 0, 0, 0
	for i < textRunesLength && j < textRunesLength {
		j = i + 1
		for j < textRunesLength && runex.IsMark(textRunes[j]) {
			j++
		}
		sum++
		i = j
	}
	return sum
}

// Reverse reverses the input while respecting UTF8 encoding and combined characters
func Reverse(text string) string {
	textRunes := []rune(text)
	textRunesLength := len(textRunes)
	if textRunesLength <= 1 {
		return text
	}

	i, j := 0, 0
	for i < textRunesLength && j < textRunesLength {
		j = i + 1
		for j < textRunesLength && runex.IsMark(textRunes[j]) {
			j++
		}

		if runex.IsMark(textRunes[j-1]) {
			// Reverses Combined Characters
			reverse(textRunes[i:j], j-i)
		}

		i = j
	}

	// Reverses the entire array
	reverse(textRunes, textRunesLength)
	return string(textRunes)
}

func reverse(runes []rune, length int) {
	for i, j := 0, length-1; i < length/2; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
}
