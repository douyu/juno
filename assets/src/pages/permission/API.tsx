import React, {ReactText, useEffect, useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Card, Col, Form, message, Row, Select, Tree} from "antd";
import {connect} from "dva";
import {ConnectState} from "@/models/connect";
import {loadAPITree, loadUserGroupAPIList, setUserGroupAPIPerm} from "@/services/permission";
import {AntTreeItem, convertAPITreeToAntTree} from "@/utils/permission";
import {UserGroupItem} from "@/models/user_group";
import {Dispatch} from "@@/plugin-dva/connect";

export interface APITreeItem {
  method?: string
  path: string
  name: string
  children: APITreeItem[]
}

interface APIProps {
  userGroups: UserGroupItem[]
  dispatch: Dispatch
}

function API(props: APIProps) {
  const {dispatch} = props
  const [apiTree, setAPITree] = useState<AntTreeItem[]>([])
  const [currentUserGroup, setCurrentUserGroup] = useState<string>('admin')
  const [checkedKeys, setCheckedKeys] = useState<ReactText[]>([])
  const isAdmin = currentUserGroup === 'admin'

  useEffect(() => {
    dispatch({
      type: 'userGroup/fetch'
    })
    onSelectUserGroup('admin')

    loadAPITree().then(r => {
      if (r.code !== 0) {
        message.error("加载API列表失败:" + r.msg)
        return
      }

      setAPITree(convertAPITreeToAntTree(r.data))
      return
    })
  }, [])

  const onSelectUserGroup = (group: string) => {
    setCurrentUserGroup(group)
    loadUserGroupAPIList(group).then(r => {
      setCheckedKeys((r.data || []).map((item: any) => JSON.stringify(item)))
    })
  }

  const onSubmit = () => {
    let apiList = checkedKeys.map((item: ReactText) => JSON.parse(item as string))
    setUserGroupAPIPerm(currentUserGroup, apiList).then(r => {
      if (r.code !== 0) {
        message.error("保存失败:" + r.msg)
        return
      }

      message.success("保存成功")
    })
  }

  return <PageHeaderWrapper>
    <Card style={{minHeight: '600px'}}>
      <Row gutter={{xs: 8, sm: 16, md: 24}}>
        <Col span={8}>
          <Form>
            <Form.Item label={"用户组"}>
              <Select onSelect={onSelectUserGroup} value={currentUserGroup}>
                {props.userGroups.map(item => {
                  return <Select.Option value={item.name}>{item.name}</Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button onClick={onSubmit} disabled={isAdmin}>更新</Button>
            </Form.Item>
          </Form>

        </Col>
        <Col span={16}>
          {apiTree && apiTree.length > 0 && <Tree
            checkable
            autoExpandParent
            defaultExpandAll
            disabled={isAdmin}
            checkedKeys={checkedKeys}
            //@ts-ignore
            onCheck={(checked: ReactText[]) => {
              setCheckedKeys(checked)
            }}
            treeData={apiTree}
          />}
        </Col>
      </Row>
    </Card>
  </PageHeaderWrapper>
}

const mapStateToProps = ({userGroup}: ConnectState) => {
  return {
    userGroups: userGroup.userGroups
  }
}

export default connect(mapStateToProps)(API)
