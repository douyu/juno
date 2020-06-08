package library

// NewPool ...
func NewPool(n, bufSize int) *pool {
	return &pool{
		buffers: make(chan []byte, n),
		size:    bufSize,
	}
}

type pool struct {
	buffers chan []byte
	size    int
}

// Get ...
func (p *pool) Get() []byte {
	select {
	case b := <-p.buffers:
		return b
	default:
		return make([]byte, p.size)
	}
}

// Put ...
func (p *pool) Put(b []byte) {
	select {
	case p.buffers <- b:
	default:
	}
}
