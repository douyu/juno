package grpcgovern

import (
	"fmt"
	"net/http"
	"sync"
	"time"
)

const (
	GovernOK            GovernStatus = "ok"
	GovernTimeout       GovernStatus = "timeout"
	GovernInvalidDomain GovernStatus = "invalid_domain"
	GovernUnknownError  GovernStatus = "unknown_error"
	GovernUnknown       GovernStatus = "unknown"
)

type GovernStatus string

type HealthStatus struct {
	Status  GovernStatus
	Message string // 如果服务有异常，这里显示错误信息
}

func (g *GrpcGovern) GovernStatus(zoneCode string) HealthStatus {
	ret, ok := g.governStatus[zoneCode]
	if !ok {
		return HealthStatus{
			Status:  GovernUnknown,
			Message: "未知的状态",
		}
	}
	return ret
}

func (g *GrpcGovern) healthCheckLoop() {
	for {
		wg := sync.WaitGroup{}
		wg.Add(len(g.DomainMap))
		for zoneCode, domain := range g.DomainMap {
			if domain != "" {
				go func() {
					defer wg.Done()
					g.updateGovernStatus(zoneCode, domain)
				}()
			}
		}
		wg.Wait()
		time.Sleep(30 * time.Second)
	}
}

func (g *GrpcGovern) updateGovernStatus(zoneCode, domain string) {
	url := domain + "/api/health"
	req := g.R().SetHeader("Authorization", g.Token)
	response, err := req.Get(url)
	g.governStatusMtx.Lock()
	defer g.governStatusMtx.Unlock()

	status := g.governStatus[zoneCode]
	defer func() {
		g.governStatus[zoneCode] = status
	}()

	if err != nil {
		status.Message = err.Error()
		status.Status = GovernUnknownError
		g.governStatus[zoneCode] = status
		return
	}

	if response.StatusCode() != http.StatusOK {
		// 请求失败
		if response.StatusCode() == http.StatusRequestTimeout {
			status.Status = GovernTimeout
			status.Message = fmt.Sprintf("%d: 请求超时 %s", http.StatusRequestTimeout, response.Error())
			return
		}

		if response.StatusCode() == http.StatusNotFound {
			status.Status = GovernInvalidDomain
			status.Message = fmt.Sprintf("无效的Govern地址")
			return
		}
	} else {
		status.Status = GovernOK
		status.Message = "health"
		return
	}

	status.Status = GovernUnknownError
	status.Message = fmt.Sprintf("%d: %v", response.StatusCode(), http.StatusText(response.StatusCode()))

	return
}
