package k8s

import (
	"testing"
)

func TestKeyLock(t *testing.T) {
	k := &keyLock{}
	k.Lock(1, "11")
	k.UnLock(1, "11")

}
