import React, { Component, Fragment } from 'react';
import { routerRedux, Link } from 'dva/router';
import { message, Card, Tag, Divider, Modal, Radio, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PageList from '@/components/PageList';
import { reqSelect, reqList } from './service';
import moment from 'moment';
import { history } from '@@/core/history';
import { reqDelete } from '@/pages/resource/app/service';

import * as echarts from 'echarts';

const deppkgUrlList = '/analysis/deppkg';
import Table from '@/components/Table';
import { stringify } from 'qs';
import { ServiceAnalysisTopologyRelationship } from '@/services/analysis';

export default class ServiceDeppkg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region_select: [],
      zone_select: [],
      env_select: [],
      type_select: [],
      app_select: [],
      addr_select: [],
      listData: [],
      records: [],
      view: '',
    };
    this.topology = null;
  }

  search = new PageList({
    router: deppkgUrlList,
    param: {
      region_code: null,
    },
    refresh: (e) => {
      this.initList();
    },
  });

  componentDidMount() {
    this.initList();
  }

  reloadTableList = (node) => {
    const { allTableList } = this.state;
    if (node == undefined) {
      this.setState({
        tableList: allTableList,
      });
    } else {
      let tableList = [];
      allTableList.map(function (item, i) {
        let pushItem = item;
        if (item.source == node || item.target == node) {
          pushItem['key'] = (i + 1).toString();
          tableList.push(pushItem);
        }
      });
      this.setState({
        tableList: tableList,
      });
    }
  };

  initList = () => {
    reqSelect().then((res) => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }
      this.setState({
        region_select: res.data.region_select,
        zone_select: res.data.zone_select,
        env_select: res.data.env_select,
        type_select: res.data.type_select,
        app_select: res.data.app_select,
        addr_select: res.data.addr_select,
      });
      return true;
    });
    reqList(this.search.filter()).then((res) => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }
      console.log('-------> res.data', res.data);
      this.setState({
        records: res.data,
      });
      //this.renderTopology(res.data || []);
      return true;
    });
  };

  render() {
    const { zone_select, env_select, type_select, app_select, addr_select, records } = this.state;

    const operateOpt = [
      { name: '等于', value: '=' },
      { name: '小于', value: '<' },
      { name: '大于', value: '>' },
      { name: '小于等于', value: '<=' },
      { name: '大于等于', value: '>=' },
    ];

    let { operate, app_name } = this.search.getParam();
    const columns = [
      {
        title: '应用名',
        dataIndex: 'appName',
        key: 'appName',
        width: 200,
      },
      {
        title: '包名',
        dataIndex: 'depName',
        key: 'depName',
        width: 200,
      },
      {
        title: '版本',
        dataIndex: 'depVersion',
        key: 'depVersion',
        width: 100,
      },
      {
        title: '分支',
        dataIndex: 'depBranch',
        key: 'depBranch',
        width: 60,
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        key: 'update_time',
        width: 100,
        render: (text, record) => {
          // console.log("record=",record);
          return moment(record.update_time * 1000).format('YYYY年MM月DD日HH:mm');
        },
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card>
          <PageList.Search
            onSubmit={this.search.submit}
            defaultValue={this.search.defaultParam}
            onReset={this.search.reset}
            style={{
              marginTop: 10,
              marginBottom: 10,
            }}
            items={[
              {
                label: '应用',
                select: {
                  field: 'app_name',
                  style: { width: 300 },
                  placeholder: '全部状态',
                  data: app_select,
                  initialValue: app_name,
                },
              },
              {
                label: '包',
                input: {
                  field: 'pkgQs',
                  style: { width: 300 },
                  placeholder: '输入包名称，支持模糊搜索',
                },
              },
              {
                label: '版本比对',
                select: {
                  field: 'operate',
                  style: { width: 100 },
                  placeholder: '全部状态',
                  data: operateOpt,
                  initialValue: operate,
                },
              },
              {
                label: '版本号',
                input: {
                  field: 'ver',
                  style: { width: 200 },
                  placeholder: '输入版本号',
                },
              },
            ]}
          />

          <div style={{ marginTop: '10px' }}>
            <Table
              data={records}
              columns={columns}
              rowKey={(record) => record.appName}
              onChange={({ current }) => {
                this.search.setPage(current).push();
              }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
