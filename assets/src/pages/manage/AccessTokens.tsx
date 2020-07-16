import React, {useEffect, useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Card, Col, Form, List, message, Modal, Popconfirm, Row} from "antd";
import {ConnectState, Pagination} from "@/models/connect";
import {AccessTokenItem} from "@/models/access_token";
import {Dispatch} from "@@/plugin-dva/connect";
import {EyeOutlined, FileAddOutlined} from '@ant-design/icons'
import {Input} from "antd/es";
import {createAccessToken, deleteAccessToken} from "@/services/access_token";
import {connect} from "dva";
import {EyeInvisibleOutlined} from "@ant-design/icons/lib";

interface ModalCreateProps {
  visible: boolean
  onCancel: () => void
  onOk: (field: { name: string }) => void
}

function ModalCreate(props: ModalCreateProps) {
  const {onOk, visible, onCancel} = props
  const [form] = Form.useForm()

  return <Modal
    title={"新建Access Token"}
    visible={visible}
    onOk={() => {
      form.submit()
    }}
    onCancel={onCancel}
  >
    <Form
      form={form}
      onFinish={(fields) => {
        onOk({
          name: fields.name
        })
      }}
    >
      <Form.Item
        label={"名称"}
        name={"name"}
        rules={[
          {required: true, message: '请输入名称'}
        ]}
      >
        <Input/>
      </Form.Item>
    </Form>
  </Modal>
}

interface AccessTokensProps {
  list: AccessTokenItem[]
  pagination: Pagination
  listLoading: boolean
  dispatch: Dispatch
}

function AccessTokens(props: AccessTokensProps) {
  const {pagination, dispatch, listLoading, list} = props
  const [modalCreateVisible, setModalCreateVisible] = useState<boolean>(false)
  const [secretVisibleId, setSecretVisibleId] = useState<string>('')

  const fetchList = (page = 0, pageSize = 10) => {
    dispatch({
      type: 'accessToken/fetchList',
      payload: {
        page: page,
        pageSize: pageSize
      }
    })
  }

  useEffect(() => {
    fetchList(0, 10)
  }, [])

  const handleCreateAccessToken = (fields: { name: string }) => {
    createAccessToken(fields).then(r => {
      if (r.code !== 0) {
        message.error("创建失败:" + r.msg)
        return
      }

      fetchList()
      setModalCreateVisible(false)
      message.success("创建成功")
      return;
    })
  }

  const handleDeleteAccessToken = (appId: string) => {
    deleteAccessToken(appId).then(r => {
      if (r.code !== 0) {
        message.error("删除失败:" + r.msg)
      } else {
        message.success("删除成功")
      }

      fetchList(pagination.current, pagination.pageSize)
      return
    })
  }

  return <PageHeaderWrapper>
    <Card>
      <Row>
        <Col>
          <Button onClick={() => setModalCreateVisible(true)}>
            <FileAddOutlined/>
            新建
          </Button>
        </Col>
      </Row>

      <List
        style={{marginTop: '10px'}}
        loading={listLoading}
        pagination={pagination}
        dataSource={list}
        renderItem={(item) => {
          return <List.Item
            extra={<Popconfirm title={"请谨慎操作，删除后该第三方应用无法通过Open API访问本系统.确认删除?"} onConfirm={() => {
              handleDeleteAccessToken(item.app_id)
            }}>
              <Button danger>删除</Button>
            </Popconfirm>}
          >
            <List.Item.Meta
              title={item.name}
              description={<div>
                <div>App ID: {item.app_id}</div>
                <div>
                  App Secret: {secretVisibleId === item.app_id ? item.app_secret : '*'.repeat(item.app_secret.length)}
                  <Button type={"link"}
                          onClick={() => setSecretVisibleId(secretVisibleId !== item.app_id ? item.app_id : '')}>
                    {secretVisibleId === item.app_id ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                  </Button>
                </div>
              </div>}
            />
          </List.Item>
        }}
      >
      </List>
    </Card>

    <ModalCreate
      visible={modalCreateVisible}
      onCancel={() => setModalCreateVisible(false)}
      onOk={handleCreateAccessToken}/>
  </PageHeaderWrapper>
}

const mapStateToProps = ({accessToken}: ConnectState) => {
  return {
    list: accessToken.list,
    listLoading: accessToken.listLoading,
    pagination: accessToken.pagination
  }
}

export default connect(mapStateToProps)(AccessTokens)

