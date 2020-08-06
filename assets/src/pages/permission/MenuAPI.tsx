import React, {ReactText, useEffect, useState} from "react";
import {MenuDataItem, PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Card, Form, message, Row, Select, Spin} from "antd";
import {connect} from "dva";
import {ConnectState} from "@/models/connect";
import {Dispatch, UserGroupItem} from "@@/plugin-dva/connect";
import {
  fetchPermissionTree,
  loadUserGroupAPIList,
  loadUserGroupMenuList,
  setUserGroupAPIPerm,
  setUserGroupMenuPerm
} from "@/services/permission";
import MenuTree, {APIItem, PermissionItem} from "@/pages/permission/components/MenuTree";

interface MenuProps {
  dispatch: Dispatch
  userGroups: UserGroupItem[]
  menu: MenuDataItem[]
}

const MenuAPI = (props: MenuProps) => {
  //@ts-ignore
  const {userGroups, menu, dispatch} = props
  const [checkedMenu, setCheckedMenu] = useState<ReactText[]>([])
  const [checkedAPI, setCheckedAPI] = useState<APIItem[]>([])
  const [currentUserGroup, setCurrentUserGroup] = useState<string>('admin')
  const [permissionTree, setPermissionTree] = useState<PermissionItem[]>([])
  const [loadingPermission, setLoadingPermission] = useState(0)
  const isAdmin = currentUserGroup === 'admin'

  const onSelectUserGroup = (val: string) => {
    let loadingCnt = 2
    setCurrentUserGroup(val)
    setLoadingPermission(2)
    loadUserGroupMenuList(val).then(r => {
      if (r.code === 14000) return;
      if (r.code !== 0) {
        message.error("加载菜单权限失败:" + r.msg)
        return
      }

      setLoadingPermission(--loadingCnt)
      setCheckedMenu(r.data || [])
    })

    loadUserGroupAPIList(val).then(r => {
      if (r.code !== 0) {
        message.error("加载API权限失败:" + r.msg)
        return
      }

      setLoadingPermission(--loadingCnt)
      setCheckedAPI(r.data || [])
    })
  }

  useEffect(() => {
    dispatch({
      type: 'userGroup/fetch'
    })
    onSelectUserGroup('admin')

    fetchPermissionTree().then(r => {
      if (r.code !== 0 && r.code !== 14000) {
        message.error("加载权限树失败:" + r.msg)
        return
      }

      setPermissionTree(r.data)
    })
  }, [])

  const onSubmit = () => {
    console.log(checkedMenu, checkedAPI)
    message.loading({content: "正在保存菜单权限", key: 'message_save_menu'})
    message.loading({content: "正在保存API权限", key: 'message_save_api'})
    setUserGroupMenuPerm(currentUserGroup, checkedMenu as string[]).then(r => {

      if (r.code !== 0) message.error({
        content: "保存菜单权限失败: " + r.msg,
        key: 'message_save_menu',
        duration: 2
      })

      message.success({
        content: "菜单权限保存成功",
        key: 'message_save_menu',
        duration: 2
      })
    })

    setUserGroupAPIPerm(currentUserGroup, checkedAPI).then(r => {
      if (r.code !== 0) message.error({
        content: "保存API权限失败: " + r.msg,
        key: 'message_save_api',
        duration: 2
      })

      message.success({
        content: "保存API权限成功",
        key: 'message_save_api',
        duration: 2
      })
    })
  }

  return <PageHeaderWrapper>
    <Card style={{minHeight: '600px'}}>
      <Form>

        <Row>
          <Form.Item label={"用户组"}>
            <Select style={{width: '120px'}} onSelect={onSelectUserGroup} value={currentUserGroup}>
              {userGroups.map(item => <Select.Option value={item.name} key={item.name}>
                {item.name}
              </Select.Option>)}
            </Select>
          </Form.Item>
          <Button style={{marginLeft: '10px'}} onClick={onSubmit} disabled={isAdmin}>更新</Button>
        </Row>

        <div style={{marginTop: '10px'}}>
          <Spin spinning={loadingPermission !== 0} tip={"加载权限中"}>
            <MenuTree
              disabled={isAdmin}
              onMenuChange={(menu) => {
                setCheckedMenu(menu)
              }}
              onAPIChange={(checkedAPI) => {
                setCheckedAPI(checkedAPI)
              }}
              checkedMenu={checkedMenu}
              checkedAPI={checkedAPI}
              permissionTree={permissionTree}
            />
          </Spin>
        </div>

      </Form>
    </Card>
  </PageHeaderWrapper>
}

const mapStateToProps = ({userGroup, global}: ConnectState) => {
  return {
    userGroups: userGroup.userGroups,
    menu: global.menu
  }
}

export default connect(mapStateToProps)(MenuAPI)
