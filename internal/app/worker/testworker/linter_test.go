package testworker

import (
	"testing"
)

func TestLinter_Lint(t *testing.T) {
	problems, err := NewLinter("C:/Users/linkduan/Documents/juno/...").Lint()
	for _, problem := range problems {
		t.Logf("%s: %s", problem.Position.String(), problem.Text)
	}

	if err != nil {
		t.Logf("err: %s", err.Error())
		t.Failed()
	}
}
