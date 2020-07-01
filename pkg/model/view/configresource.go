package view

import "time"

type (
	ReqListConfigResource struct {
		Page     uint     `json:"page"`
		PageSize uint     `json:"page_size" valid:"required"`
		Env      []string `json:"env"`
		Zone     []string `json:"zone"`
		Tag      string   `json:"tag"`
		Query    string   `json:"query"`
	}

	RespListConfigResource struct {
		Pagination Pagination                   `json:"pagination"`
		List       []RespListConfigResourceItem `json:"list"`
	}

	RespListConfigResourceItem struct {
		ID            uint      `json:"id"`
		UID           uint      `json:"uid"`
		UserName      string    `json:"user_name"`
		Name          string    `json:"name"`
		Env           string    `json:"env"`
		ZoneName      string    `json:"zone_name"`
		ZoneCode      string    `json:"zone_code"`
		IsGlobal      bool      `json:"is_global"`
		Description   string    `json:"description"`
		LatestVersion uint      `json:"latest_version"`
		LastUpdate    time.Time `json:"last_update"`
		Value         string    `json:"value"`
		Tags          []string  `json:"tags"`
	}

	ReqCreateConfigResource struct {
		Env         string   `json:"env" valid:"required"`
		Zone        string   `json:"zone" valid:"required"`
		Name        string   `json:"name" valid:"required"`
		Value       string   `json:"value" valid:"required"`
		IsGlobal    bool     `json:"is_global"`
		Description string   `json:"description" valid:"required"`
		Visible     bool     `json:"visible"`
		Tags        []string `json:"tags"`
	}

	ReqDetailConfigResource struct {
		ID uint `json:"id" valid:"required"`
	}

	RespDetailConfigResource struct {
		UserName      string                  `json:"user_name"`
		Name          string                  `json:"name"`
		Env           string                  `json:"env"`
		ZoneName      string                  `json:"zone_name"`
		ZoneCode      string                  `json:"zone_code"`
		IsGlobal      bool                    `json:"is_global"`
		Description   string                  `json:"description"`
		LatestVersion uint                    `json:"latest_version"`
		LastUpdate    time.Time               `json:"last_update"`
		Versions      []ConfigResourceVersion `json:"versions"`
		Tags          []string                `json:"tags"`
		Value         string                  `json:"value"`
	}

	ReqGetConfigResourceByName struct {
		Name string `json:"name"`
		Env  string `json:"env"`
		Zone string `json:"zone"` // Zone Code
	}

	ConfigResourceVersion struct {
		Version   uint      `json:"version"`
		CreatedAt time.Time `json:"created_at"`
	}

	ReqCreateConfigResourceVersion struct {
		ID          uint     `json:"id" valid:"required"`
		Value       string   `json:"value" valid:"required"`
		Description string   `json:"description" valid:"required"`
		Tags        []string `json:"tags"`
	}

	ReqBatchCheckResourceVersion []struct {
		Name    string `json:"name"`
		Version uint   `json:"version"`
		Zone    string `json:"zone"` // zone code
		Env     string `json:"env"`
	}

	RespBatchCheckResourceVersion []BatchCheckResourceVersionItem

	BatchCheckResourceVersionItem struct {
		Name          string    `json:"name"`
		Value         string    `json:"value"`
		Version       uint      `json:"version"`
		LatestVersion uint      `json:"latest_version"`
		UpdatedAt     time.Time `json:"updated_at"`
	}
)
