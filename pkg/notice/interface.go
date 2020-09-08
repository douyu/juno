package notice

type notice interface {
	Send(*Message)
}
