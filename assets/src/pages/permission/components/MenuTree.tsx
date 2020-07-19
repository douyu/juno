import React, {ReactText} from "react";
import {Checkbox, List} from "antd";
import styles from './menu_tree.less';

const SubMenuOffsetWidth = 20;
const MaxMenuWidth = 250;

export interface APIItem {
  path: string
  method: string
  name: string
}

export interface PermissionItem {
  name: string
  path: string
  api: APIItem[]
  children?: PermissionItem[]
}

export interface MenuTreeProps {
  checkedMenu: ReactText[]
  checkedAPI: APIItem[]
  permissionTree: PermissionItem[]
  onMenuChange: (checkedMenu: ReactText[]) => void
  onAPIChange: (checkedAPI: APIItem[]) => void
  disabled?: boolean
}

function MenuTree(props: MenuTreeProps) {
  const {permissionTree, checkedMenu, checkedAPI, onMenuChange, onAPIChange, disabled = false} = props

  let menuCheckedMap = {}
  checkedMenu.map(item => {
    menuCheckedMap[item] = true
  })

  return <List bordered split className={styles.menuTree}>
    <List.Item>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          display: "grid",
          gridTemplateColumns: MaxMenuWidth + 'px auto'
        }}
      >
        <div>菜单</div>
        <div
          style={{borderLeft: '1px solid #eee'}}
        >
          API权限
        </div>
      </div>
    </List.Item>
    {permissionTree.map(item => {
      return <List.Item>
        <MenuTreeItem
          disabled={disabled}
          checkedAPI={checkedAPI}
          checked={checkedMenu.indexOf(item.path) > -1}
          menuPath={[]}
          checkedMenu={props.checkedMenu}
          {...item}
          onAPIChange={(ev) => {
            let afterChecked = checkedAPI.filter(item => {
              return item.path != ev.path || item.method != item.method
            })
            if (ev.checked) {
              afterChecked = [
                ...afterChecked,
                ev
              ]
            }
            onAPIChange(afterChecked)
          }}
          onMenuChange={(fields) => {
            fields.map(item => {
              menuCheckedMap[item.path] = item.checked
            })
            onMenuChange(Object.keys(menuCheckedMap).filter(key => menuCheckedMap[key]).map((key: string) => key))
          }}
          depth={0}/>
      </List.Item>
    })}
  </List>
}

export interface MenuTreeItemProps extends PermissionItem {
  checkedMenu: ReactText[]
  checkedAPI: APIItem[]
  disabled: boolean
  onMenuChange: (menu: { path: ReactText, checked: boolean }[]) => void
  onAPIChange: (event: { path: string, method: string, checked: boolean, name: string }) => void
  depth: number
  menuPath: ReactText[]
  checked: boolean
}

function MenuTreeItem(props: MenuTreeItemProps) {
  const depth = props.depth
  const offset = SubMenuOffsetWidth * depth
  const menuWidth = MaxMenuWidth - offset

  return <div
    className={styles.menuItem}
    style={{paddingLeft: SubMenuOffsetWidth * depth + 'px'}}
  >
    <div
      className={styles.menuItemContainer}
      style={{
        gridTemplateColumns: menuWidth + 'px auto'
      }}
    >
      <div>
        <Checkbox disabled={props.disabled} checked={props.checked} onChange={e => {
          if (e.target.checked) {
            props.onMenuChange([
              ...props.menuPath.map(path => ({path, checked: true})),
              {path: props.path, checked: true},
              ...(props.children || []).map(item => ({path: item.path, checked: true}))
            ])
          } else {
            props.onMenuChange([
              {path: props.path, checked: false},
              ...(props.children || []).map(item => ({path: item.path, checked: false}))
            ])
          }
        }}>
          {props.name}
        </Checkbox>
      </div>
      <div>
        {props.api?.map(item => {
          let checked = false
          props.checkedAPI.map(api => {
            if (api.method === item.method && api.path === item.path) {
              checked = true
            }
          })

          return <span>
            <Checkbox
              disabled={props.disabled}
              checked={checked}
              onChange={e => {
                props.onAPIChange({
                  ...item,
                  checked: e.target.checked
                })
              }}
            >{item.name}</Checkbox>
          </span>
        })}
      </div>
    </div>
    <div>
      {(props.children || []).map(item => {
        return <MenuTreeItem
          disabled={props.disabled}
          checkedAPI={props.checkedAPI}
          onAPIChange={props.onAPIChange}
          checked={props.checkedMenu.indexOf(item.path) > -1}
          checkedMenu={props.checkedMenu}
          onMenuChange={props.onMenuChange}
          menuPath={[...props.menuPath, props.path]}
          {...item}
          depth={depth + 1}
        />
      })}
    </div>
  </div>
}

export default MenuTree
