package util

import (
	"reflect"
	"runtime"
	"sync"
)

// Go goroutine
func Go(fn func()) {
	go fn()
}

// SafeGo safe go
func SafeGo(fn func(), rec func(error)) {
	go func() {
		defer func() {
			if err := recover(); err != nil {
				rec(err.(error))
			}
		}()
		fn()
	}()
}

// Serial 串行
func Serial(fns ...func()) func() {
	return func() {
		for _, fn := range fns {
			fn()
		}
	}
}

// Parallel 并发执行
func Parallel(fns ...func()) func() {
	var wg sync.WaitGroup

	return func() {
		for _, fn := range fns {
			wg.Add(1)
			go func(fn func()) {
				defer wg.Done()
				fn()
			}(fn)
		}
		wg.Wait()
	}
}

// LimitParallel 并发,最大并发量restrict
func LimitParallel(restrict int, fns ...func()) func() {
	var channel = make(chan struct{}, restrict)
	return func() {
		var wg sync.WaitGroup
		for _, fn := range fns {
			wg.Add(1)
			go func(fn func()) {
				defer wg.Done()
				channel <- struct{}{}
				fn()
				<-channel
			}(fn)
		}
		wg.Wait()
		close(channel)
	}
}

func functionName(i interface{}) string {
	return runtime.FuncForPC(reflect.ValueOf(i).Pointer()).Name()
}
