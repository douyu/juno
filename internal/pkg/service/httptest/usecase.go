package httptest

import (
	"fmt"

	"github.com/douyu/juno/pkg/model/db"
	"github.com/douyu/juno/pkg/model/view"
	"github.com/jinzhu/gorm"
)

func GetUseCase(id uint) (useCase view.HttpTestCase, err error) {
	var testCase db.HttpTestCase

	err = option.DB.Where("id = ?", id).First(&testCase).Error
	if err != nil {
		return
	}

	useCase = view.HttpTestCase{
		ID:          testCase.ID,
		Name:        testCase.Name,
		URL:         testCase.URL,
		Method:      testCase.Method,
		Query:       testCase.Query,
		Headers:     testCase.Headers,
		ContentType: testCase.ContentType,
		Body:        testCase.Body,
	}

	return
}

func CreateUseCase(uid uint, req view.CreateHttpTestCase) (useCase view.HttpTestCase, err error) {
	var collection db.HttpTestCollection
	err = option.DB.Where("created_by = ? and id = ?", uid, req.CollectionID).First(&collection).Error
	if err != nil {
		if gorm.IsRecordNotFoundError(err) {
			err = fmt.Errorf("collection 不存在")
		}

		return
	}

	testCase := db.HttpTestCase{
		CollectionID: req.CollectionID,
		Name:         req.Name,
		URL:          req.URL,
		Method:       req.Method,
		Query:        req.Query,
		Headers:      req.Headers,
		ContentType:  req.ContentType,
		Body:         req.Body,
	}
	err = option.DB.Save(&testCase).Error
	if err != nil {
		return
	}

	useCase = view.HttpTestCase{
		ID:          testCase.ID,
		Name:        testCase.Name,
		URL:         testCase.URL,
		Method:      testCase.Method,
		Query:       testCase.Query,
		Headers:     testCase.Headers,
		ContentType: testCase.ContentType,
		Body:        testCase.Body,
	}

	return
}

func DeleteUseCase(uid uint, useCaseID uint) (err error) {
	var testCase db.HttpTestCase

	err = option.DB.Preload("Collection").
		Where("id = ?", useCaseID).First(&testCase).Error
	if err != nil {
		return
	}

	if testCase.Collection.CreatedBy != uid {
		return fmt.Errorf("用例不存在")
	}

	err = option.DB.Delete(&testCase).Error
	if err != nil {
		return err
	}

	return
}

func UpdateUseCase(uid uint, useCase view.HttpTestCase) (err error) {
	var testCase db.HttpTestCase

	err = option.DB.Preload("Collection").
		Where("id = ?", useCase.ID).First(&testCase).Error
	if err != nil {
		return
	}

	if testCase.Collection.CreatedBy != uid {
		return fmt.Errorf("用例不存在")
	}

	{
		testCase.ID = useCase.ID
		testCase.Name = useCase.Name
		testCase.URL = useCase.URL
		testCase.Method = useCase.Method
		testCase.Query = useCase.Query
		testCase.Headers = useCase.Headers
		testCase.ContentType = useCase.ContentType
		testCase.Body = useCase.Body
	}

	err = option.DB.Save(&testCase).Error
	if err != nil {
		return
	}

	return
}
