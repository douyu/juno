import React, {Fragment} from 'react';
import {Card, Row, Col, Statistic, message, Timeline, Tag, Button, Divider, Modal} from 'antd';
import { reqList,reqDelete } from './service';
import Table from '@/components/Table';
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import PageList from "@/components/PageList";

export interface HomeProps {}

const urlList = "/resource/node/list";
const urlUpdate = "/resource/zone/update";

export default class Base extends React.Component<HomeProps, any> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      listData: [],
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
      keywords_type: "host_name",
      keywords: null
    },
    rule: [{ key: "keywords_type", rule: ["rely", "keywords"] }],
    refresh: (e) => {
      this.initList(e);
    }
  });


  initList = (): void => {
    reqList(this.search.filter()).then((res) => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }
      if (res.data == '') {
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
    let { keywords_type, keywords } = this.search.getParam();
    const keywords_type_list = [
      {
        name: "机器名称",
        value: "host_name"
      },
      {
        name: "机器IP",
        value: "ip"
      }
    ];
    const columns = [
      {
        title: '节点id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '节点名称',
        dataIndex: 'host_name',
        key: 'host_name',
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
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
        title: '可用区',
        key: 'zone_code',
        render: (record) => (
          <span>
            {record.zone_code}({record.zone_name})
          </span>
        ),
      },
      {
        title: '环境',
        key: 'env',
        dataIndex: 'env',
      },
      {
        title: 'Agent情况',
        key: 'agent_type',
        render: (record) => {
          if (record.agent_type === 0) {
            return (
              <span>
                <Tag color="red">未部署agent</Tag>
              </span>
            );
          }
          if (record.agent_type === 1) {
            return (
              <span>
                <Tag color="green">已部署agent</Tag>
              </span>
            );
          }
        },
      },
      {
        title: 'agent心跳时间',
        dataIndex: 'agent_heartbeat_time',
        key: 'agent_heartbeat_time',
        render: (agent_heartbeat_time) => {
          var timestamp = Date.parse(new Date())/1000;
          if (agent_heartbeat_time === 0) {
            return (
              <span>
                <Tag color="red">未上报心跳</Tag>
              </span>
            );
          } else if (timestamp - agent_heartbeat_time > 120) {
            return (
              <span>
                <Tag color="red">心跳超时</Tag>({moment(agent_heartbeat_time, 'X').format('YYYY-MM-DD HH:mm:ss')})
              </span>
            );
          }else if  (timestamp - agent_heartbeat_time < 120)  {
            return (
              <span>
                <Tag color="green">心跳正常</Tag>({moment(agent_heartbeat_time, 'X').format('YYYY-MM-DD HH:mm:ss')})
              </span>
            );

          }
        },
      },
      {
        title: 'Proxy情况',
        key: 'proxy_type',
        render: (record) => {
          if (record.proxy_type === 1) {
            return (
              <span>
                <Tag color="green">已部署proxy</Tag>
              </span>
            );
          }
        },
      },
      {
        title: 'proxy心跳时间',
        key: 'proxy_heartbeat_time',
        render: (record) => {
          var timestamp = Date.parse(new Date())/1000;
          if (record.proxy_type === 1 && record.proxy_heartbeat_time === 0) {
            return (
              <span>
                <Tag color="red">未上报心跳</Tag>
              </span>
            );
          } else if (record.proxy_type === 1 && (timestamp - record.proxy_heartbeat_time > 120)) {
            return (
              <span>
                <Tag color="red">心跳超时</Tag>({moment(record.proxy_heartbeat_time, 'X').format('YYYY-MM-DD HH:mm:ss')})
              </span>
            );
          }else if  (record.proxy_type === 1 && (timestamp - record.proxy_heartbeat_time < 120)) {
            return (
              <span>
                <Tag color="green">心跳正常</Tag>({moment(record.proxy_heartbeat_time, 'X').format('YYYY-MM-DD HH:mm:ss')})
              </span>
            );
          }
        },
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
                    field: "keywords_type",
                    style: { minWidth: 115 },
                    initialValue: keywords_type,
                    data: keywords_type_list
                  },
                  {
                    field: "keywords",
                    placeholder: "请输入关键词",
                    initialValue: keywords
                  }
                ]
              }
            ]} />
          <div>
            <Button
              type="primary"
              style={{
                marginTop:10,
                marginBottom:10
              }}
              onClick={() => {
                history.push('/resource/node/create');
              }}
            >
              新增节点
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}
