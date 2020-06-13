package zip

import (
	"fmt"
	"testing"
)

// TestReaderFilList ...
func TestReaderFilList(t *testing.T) {
	names, err := ReaderFilList("./demo1.zip")
	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	fmt.Println(names)
}
