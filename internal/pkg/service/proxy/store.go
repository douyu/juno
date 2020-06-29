package proxy

import "github.com/douyu/juno/pb"

var StreamStore *store

type store struct {
	Stream  pb.Proxy_NotifyServer
	isStore bool
}

func InitStreamStore() {
	StreamStore = &store{}
}

func (s *store) AddStream(stream pb.Proxy_NotifyServer) {
	s.Stream = stream
	s.isStore = true
}

func (s *store) GetStream() pb.Proxy_NotifyServer {
	return s.Stream
}

func (s *store) DeleteStream() {
	s.Stream = nil
	s.isStore = false
}

func (s *store) IsStreamExist() bool {
	return s.isStore
}
