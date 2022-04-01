import React from 'react';
import { Card, Row, Col, Statistic, message, Timeline, Tag, Button } from 'antd';
import { getAppList } from './service';
import Table from '@/components/Table';
import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import PageList from '@/components/PageList';

export interface HomeProps {}

const urlList = '/resource/appnode/list';

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
      keywords_type: 'null',
      keywords: null,
    },
    // rule: [{ key: 'keywords_type', rule: ['rely', 'keywords'] }],
    refresh: (e: any) => {
      this.initList();
    },
  });

  initList = (): void => {
    getAppList(this.search.filter()).then((res) => {
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
    //console.log("listData",listData);
    const columns = [
      {
        title: '应用id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '应用名称',
        dataIndex: 'app_name',
        key: 'app_name',
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
        title: '更新时间',
        dataIndex: 'update_time',
        key: 'update_time',
        render: (update_time) => moment(update_time, 'X').format('YYYY-MM-DD HH:mm:ss'),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card>
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
