package pipeline

import (
	"encoding/json"
	"testing"
)

func TestJobGitPull(t *testing.T) {
	payload := JobGitPull(
		"https://github.com/linux/linux",
		"master",
		"token",
	)

	payloadBytes, _ := json.Marshal(payload)
	t.Logf("payload = %s", string(payloadBytes))
}
