import React, { Fragment } from 'react';
import { Card, message, Tag, Button, Divider, Modal, Transfer } from 'antd';
import Table from '@/components/Table';
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import PageList from '@/components/PageList';
import { reqList,reqDelete } from './service';

const urlList = '/confgo/tpl/list';
const urlCreate = '/confgo/tpl/create';
const urlUpdate = '/confgo/tpl/update';

export interface HomeProps {}
export default class Base extends React.Component<HomeProps, any> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      listData: [],
      visible: false, //弹窗
      dataSource: [],
      targetKeys: [],
      nodeArr: [],
      info: {},
    };
  }

  search = new PageList({
    router: urlList,
    rows: 10,
    param: {
      tpl_type: null,
    },
    refresh: (e: any) => {
      this.initList();
    },
  });

  componentWillMount() {}

  componentDidMount(): void {
    this.initList();
  }

  componentWillReceiveProps(nextProps: any, nextContext: any) {}

  initList = (): void => {
    reqList(this.search.filter()).then((res) => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }
      this.setState({
        listData: res.data,
      });
      return true;
    });
  };

  render() {
    const { listData } = this.state;
    let {  tpl_type } = this.search.getParam();

    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '模板类型',
        dataIndex: 'tpl_type',
        key: 'tpl_type',
      },
      {
        title: '模板内容',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (create_time) => moment(create_time, 'X').format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        key: 'update_time',
        render: (update_time) => moment(update_time, 'X').format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        dataIndex: 'operating',
        key: 'operating',
        render: (value, record) => (
          <Fragment>
            <a
              onClick={() => {
                history.push({
                  pathname: urlUpdate,
                  search: `?id=${record.id}`,
                });
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                Modal.confirm({
                  title: '确认删除？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {
                    reqDelete({ id: record.id }).then((res) => {
                      if (res.code !== 0) {
                        message.error(res.msg);
                        return false;
                      }

                      this.initList();
                      return true;
                    });
                  },
                });
              }}
            >
              删除
            </a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card>
          <PageList.Search
            onSubmit={this.search.submit}
            defaultValue={this.search.defaultParam}
            onReset={this.search.reset}
            items={[
              {
                label: '模板类型',
                input: {
                  field: 'tpl_type',
                  placeholder: '请输入模板类型',
                  initialValue: tpl_type,
                },
              },
            ]}
          />
          <div>
            <Button
              type="primary"
              onClick={() => {
                history.push(urlCreate);
              }}
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              新增模板
            </Button>
          </div>
          <Table
            data={listData}
            columns={columns}
            rowKey={(record) => record.app_name}
            onChange={({ current }) => {
              this.search.setPage(current).push();
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
