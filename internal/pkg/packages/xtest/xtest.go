package xtest

import "context"

const (
	InterpreterTypeJS InterpreterType = "javascript"
)

type (
	XTest struct {
		interpreterType InterpreterType
		interpreter     Interpreter
		useGlobalStore  bool
		gs              *GlobalStore
	}

	InterpreterType string

	Option func(t *XTest)
)

func New(options ...Option) *XTest {
	t := &XTest{
		useGlobalStore: false,
		gs:             NewGlobalStore(),
	}

	for _, opt := range options {
		opt(t)
	}

	return t
}

func (t *XTest) Run(c context.Context, script TestScript, handler APICallFunc) (result TestResult) {
	return t.interpreter.Execute(c, script, handler)
}

func (t *XTest) getInterpreter(interpreterType InterpreterType) Interpreter {
	var gs *GlobalStore = nil
	if t.useGlobalStore {
		gs = t.gs
	}

	switch interpreterType {
	case InterpreterTypeJS:
		return NewJSInterpreter(gs)
	default:
		return NewJSInterpreter(gs)
	}
}

func (t *XTest) Interpreter() Interpreter {
	return t.interpreter
}

func WithGlobalStore(flag bool) Option {
	return func(t *XTest) {
		t.useGlobalStore = true
	}
}

func WithInterpreter(interpreterType InterpreterType) Option {
	return func(t *XTest) {
		t.interpreterType = interpreterType
		t.interpreter = t.getInterpreter(interpreterType)
	}
}
