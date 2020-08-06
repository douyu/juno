package util

import "testing"

func TestDiffList(t *testing.T) {
	type Item struct {
		val string
	}
	itemsA := []Item{
		{"hello"},
		{"nihao"},
	}
	itemsB := []Item{
		{"hello"},
		{"world"},
	}

	list := DiffList(itemsA, itemsB, func(a, b interface{}) bool {
		itemA, itemB := a.(Item), b.(Item)
		return itemA.val == itemB.val
	})

	if len(list) != 1 {
		t.Logf("length not eq 1")
		t.FailNow()
	}

	itemInterface, ok := list[0].(Item)
	if !ok {
		t.Logf("convert failed")
		t.FailNow()
	}

	if itemInterface.val != "nihao" {
		t.Logf("val = %v", itemInterface)
		t.FailNow()
	}
}

func TestDiffListToSlicef(t *testing.T) {
	type Item struct {
		val string
	}
	itemsA := []Item{
		{"hello"},
		{"nihao"},
	}
	itemsB := []Item{
		{"hello"},
		{"world"},
	}

	list := DiffListToSlice(itemsA, itemsB, func(a, b interface{}) bool {
		itemA, itemB := a.(Item), b.(Item)
		return itemA.val == itemB.val
	})

	listRes := list.([]Item)
	if len(listRes) != 1 {
		t.Logf("length not eq 1. len = %d", len(listRes))
		t.FailNow()
	}

	itemInterface := listRes[0]
	if itemInterface.val != "nihao" {
		t.Logf("val = %v", itemInterface)
		t.FailNow()
	}
}