package httptest

import (
	"errors"
	"fmt"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/douyu/jupiter/pkg/store/gorm"
	"golang.org/x/sync/errgroup"
)

func CreateCollection(uid uint, req view.CreateHttpTestCollection) (collection view.HttpTestCollection, err error) {
	var app db.AppInfo

	err = option.DB.Where("app_name = ?", req.AppName).First(&app).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = fmt.Errorf("应用不存在:" + req.AppName)
		}

		return
	}

	col := db.HttpTestCollection{
		CreatedBy: uid,
		AppName:   req.AppName,
		Name:      req.Name,
	}

	err = option.DB.Save(&col).Error
	if err != nil {
		return
	}

	collection = view.HttpTestCollection{
		ID:        col.ID,
		AppName:   col.AppName,
		Name:      col.Name,
		CreatedAt: col.CreatedAt,
	}

	return
}

func ListCollection(uid uint, req view.ListHttpCollection) (resp view.RespListHttpTestCollection, err error) {
	var testCollections []db.HttpTestCollection
	var eg errgroup.Group

	query := option.DB.Where("created_by = ?", uid).Where("app_name = ?", req.AppName)

	eg.Go(func() error {
		page := req.Page
		pageSize := req.PageSize
		if pageSize == 0 {
			pageSize = 10
		}
		if pageSize > 1000 {
			pageSize = 1000
		}
		offset := page * pageSize

		err = query.Preload("TestCases").Find(&testCollections).Offset(offset).Limit(pageSize).Error
		if err != nil {
			return err
		}

		for _, collection := range testCollections {
			item := view.HttpTestCollection{
				ID:        collection.ID,
				AppName:   collection.AppName,
				Name:      collection.Name,
				CreatedAt: collection.CreatedAt,
			}

			for _, testCase := range collection.TestCases {
				item.TestCases = append(item.TestCases, view.HttpTestCase{
					ID:          testCase.ID,
					Name:        testCase.Name,
					URL:         testCase.URL,
					Method:      testCase.Method,
					Query:       testCase.Query,
					Headers:     testCase.Headers,
					ContentType: testCase.ContentType,
					Body:        testCase.Body,
				})
			}

			resp.List = append(resp.List, item)
		}

		resp.Pagination.Current = int(page)
		resp.Pagination.PageSize = int(pageSize)

		return nil
	})

	eg.Go(func() error {
		err := query.Model(&db.HttpTestCollection{}).Count(&resp.Pagination.Total).Error
		if err != nil {
			return err
		}

		return nil
	})

	err = eg.Wait()
	if err != nil {
		return
	}

	return
}

func DeleteCollection(uid, id uint) (err error) {
	query := option.DB.Where("id = ?", id).Delete(&db.HttpTestCollection{})
	if query.RowsAffected == 0 {
		err = fmt.Errorf("collection 不存在")
		return
	}

	err = query.Error
	if err != nil {
		return
	}

	return
}
