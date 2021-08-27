package worker

import (
	"github.com/douyu/juno/internal/app/worker/handler"
	"github.com/douyu/jupiter/pkg/server/xecho"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

func (w *Worker) serveHttp() error {
	s := xecho.StdConfig("http").MustBuild()

	s.Validator = &FormValidator{
		validator: validator.New(),
	}

	apiV1(s.Group("/api/v1"))

	return w.Serve(s)
}

func apiV1(g *echo.Group) {
	g.POST("/testTask/dispatch", handler.DispatchTestTask)
}
