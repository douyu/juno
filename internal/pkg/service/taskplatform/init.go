package taskplatform

import "fmt"

func Init() {
	// init id creator
	if err := initID(); err != nil {
		panic(fmt.Sprintf("Init UUID Generator failed: %s", err))
	}

}
