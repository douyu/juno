package sentinel

import (
	"context"
	"fmt"
	"time"

	"github.com/prometheus/client_golang/api"
	apiv1 "github.com/prometheus/client_golang/api/prometheus/v1"
)

func Init() {
	client, err := api.NewClient(api.Config{Address: "http://10.1.61.152:19090"})
	if err != nil {
		fmt.Println("==================", err)
		return
	}
	apiClient := apiv1.NewAPI(client)
	now := time.Now()
	startTime := now.Add(-15 * time.Minute)
	series, _, err := apiClient.Series(context.TODO(), []string{"sentinel_request"}, startTime, now)
	fmt.Println("==================", series, err)
}
