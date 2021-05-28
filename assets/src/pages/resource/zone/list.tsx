import React, { Fragment } from 'react';
import { Card, message, Button, Divider, Modal, Transfer } from 'antd';
import { reqDelete, reqList } from './service';
import Table from '@/components/Table';
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import PageList from '@/components/PageList';
import { ServiceTransferList, ServiceTransferPut } from '@/services/node';

export interface HomeProps {}

const urlList = '/resource/zone/list';
const urlUpdate = '/resource/zone/update';

export default class Base extends React.Component<HomeProps, any> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      listData: [],
      visible: false, //弹窗
      dataSource: [],
      targetKeys: [],
      nodeArr: [],
      zoneInfo: {},
    };
  }

  componentWillMount() {
    this.initList();
  }

  componentDidMount(): void {}

  componentWillReceiveProps(nextProps: any, nextContext: any) {}

  search = new PageList({
    router: urlList,
    rows: 10,
    param: {
      search_port: null,
      keywords_type: 'zone_name',
      keywords: null,
    },
    rule: [{ key: 'keywords_type', rule: ['rely', 'keywords'] }],
    refresh: (e: any) => {
      this.initList();
    },
  });

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

  initTransfer = (zone_code: string, env: string) => {
    ServiceTransferList({ zone_code, env }).then((res: any) => {
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

    const { nodeArr, zoneInfo, targetKeys } = this.state;

    let target: { host_name: any; id: any }[] = [];
    targetKeys.forEach((element: any) => {
      target.push({
        host_name: element,
        id: nodeArr[element],
      });
    });

    ServiceTransferPut({
      target: target,
      zone_id: zoneInfo.id,
    }).then((res: any) => {
      if (res.code !== 0) {
        message.error(res.msg);
      } else {
        message.success(res.msg);
        this.initList();
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
    const { listData, visible, targetKeys, dataSource } = this.state;

    let { keywords_type, keywords } = this.search.getParam();

    const keywords_type_list = [
      {
        name: '可用区名称',
        value: 'zone_name',
      },
      {
        name: '可用区码',
        value: 'zone_code',
      },
      {
        name: '可用区ID',
        value: 'id',
      },
    ];
    const columns = [
      {
        title: '可用区id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '可用区',
        key: 'zone_code',
        render: (record) => (
          <span>
            {record.zone_code}({record.zone_name})
          </span>
        ),
      },
      {
        title: '地区',
        key: 'region_code',
        render: (record) => (
          <span>
            {record.region_code}({record.region_name})
          </span>
        ),
      },
      {
        title: '环境',
        key: 'env',
        dataIndex: 'env',
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
                this.initTransfer(record.zone_code, record.env);
                this.setState({
                  visible: true,
                  zoneInfo: record,
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
            ]}
          />
          <div>
            <Button
              type="primary"
              style={{
                marginTop: 10,
                marginBottom: 10,
              }}
              onClick={() => {
                history.push('/resource/zone/create');
              }}
            >
              新增机房
            </Button>
          </div>
          <Table
            data={listData}
            columns={columns}
            rowKey={(record) => record.id}
            onChange={({ current }) => {
              this.search.setPage(current).push();
            }}
          />
          <Modal
            title={'选择节点'}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={800}
          >
            <Transfer
              dataSource={dataSource}
              showSearch
              listStyle={{
                width: 350,
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
