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

func TestFindIndex(t *testing.T) {
	type args struct {
		arr  interface{}
		item interface{}
		cmp  func(a, b interface{}) bool
	}
	tests := []struct {
		name      string
		args      args
		wantIndex int
	}{
		{
			name: "test string arr",
			args: args{
				arr:  []string{"a", "b"},
				item: "a",
				cmp:  func(a, b interface{}) bool { return a.(string) == b.(string) },
			},
			wantIndex: 0,
		},
		{
			name: "test string arr",
			args: args{
				arr:  []string{"a", "b"},
				item: "c",
				cmp:  func(a, b interface{}) bool { return a.(string) == b.(string) },
			},
			wantIndex: -1,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if gotIndex := FindIndex(tt.args.arr, tt.args.item, tt.args.cmp); gotIndex != tt.wantIndex {
				t.Errorf("FindIndex() = %v, want %v", gotIndex, tt.wantIndex)
			}
		})
	}
}
