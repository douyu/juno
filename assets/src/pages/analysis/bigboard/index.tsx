import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Alert, Button, Card, Col, message, Modal, Popconfirm, Row, Select, Table } from 'antd';
import { ServiceStatistics, ServiceNodeStatistics, ServiceCmcStatistics } from '@/services/event';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default class BigBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      btnList: [],
      stat: {},
      node_stat: {},
      cmc_stat: {},
    };
  }

  componentDidMount() {
    this.GetStatistics();
    this.GetNodeStatistics();
    this.GetCmcStatistics();
  }

  GetStatistics = () => {
    ServiceStatistics().then((res: any) => {
      if (res.code !== 0) {
        message.error(res.msg);
      } else {
        this.setState({
          stat: res.data,
        });
      }
    });
  };

  GetNodeStatistics = () => {
    ServiceNodeStatistics().then((res: any) => {
      if (res.code !== 0) {
        message.error(res.msg);
      } else {
        this.setState({
          node_stat: res.data,
        });
      }
    });
  };

  GetCmcStatistics = () => {
    ServiceCmcStatistics().then((res: any) => {
      if (res.code !== 0) {
        message.error(res.msg);
      } else {
        this.setState({
          cmc_stat: res.data,
        });
      }
    });
  };

  getOption = (stat_info) => {
    if (!stat_info || stat_info.length === 0) {
      return {
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [],
            type: 'line',
          },
        ],
      };
    }
    //const { node_stat } = this.state;
    //const { node_status = [], node_app = [],day_cnt=[] } = node_stat;
    let option = {
      xAxis: {
        type: 'category',
        data: stat_info.map((item) => {
          return item.name;
        }),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: stat_info,
          type: 'line',
        },
      ],
    };
    return option;
  };

  getOptionZhu = (stat_info) => {
    if (!stat_info || stat_info.length === 0) {
      return {
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [],
            type: 'line',
          },
        ],
      };
    }
    //const { node_stat } = this.state;
    //const { node_status = [], node_app = [], day_cnt = [] } = node_stat;
    let option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: stat_info.map((item) => {
            return item.name;
          }),
          //data: ['5月18', '5月19', '5月20', '5月21', '5月22', '5月23', '5月24'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          //name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: stat_info,
        },
      ],
    };
    return option;
  };

  getOptionBin = (stat_info) => {
    if (!stat_info || stat_info.length === 0) {
      return {
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [],
            type: 'line',
          },
        ],
      };
    }
    //const { node_stat } = this.state;
    //const { node_status = [], node_app = [] } = node_stat;
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: stat_info.map((item) => {
          return item.name;
        }),
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: stat_info,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    return option;
  };

  render() {
    const { pprofActiveBtn, zoneCode, appName, env, stat, node_stat, cmc_stat } = this.state;
    const { app_cnt, node_cnt, region_cnt, zone_cnt } = stat;
    const { node_status = [], node_app = [], day_cnt = [], env_zone = [] } = node_stat;
    const { total = 0, env_cnt = [], cmc_cnt = [] } = cmc_stat;

    return (
      <PageHeaderWrapper>
        <div>
          <Row gutter={4} style={{ marginTop: '10px' }}>
            <Col span={6}>
              <Card title={'应用总数'}>{app_cnt}</Card>
            </Col>
            <Col span={6}>
              <Card title={'节点总数'}>{node_cnt}</Card>
            </Col>
            <Col span={6}>
              <Card title={'可用区总数'}>{zone_cnt}</Card>
            </Col>
            <Col span={6}>
              <Card title={'配置文件总数'}>{total}</Card>
            </Col>
          </Row>
          <Row gutter={4} style={{ marginTop: '4px' }}>
            <Col span={12}>
              <Card title={'节点基本情况统计'}>
                <ReactEcharts
                  option={this.getOptionBin(node_status)}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={'light'}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title={'节点新增趋势图'}>
                <ReactEcharts
                  option={this.getOption(day_cnt)}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={'light'}
                  //onChartReady={this.onChartReadyCallback}
                  //onEvents={EventsDict}
                  // opts={}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={4} style={{ marginTop: '4px' }}>
            <Col span={12}>
              <Card title={'节点与应用关联情况'}>
                <ReactEcharts
                  option={this.getOptionZhu(node_app)}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={'light'}
                  //onChartReady={this.onChartReadyCallback}
                  //onEvents={EventsDict}
                  // opts={}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title={'环境对应可用区'}>
                <ReactEcharts
                  option={this.getOptionZhu(env_zone)}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={'light'}
                  //onChartReady={this.onChartReadyCallback}
                  //onEvents={EventsDict}
                  // opts={}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={4} style={{ marginTop: '4px' }}>
            <Col span={12}>
              <Card title={'配置文件环境分布'}>
                <ReactEcharts
                  option={this.getOptionBin(env_cnt)}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={'light'}
                  //onChartReady={this.onChartReadyCallback}
                  //onEvents={EventsDict}
                  // opts={}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title={'配置文件提交趋势'}>
                <ReactEcharts
                  option={this.getOption(cmc_cnt)}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={'light'}
                  //onChartReady={this.onChartReadyCallback}
                  //onEvents={EventsDict}
                  // opts={}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}
