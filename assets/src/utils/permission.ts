import {MenuDataItem} from "@ant-design/pro-layout";
import {APITreeItem} from "@/pages/permission/API";

export interface AntTreeItem {
  title: string
  key: string
  children: AntTreeItem[]
}

export function convertMenuTreeToTreeData(treeData: MenuDataItem[]): AntTreeItem[] {
  return treeData.map((item): AntTreeItem => {
    return {
      title: item.name || '',
      key: item.path || '',
      children: convertMenuTreeToTreeData(item.children || [])
    }
  })
}

export function convertAPITreeToAntTree(tree: APITreeItem[]): AntTreeItem[] {
  return tree.map((item): AntTreeItem => {
    return {
      key: JSON.stringify({method: item.method, path: item.path}),
      title: item.name,
      children: convertAPITreeToAntTree(item.children || [])
    }
  })
}
