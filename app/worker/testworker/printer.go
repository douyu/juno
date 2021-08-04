package testworker

import (
	"bytes"
)

type (
	Printer struct {
		C       chan string
		buf     *bytes.Buffer
		readBuf []byte
		bufSize uint32
	}
)

func NewPrinter(bufSize uint32) *Printer {
	return &Printer{
		C:       make(chan string), // sync
		buf:     bytes.NewBuffer([]byte{}),
		bufSize: bufSize,
		readBuf: make([]byte, bufSize),
	}
}

func (p Printer) Write(data []byte) (n int, err error) {
	n, err = p.buf.Write(data)
	if err != nil {
		return
	}

	for p.buf.Len() >= int(p.bufSize) {
		n, _ = p.buf.Read(p.readBuf)
		p.C <- string(p.readBuf[:n]) // sync
	}

	return len(data), nil
}

func (p Printer) Flush() (data []byte) {
	buf := make([]byte, p.bufSize)
	n, _ := p.buf.Read(buf)
	return buf[:n]
}
