import React, { Fragment } from 'react';
import { Card, message, Tag, Button, Divider, Modal, Transfer } from 'antd';
import Table from '@/components/Table';
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import PageList from '@/components/PageList';
import { reqList,reqDelete } from './service';
import { ServiceAppNodeTransferList, ServiceAppNodeTransferPut } from '@/services/app';

const urlList = '/resource/app/list';
const urlCreate = '/resource/app/create';
const urlUpdate = '/resource/app/update';

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
      search_port: null,
      keywords_type: 'app_name',
      keywords: null,
    },
    rule: [{ key: 'keywords_type', rule: ['rely', 'keywords'] }],
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

  initTransfer = (aid: number) => {
    ServiceAppNodeTransferList({ aid }).then((res: any) => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }

      let nodeArr: any[] = [];
      let dataSource: { key: any; title: string }[] = [];
      res.data.source_list.forEach((element: any) => {
        dataSource.push({
          key: element.host_name,
          title: `${element.host_name}(${element.ip})`,
        });

        nodeArr[element.host_name] = element.id;
      });

      this.setState({
        dataSource: dataSource,
        targetKeys: res.data.target_list,
        nodeArr: nodeArr,
      });
      return true;
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });

    const { nodeArr, info, targetKeys } = this.state;

    let target: { host_name: any; id: any }[] = [];
    targetKeys.forEach((element: any) => {
      target.push({
        host_name: element,
        id: nodeArr[element],
      });
    });

    console.log('targetMap', target);
    ServiceAppNodeTransferPut({
      target: target,
      aid: info.aid,
    }).then((res: any) => {
      if (res.code !== 0) {
        message.error(res.msg);
      } else {
        message.success(res.msg);
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = (targetKeys: any) => {
    this.setState({ targetKeys });
  };

  render() {
    const { listData, visible, dataSource, targetKeys } = this.state;
    let { keywords_type, keywords, search_port } = this.search.getParam();

    const keywords_type_list = [
      {
        name: '应用名称',
        value: 'app_name',
      },
      {
        name: '应用ID',
        value: 'aid',
      },
    ];
    const columns = [
      {
        title: '应用id',
        dataIndex: 'aid',
        key: 'aid',
      },
      {
        title: '应用名称',
        dataIndex: 'app_name',
        key: 'app_name',
      },
      {
        title: '中文名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '类型',
        dataIndex: 'biz_domain',
        key: 'biz_domain',
      },
      {
        title: '端口',
        key: 'port',
        render: (record) => (
          <span>
            <Tag color="geekblue" key={record.http_port}>
              http:{record.http_port}
            </Tag>
            <Tag color="geekblue" key={record.rpc_port}>
              rpc:{record.rpc_port}
            </Tag>
            <Tag color="geekblue" key={record.govern_port}>
              govern:{record.govern_port}
            </Tag>
          </span>
        ),
      },
      {
        title: '负责人',
        dataIndex: 'users',
        key: 'users',
        render: (users) => (
          <span>
            {users &&
              users.map((user) => {
                return (
                  <Tag color="green" key={user}>
                    {user}
                  </Tag>
                );
              })}
          </span>
        ),
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
                  search: `?aid=${record.aid}`,
                });
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.initTransfer(record.aid);
                this.setState({
                  visible: true,
                  info: record,
                });
              }}
            >
              编辑节点
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                Modal.confirm({
                  title: '确认删除？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {
                    reqDelete({ aid: record.aid }).then((res) => {
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
                selectInput: [
                  {
                    field: 'keywords_type',
                    style: { minWidth: 115 },
                    initialValue: keywords_type,
                    data: keywords_type_list,
                  },
                  {
                    field: 'keywords',
                    placeholder: '请输入关键词',
                    initialValue: keywords,
                  },
                ],
              },
              {
                label: '端口号',
                input: {
                  field: 'search_port',
                  placeholder: '请输入端口号',
                  initialValue: search_port,
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
              新增应用
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
          <Modal
            title={'选择节点'}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={600}
          >
            <Transfer
              dataSource={dataSource}
              showSearch
              listStyle={{
                width: 250,
                height: 300,
              }}
              titles={['未关联', '已关联']}
              targetKeys={targetKeys}
              onChange={this.handleChange}
              render={(item) => `${item.title}`}
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
