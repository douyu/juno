package util

import (
	"errors"
	"fmt"
	"strings"
)

func JoinError(errs ...interface{}) error {
	return errors.New(fmt.Sprintf(strings.Repeat("%+v,", len(errs)), errs...))
}
