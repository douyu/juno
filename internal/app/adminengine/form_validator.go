package adminengine

import "github.com/go-playground/validator/v10"

type (
	FormValidator struct {
		validator *validator.Validate
	}
)

func NewValidator() *FormValidator {
	return &FormValidator{
		validator: validator.New(),
	}
}

func (f *FormValidator) Validate(i interface{}) error {
	return f.validator.Struct(i)
}
