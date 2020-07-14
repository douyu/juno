import React, {ReactText, useEffect, useState} from "react";
import {MenuDataItem, PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Card, Col, Form, message, Row, Select, Tree} from "antd";
import {connect} from "umi";
import {ConnectState} from "@/models/connect";
import {Dispatch, UserGroupItem} from "@@/plugin-dva/connect";
import {convertMenuTreeToTreeData} from "@/utils/permission";
import {loadUserGroupMenuList, setUserGroupMenuPerm} from "@/services/permission";

interface MenuProps {
  dispatch: Dispatch
  userGroups: UserGroupItem[]
  menu: MenuDataItem[]
}

const classifyCheckedKeysToHalfChecked = (checkedKeys: string[], menu: MenuDataItem[]): { checked: string[], halfChecked: string[] } => {
  let menuPathMap = {}
  let expandMenuFunctor = (menu: MenuDataItem[], path = '') => {
    menu.map(item => {
      let path = item.path || ''
      item.children && expandMenuFunctor(item.children, path)
      menuPathMap[path] = item.children && true
    })
  }
  expandMenuFunctor(menu)

  return {
    halfChecked: checkedKeys.filter(item => {
      return menuPathMap[item] && true
    }),
    checked: checkedKeys.filter(item => {
      return !menuPathMap[item]
    })
  }
}

const Menu = (props: MenuProps) => {
  const {userGroups, menu, dispatch} = props
  const [checkedKeys, setCheckedKeys] = useState<ReactText[]>([])
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<ReactText[]>([])
  const [currentUserGroup, setCurrentUserGroup] = useState<string>('admin')
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const isAdmin = currentUserGroup === 'admin'

  const onSelectUserGroup = (val: string) => {
    setCurrentUserGroup(val)
    loadUserGroupMenuList(val).then(r => {
      const {checked, halfChecked} = classifyCheckedKeysToHalfChecked(r.data, menu)

      setCheckedKeys(checked)
      setHalfCheckedKeys(halfChecked)
    })
  }

  useEffect(() => {
    dispatch({
      type: 'userGroup/fetch'
    })
    onSelectUserGroup('admin')
  }, [])

  const onSubmit = () => {
    console.log(checkedKeys, halfCheckedKeys, currentUserGroup)
    let checkedMenu = [...checkedKeys, ...halfCheckedKeys] as string[]
    setSubmitLoading(true)
    setUserGroupMenuPerm(currentUserGroup, checkedMenu).then(r => {
      setSubmitLoading(false)

      if (r.code !== 0) message.error("保存菜单权限失败: " + r.msg)

      message.success("保存成功!")
    })
  }

  return <PageHeaderWrapper>
    <Card style={{minHeight: '600px'}}>
      <Form>

        <Row gutter={{xs: 8, sm: 16, md: 24}}>

          <Col span={8}>
            <Form.Item label={"用户组"}>
              <Select onSelect={onSelectUserGroup} value={currentUserGroup}>
                {userGroups.map(item => <Select.Option value={item.name} key={item.name}>
                  {item.name}
                </Select.Option>)}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button loading={submitLoading} onClick={onSubmit} disabled={isAdmin}>更新</Button>
            </Form.Item>

          </Col>

          <Col span={16}>

            <Tree
              checkable
              autoExpandParent
              defaultExpandAll
              disabled={isAdmin}
              checkedKeys={checkedKeys}
              treeData={convertMenuTreeToTreeData(menu)}
              onCheck={(checked, {halfCheckedKeys}) => {
                // @ts-ignore
                setCheckedKeys(checked)
                // @ts-ignore
                setHalfCheckedKeys(halfCheckedKeys)
              }}
            />

          </Col>

        </Row>

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

export default connect(mapStateToProps)(Menu)
