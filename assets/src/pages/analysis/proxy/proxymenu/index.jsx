import React, { useEffect } from "react";
import { connect } from "dva";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Button, Card, Col, Input, Row, Space, Table, Tag } from "antd";
import ModalCreate from "./components/ModalCreate";
import { FileAddOutlined } from "@ant-design/icons";
import { routerRedux } from 'dva/router'
import ModalEdit from "./components/ModalEdit";
import moment from "moment";

function Page(props) {
  const { list, listLoading, loadList, showModalCreate, pagination } = props
  const { current = 0, pageSize = 10, query } = props.location.query
  useEffect(() => {
    loadList({ current, pageSize, query })
  }, [])

  const TableColumns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: '名称',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: '类型',
      key: 'panel_type',
      dataIndex: 'panel_type',
    },
    {
      title: '标识key',
      key: 'key',
      dataIndex: 'key',
    },
    {
      title: '更新时间',
      key: 'last_update',
      dataIndex: 'last_update',
      render: (val) => {
        return moment(val).format("YYYY-MM-DD HH:mm:ss")
      }
    }
  ]

  const handleTableChange = (pagination, filters, sorter) => {
    loadList(pagination.current - 1, pagination.pageSize, query, filters.env, filters.zone_code)
    props.dispatch(routerRedux.push({
      query: {
        ...props.location.query,
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      }
    }))
  }

  const onSearch = (value) => {
    props.dispatch(routerRedux.push({
      query: {
        ...props.location.query,
        query: value
      }
    }))
    loadList({ ...props.location.query, query: value, })
  }
  return <>
    <Card>
      <Space direction={"vertical"} style={{ width: '100%' }}>
        <Row justify={"space-between"}>
          <Col>
            <Button onClick={() => showModalCreate(true)}>
              <FileAddOutlined />
              新建
            </Button>

          </Col>

          <Col>
            <Input.Search defaultValue={query} onSearch={onSearch} placeholder={"搜索名称"} />
          </Col>

        </Row>

        <Table
          loading={listLoading}
          rowKey={"id"}
          columns={
            [
              ...TableColumns,
              {
                title: '操作',
                render: (row) => {
                  return <Button.Group>
                    <Button onClick={() => {
                      props.showModalEdit({
                        visible: true,
                        ...row
                      })
                    }}>更新</Button>
                  </Button.Group>
                }
              }
            ]}
          dataSource={list}
          pagination={{
            ...pagination,
            current: pagination.current + 1
          }}
          onChange={handleTableChange}
        />
      </Space>
    </Card>
    <ModalCreate onOk={() => loadList()} />
    <ModalEdit onOk={() => loadList()} />
  </>;
}

const mapStateToProps = ({ proxymenu, loading }) => {
  return {
    list: proxymenu.list,
    listLoading: loading.models.proxymenu,
    pagination: proxymenu.pagination,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadList: (params) => dispatch({
      type: 'proxymenu/loadList',
      payload: { ...params }
    }),
    showModalCreate: (visible) => dispatch({
      type: 'proxymenu/showModalCreate',
      payload: visible
    }),
    showModalEdit: (payload) => dispatch({
      type: 'proxymenu/showModalEdit',
      payload,
    }),
    dispatch: dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page)
