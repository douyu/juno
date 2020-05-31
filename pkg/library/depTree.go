package library

// Tree ...
type Tree struct {
	ID       int         `json:"id"`
	Value    interface{} `json:"value"`
	Children []*Tree     `json:"children"`
}

// 只需指定两个id的父子关系，即可得到一颗树形结构
type Dep struct {
	RootID  int         `json:"root_id"`
	ChildID int         `json:"child_id"`
	Value   interface{} `json:"value"`
}

func removeIndex(arr []Dep, index int) []Dep {
	return append(arr[index+1:], arr[0:index]...)
}

// 填充树 递归数组
func GetTreeByDepList(rootid int, datas []Dep, root *Tree) {
	for index, v := range datas {
		parentid := v.RootID
		childId := v.ChildID
		child := Tree{
			ID:       childId,
			Value:    v.Value,
			Children: []*Tree{},
		}
		if rootid == parentid { // 找出根节点属于该树的
			root.Children = append(root.Children, &child)
			rest := removeIndex(datas, index)
			GetTreeByDepList(childId, rest, &child)
		}
	}
	return
}

var ids []int

// 遍历树所有的id
func FindTreeIds(root *Tree) []int {
	ids = append(ids, root.ID)
	if len(root.Children) > 0 {
		for index, _ := range root.Children {
			FindTreeIds(root.Children[index])
		}
	}
	return ids
}
