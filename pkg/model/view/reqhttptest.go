package view

import "github.com/douyu/juno/pkg/model/db"

type (
	CreateHttpTestCollection struct {
		AppName string `json:"app_name" validate:"required"`
		Name    string `json:"name" validate:"required"`
	}

	ListHttpCollection struct {
		AppName  string `query:"app_name" validate:"required"`
		Page     uint   `query:"page"`
		PageSize uint   `query:"page_size"`
	}

	CreateHttpTestCase struct {
		Name         string           `json:"name" valid:"required"`
		CollectionID uint             `json:"collection_id" valid:"required"`
		URL          string           `json:"url"`
		Method       string           `json:"method"`
		Query        db.HttpTestParam `json:"query"`
		Headers      db.HttpTestParam `json:"headers"`
		ContentType  string           `json:"content_type"`
		Body         string           `json:"body"`
	}

	UpdateHttpTestCase struct {
		ID          uint             `json:"id"`
		Name        string           `json:"name" valid:"required"`
		URL         string           `json:"url"`
		Method      string           `json:"method"`
		Query       db.HttpTestParam `json:"query"`
		Headers     db.HttpTestParam `json:"headers"`
		ContentType string           `json:"content_type"`
		Body        string           `json:"body"`
	}

	QueryHttpTestCollection struct {
		CollectionID uint `query:"collection_id" json:"collection_id" validate:"required"`
	}

	QueryHttpTestUseCase struct {
		UseCaseID uint `query:"id" json:"id" validate:"required"`
	}

	ReqSendHttpRequest struct {
		ID          uint             `json:"id" validate:"required"`
		Name        string           `json:"name" validate:"required"`
		URL         string           `json:"url" validate:"required"`
		Method      string           `json:"method" validate:"required"`
		Query       db.HttpTestParam `json:"query"`
		Headers     db.HttpTestParam `json:"headers"`
		ContentType string           `json:"content_type"`
		Body        string           `json:"body"`
		Script      string           `json:"script"` //测试脚本
	}

	ReqListHttpTestHistory struct {
		AppName  string `query:"app_name" validate:"required"`
		Page     uint   `query:"page"`
		PageSize uint   `query:"page_size"`
	}
)
