import React, {useEffect, useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Card, Col, Empty, Form, Input, Row, Select, Table} from "antd";
import {connect} from "dva";
import {ConnectState, Pagination} from "@/models/connect";
import {AppItem} from "@/models/app";
import {Dispatch, UserGroupItem} from "@@/plugin-dva/connect";
import ModalSetAppPerm from "@/pages/permission/components/ModelSetAppPerm";

interface AppProps {
  appList: AppItem[]
  appListLoading: boolean
  dispatch: Dispatch
  appListPagination: Pagination
  userGroups: UserGroupItem[]
}

function App(props: AppProps) {
  const {dispatch, userGroups} = props
  const [userGroup, setUserGroup] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [currentApp, setCurrentApp] = useState<any>(null)
  const [modalSetAppPermVisible, setModalSetAppPermVisible] = useState<boolean>(false)

  const loadPageList = (page: number, pageSize: number, searchText: string = '') => {
    dispatch({
      type: 'app/fetchListWithEnv',
      payload: {
        pageSize,
        page,
        searchText
      }
    })
  }

  const onSelectUserGroup = (groupName: string) => {
    setUserGroup(groupName)
  }

  const onSearch = (text: string) => {
    setSearchText(text)
    loadPageList(1, 10, text)
  }

  useEffect(() => {
    loadPageList(1, 10)
    dispatch({
      type: 'userGroup/fetch',
    })
  }, [])

  return <PageHeaderWrapper>
    <Card>

      <Form labelAlign={"left"} layout={"inline"}>
        <Row justify={"space-between"} style={{width: '100%'}}>
          <Col span={6}>
            <Form.Item label={"用户组"}>
              <Select style={{minWidth: '160px'}} onSelect={onSelectUserGroup}>
                {userGroups.map(item => {
                  return <Select.Option value={item.name}>
                    {item.name}
                  </Select.Option>
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item>
              <Input.Search
                placeholder={"搜索应用名"}
                onSearch={onSearch}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>


      <Row style={{marginTop: '10px'}}>

        {userGroup ? <Table
          bordered
          rowKey={'aid'}
          dataSource={props.appList}
          loading={props.appListLoading}
          pagination={props.appListPagination}
          onChange={(pagination) => {
            loadPageList(pagination.current || 1, pagination.pageSize || 10, searchText)
          }}
          style={{width: '100%'}}
          columns={[
            {title: 'AID', dataIndex: 'aid', key: 'aid'},
            {title: 'App Name', dataIndex: 'app_name', key: 'app_name'},
            {
              title: '操作',
              render(row) {
                return <Button
                  type={"link"}
                  onClick={() => {
                    console.log("currentApp", row)
                    setModalSetAppPermVisible(true)
                    setCurrentApp(row)
                  }}
                >设置权限</Button>
              }
            }
          ]}
        /> : <div style={{textAlign: 'center', width: '100%', padding: '50px'}}>
          <Empty
            description={"请先选择用户组"}
          />
        </div>
        }

      </Row>

    </Card>

    <ModalSetAppPerm
      appName={currentApp?.app_name}
      envs={currentApp?.envs}
      onCancel={() => setModalSetAppPermVisible(false)}
      onOk={() => setModalSetAppPermVisible(false)}
      visible={modalSetAppPermVisible}
      userGroup={userGroup}
    />
  </PageHeaderWrapper>;
}

const mapStateToProps = ({app, userGroup}: ConnectState) => {
  return {
    appList: app.listWithEnv,
    appListLoading: app.loading,
    appListPagination: app.pagination,
    userGroups: userGroup.userGroups
  }
}

export default connect(mapStateToProps)(App)
