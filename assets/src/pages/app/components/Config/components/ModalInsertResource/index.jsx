import React, {useEffect, useState} from "react";
import {connect} from "dva";
import {Col, Form, Input, Modal, Row, Select, Space, Table} from "antd";

function ModalInsertResource(props) {
  const {visible, dispatch, env, zone, resource, tags, resourcePagination, onOk} = props
  const [form] = Form.useForm()
  const [tag, setTag] = useState()
  const [query, setQuery] = useState()

  const loadResource = (tag = '', query = '', page = 0) => {
    dispatch({
      type: 'configResource/loadList',
      payload: {
        page,
        pageSize: 10,
        env,
        zone,
        query,
        tag,
      }
    })
  }

  const loadTags = () => {
    dispatch({
      type: 'configResource/loadTags'
    })
  }

  useEffect(() => {
    if (!visible) {
      return
    }

    loadResource(tag, query)
    loadTags()
  }, [visible, tag, query])

  return <Modal
    width={800} visible={visible} title={"插入资源"} onOk={() => form.submit()}
    onCancel={() => {
      props.dispatch({
        type: 'config/showModalInsertResource',
        payload: false
      })
    }}
  >
    <Form form={form} onFinish={(fields) => {
      props.dispatch({
        type: 'config/showModalInsertResource',
        payload: false
      })
      if (onOk) onOk(fields)
    }}>
      <Row style={{marginBottom: '10px'}} justify={"space-between"}>
        <Col>
          <Space>
            <span>标签:</span>

            <Select
              style={{width: '200px'}}
              onChange={(val) => {
                setTag(val)
              }}
            >
              {tags && tags.map(item => {
                return <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              })}
            </Select>
          </Space>
        </Col>

        <Col>
          <Input.Search
            onSearch={(val) => {
              setQuery(val)
            }}
          />
        </Col>

      </Row>

      <Form.Item
        name={"resource"}
        rules={[
          {required:true, message: '请选择资源'}
        ]}
      >
        <Table
          onChange={(pagination) => {
            loadResource(tag, query, pagination.current - 1)
          }}
          pagination={{
            current: resourcePagination.page,
            total: resourcePagination.total,
            pageSize: resourcePagination.pageSize,
          }}
          rowSelection={{
            type: 'radio',
            onChange: (key) => {
              if (!key.length) return
              form.setFieldsValue({
                resource: key[0]
              })
            }
          }}
          dataSource={resource}
          rowKey={"id"}
          columns={[
            {title: 'Name', key: 'name', dataIndex: 'name'},
            {title: 'Value', key: 'value', dataIndex: 'value'},
            {title: 'Version', key: 'latest_version', dataIndex: 'latest_version'},
            {title: 'Last Update', key: 'last_update', dataIndex: 'last_update'},
          ]}
        >
        </Table>

      </Form.Item>
    </Form>
  </Modal>
}

const mapStateToProps = ({config, configResource}) => {
  return {
    visible: config.visibleModalInsertResource,
    env: config.env,
    zone: config.currentConfig && config.currentConfig.zone,
    resource: configResource.list,
    resourcePagination: configResource.pagination,
    tags: configResource.tags,
  }
}

export default connect(
  mapStateToProps
)(ModalInsertResource)
