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

const urlList = '/analysis/topology';
import Table from '@/components/Table';
import { render_options, render_options_of_node } from './options';
import { stringify } from 'qs';
import { ServiceAnalysisTopologyRelationship } from '@/services/analysis';

export default class ServiceTopology extends Component {
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
      view: '',
      showChart: 'none',
      showTable: 'block',
    };
    this.topology = null;
  }

  search = new PageList({
    router: urlList,
    param: {
      region_code: null,
      show_type: 'chart',
    },
    refresh: (e) => {
      this.initList();
    },
  });

  componentDidMount() {
    this.initList();

    this.topology = echarts.init(document.getElementById('t-graph'));
    this.topology.on('click', (params) => {
      // listen clicking node
      const { relations = [] } = this.props;
      if (params.dataType == 'node') {
        // clicked a node, focus shit node
        this.setState({ select_node: params.data.id });
        this.topology.dispatchAction({
          type: 'focusNodeAdjacency',
          // 定位 series
          seriesId: params.seriesId,
          seriesIndex: params.seriesIndex,
          seriesName: params.seriesName,
          // use dataIndex to pin node
          dataIndex: params.dataIndex,
        });
      }
    });
    this.issueDispatch(this.queryObj);
  }

  issueDispatch = (payload) => {
    this.topology.showLoading();
    this.queryObj = Object.assign({}, this.queryObj, payload);
    let { zone_code, env, type, show_type, app_name, addr } = this.search.getParam();

    ServiceAnalysisTopologyRelationship({ zone_code, env, type, show_type, app_name, addr }).then(
      (res) => {
        this.topology.hideLoading();
        if (res.code != 0) {
          message.error(res.msg);
          return
        }
        this.renderTopology(res.data || []);

        let tableList = [];
        res.data.map(function (item, i) {
          let pushItem = item;
          pushItem['key'] = (i + 1).toString();

          tableList.push(pushItem);
        });

        this.setState({
          tableList: tableList,
          allTableList: tableList,
        });

        if (payload != undefined && payload.node != undefined) {
          this.reloadTableList(payload.node);
        }
      },
    );
  };

  renderTopology = (data, clicked_node = null) => {
    if (this.queryObj.node) {
      this.topology.setOption(render_options_of_node(data, this.queryObj.node));
      return;
    }
    this.topology.setOption(render_options(data, clicked_node));
  };

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
      console.log("-------> res.data",res.data);
      this.setState({
        listData: res.data,
      });
      //this.renderTopology(res.data || []);
      return true;
    });
  };

  onChangeView = (e) => {
    if (e.target.value == 'chart') {
      this.setState({
        showChart: 'block',
        showTable: 'none',
      });
    } else {
      this.setState({
        showChart: 'none',
        showTable: 'block',
      });
    }
  };

  unSelectNode = (node) => {
    this.setState({ select_node: null });
    this.topology.dispatchAction({
      type: 'unfocusNodeAdjacency',
    });
    // this.renderTopology(relations)
  };

  onSubmit=(value)=>{
    console.log("######### onSubmit",value);
    this.search.submit(value);
    console.log("######### this.queryObj",this.queryObj);
    this.issueDispatch(value);
  };

  onReset=(value)=>{
    console.log("######### onReset",value);
    this.search.reset(value);
    console.log("######### this.queryObj",this.queryObj);
    this.issueDispatch({});
  };


  render() {
    const {
      zone_select,
      env_select,
      type_select,
      app_select,
      addr_select,
      listData,
      showTable,
      showChart,
      select_node,
    } = this.state;
    console.log('showChart', showChart);
    console.log('showTable', showTable);
    let { zone_code, env, type, show_type, app_name, addr } = this.search.getParam();
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
        title: '依赖类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '依赖名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '可用区',
        dataIndex: 'zone_code',
        key: 'zone_code',
      },
      {
        title: '环境',
        dataIndex: 'env',
        key: 'env',
      },
      {
        title: '文件名',
        dataIndex: 'file_name',
        key: 'file_name',
      },
      {
        title: '地址',
        dataIndex: 'addr',
        key: 'addr',
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        key: 'update_time',
        render: (text) => {
          if (typeof text === 'number') {
              return moment(text * 1000).format('YYYY-MM-DD HH:mm:ss');
          }
          return text;
      },
      }
    ];
    return (
      <PageHeaderWrapper>
        <Card>
          <PageList.Search
            onSubmit={this.onSubmit}
            defaultValue={this.search.defaultParam}
            onReset={this.onReset}
            style={{
              marginTop: 10,
              marginBottom: 10,
            }}
            items={[
              {
                label: '应用',
                select: {
                  field: 'app_name',
                  style: { width: 400 },
                  placeholder: '全部状态',
                  data: app_select,
                  initialValue: app_name,
                },
              },
              {
                label: '可用区',
                select: {
                  field: 'zone_code',
                  style: { width: 300 },
                  placeholder: '全部状态',
                  data: zone_select,
                  initialValue: zone_code,
                },
              },
              {
                label: '环境',
                select: {
                  field: 'env',
                  style: { width: 200 },
                  placeholder: '全部状态',
                  data: env_select,
                  initialValue: env,
                },
              },
              {
                label: '依赖类型',
                select: {
                  field: 'type',
                  style: { width: 200 },
                  placeholder: '全部状态',
                  data: type_select,
                  initialValue: type,
                },
              },
              {
                label: '依赖项',
                select: {
                  field: 'addr',
                  style: { width: 400 },
                  placeholder: '全部状态',
                  data: addr_select,
                  initialValue: addr,
                },
              },
            ]}
          />
          <Radio.Group defaultValue="table" buttonStyle="solid" onChange={this.onChangeView}>
            <Radio.Button value="table">列表</Radio.Button>
            <Radio.Button value="chart">图表</Radio.Button>
          </Radio.Group>

          <div style={{ display: showTable, marginTop: '10px' }}>
            <Table
              data={listData}
              columns={columns}
              rowKey={(record) => record.app_name}
              onChange={({ current }) => {
                this.search.setPage(current).push();
              }}
            />
          </div>
          <div
            id="t-graph"
            style={{
              width: 'calc(80.5vw)',
              height: '600px',
              position: 'relative',
              display: showChart,
              marginTop: '10px',
            }}
          >
            {select_node && (
              <span style={{ position: 'absolute', left: 5, top: 5 }} onClick={this.unSelectNode}>
                <Tag color="black" visible={select_node}>
                  {select_node} x
                </Tag>
              </span>
            )}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
