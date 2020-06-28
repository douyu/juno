package errutil

import (
	"fmt"

	"golang.org/x/xerrors"
)

// Wrap is a simple wrapper around Errorf that is doing error wrapping. You can read how that works in
// https://godoc.org/golang.org/x/xerrors#Errorf but its API is very implicit which is a reason for this wrapper.
// There is also a discussion (https://github.com/golang/go/issues/29934) where many comments make arguments for such
// wrapper so hopefully it will be added in the standard lib later.
func Wrap(message string, err error) error {
	if err == nil {
		return nil
	}

	return xerrors.Errorf("%v: %w", message, err)
}

// Wrapf is a simple wrapper around Errorf that is doing error wrapping
// Wrapf allows you to send a format and args instead of just a message.
func Wrapf(err error, message string, a ...interface{}) error {
	if err == nil {
		return nil
	}

	return Wrap(fmt.Sprintf(message, a...), err)
}
