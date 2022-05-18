import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, Row, Space, Table, Tag } from 'antd';
import ModalCreateResource from '@/components/ModalCreateResource';
import { FileAddOutlined } from '@ant-design/icons';
import { routerRedux } from 'dva/router';
import ModalEditResource from '@/pages/confgo/resource/components/ModalEditResource';
import moment from 'moment';

function ResourcePage(props) {
  const {
    zoneEnv,
    list,
    loadZoneEnvTree,
    listLoading,
    loadList,
    showModalCreateResource,
    pagination,
  } = props;
  const { page = 0, pageSize = 10, env = null, zone = null, query = '' } = props.location.query;

  useEffect(() => {
    loadZoneEnvTree();

    loadList(0, 10, query);
  }, []);

  const ResourceTableColumns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Env',
      key: 'env',
      dataIndex: 'env',
      filters: Object.keys(zoneEnv).map((env) => {
        return {
          text: env,
          value: env,
        };
      }),
    },
    {
      title: 'Zone',
      key: 'zone_code',
      dataIndex: 'zone_code',
      filters: (function () {
        let zoneMap = {};
        Object.keys(zoneEnv).map((env) => {
          zoneEnv[env].map((zone) => {
            zoneMap[zone.zone_code] = zone;
          });
        });

        return Object.keys(zoneMap).map((zone) => {
          return {
            text: zone,
            value: zone,
          };
        });
      })(),
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (val) => {
        return (
          val &&
          val.map((t) => {
            return <Tag color={'blue'}>{t}</Tag>;
          })
        );
      },
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Latest Version',
      key: 'latest_version',
      dataIndex: 'latest_version',
      render: (val) => {
        return <Tag>{val}</Tag>;
      },
    },
    {
      title: 'Last Update',
      key: 'last_update',
      dataIndex: 'last_update',
      render: (val) => {
        return moment(val).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    loadList(pagination.current - 1, pagination.pageSize, query, filters.env, filters.zone_code);
    props.dispatch(
      routerRedux.push({
        query: {
          ...props.location.query,
          ...filters,
          page: pagination.page,
          pageSize: pagination.pageSize,
        },
      }),
    );
  };

  const onSearch = (value) => {
    props.dispatch(
      routerRedux.push({
        query: {
          ...props.location.query,
          query: value,
        },
      }),
    );

    loadList(page, pageSize, value, env, zone);
  };

  return (
    <PageHeaderWrapper>
      <Card>
        <Space direction={'vertical'} style={{ width: '100%' }}>
          <Row justify={'space-between'}>
            <Col>
              <Button onClick={() => showModalCreateResource(true)}>
                <FileAddOutlined />
                新建
              </Button>
            </Col>

            <Col>
              <Input.Search defaultValue={query} onSearch={onSearch} placeholder={'搜索资源名称'} />
            </Col>
          </Row>

          <Table
            loading={listLoading}
            rowKey={'id'}
            columns={[
              ...ResourceTableColumns,
              {
                title: '操作',
                render: (row) => {
                  return (
                    <Button.Group>
                      <Button
                        onClick={() => {
                          console.log(row);
                          props.showModalEdit({
                            visible: true,
                            ...row,
                          });
                        }}
                      >
                        更新
                      </Button>
                    </Button.Group>
                  );
                },
              },
            ]}
            dataSource={list}
            pagination={{
              ...pagination,
              current: pagination.current + 1,
            }}
            onChange={handleTableChange}
          />
        </Space>
      </Card>

      <ModalCreateResource onOk={() => loadList()} />

      <ModalEditResource onOk={() => loadList()} />
    </PageHeaderWrapper>
  );
}

const mapStateToProps = ({ configResource }) => {
  return {
    zoneEnv: configResource.zoneEnv,
    list: configResource.list,
    listLoading: configResource.listLoading,
    pagination: configResource.pagination,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadZoneEnvTree: () =>
      dispatch({
        type: 'configResource/loadZoneEnvTree',
      }),
    loadList: (page, pageSize, query, env, zone) =>
      dispatch({
        type: 'configResource/loadList',
        payload: { page, pageSize, query, env, zone },
      }),
    showModalCreateResource: (visible) =>
      dispatch({
        type: 'configResource/showModalCreateResource',
        payload: visible,
      }),
    showModalEdit: (payload) =>
      dispatch({
        type: 'configResource/showModalEdit',
        payload,
      }),
    dispatch: dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResourcePage);
