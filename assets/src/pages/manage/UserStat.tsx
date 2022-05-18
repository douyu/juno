import React from 'react';
import {
  Card,
  Form,
  Input,
  List,
  message,
  Popconfirm,
  Radio,
  Tabs,
  Tag,
  DatePicker,
  Button,
  Table,
  Row,
} from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

import moment from 'moment';
import { GetAppVisit } from '@/services/user';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default class UserStat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInfo: {
        startTime: 0,
        endTime: 0,
      },
      user_visit: [],
      page_visit: [],
      app_visit: [],
      app_list: [],
      app_sum: 0,
      app_conf: 0,
    };
  }

  componentDidMount() {
    let { searchInfo } = this.state;
    searchInfo.startTime = moment().startOf('week').unix();
    searchInfo.endTime = moment().endOf('week').unix();
    this.setState(
      {
        searchInfo: searchInfo,
      },
      () => {
        this.onSearch();
      },
    );
  }

  componentWillMount() {}

  onTime = (value) => {
    let { searchInfo = {} } = this.state;
    if (value && Array.isArray(value) && value.length === 2) {
      searchInfo.startTime = Date.parse(value[0]) / 1000;
      searchInfo.endTime = Date.parse(value[1]) / 1000;
    }
    this.setState({
      searchInfo: searchInfo,
    });
  };

  onSearch = () => {
    const { searchInfo } = this.state;
    GetAppVisit(searchInfo).then((res: any) => {
      if (res.code == 0) {
        this.setState({
          user_visit: res.data.user_visit,
          page_visit: res.data.page_visit,
          app_visit: res.data.app_visit,
          app_list: res.data.app_list,
          app_sum: res.data.app_sum,
          app_conf: res.data.app_conf,
        });
      } else {
        message.error(res.msg);
      }
    });
  };

  render() {
    const {
      tab,
      searchInfo,
      user_visit = [],
      app_visit = [],
      page_visit = [],
      app_list = [],
      app_sum = 0,
      app_conf = 0,
    } = this.state;
    const columnsUser = [
      {
        title: 'Uid',
        dataIndex: 'uid',
        key: 'uid',
      },
      {
        title: '用户名',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '访问应用数量',
        dataIndex: 'app_sum',
        key: 'app_sum',
      },
      {
        title: '访问总数量',
        dataIndex: 'visit_sum',
        key: 'visit_sum',
      },
    ];

    const columnsApp = [
      {
        title: 'Aid',
        dataIndex: 'aid',
        key: 'aid',
      },
      {
        title: '应用名',
        dataIndex: 'app_name',
        key: 'app_name',
      },
      {
        title: '访问总数量',
        dataIndex: 'visit_sum',
        key: 'visit_sum',
      },
    ];

    const columnsTab = [
      {
        title: 'Tab',
        dataIndex: 'tab',
        key: 'tab',
      },
      {
        title: 'Tab名',
        dataIndex: 'tab_name',
        key: 'tab_name',
      },
      {
        title: '访问总数量',
        dataIndex: 'visit_sum',
        key: 'visit_sum',
      },
    ];

    const columnsAppList = [
      {
        title: 'Aid',
        dataIndex: 'aid',
        key: 'aid',
      },
      {
        title: '应用名',
        dataIndex: 'app_name',
        key: 'app_name',
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
    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <Row style={{ marginBottom: '16px' }}>
            <RangePicker
              //showTime
              //value={searchInfo.endTime ? moment(DateUtil.format(searchInfo.endTime), 'YYYY-MM-DD HH:mm:ss') : 0}
              value={[moment(searchInfo.startTime * 1000), moment(searchInfo.endTime * 1000)]}
              format="YYYY-MM-DD HH:mm:ss"
              // placeholder="请选择时间范围"
              ranges={{
                今天: [moment(), moment()],
                本周: [moment().startOf('week'), moment().endOf('week')],
                本月: [moment().startOf('month'), moment().endOf('month')],
              }}
              onChange={(v) => {
                this.onTime(v);
              }}
            />

            <Button type="primary" onClick={this.onSearch} style={{ marginLeft: '16px' }}>
              查询
            </Button>
          </Row>
          <Tabs
            defaultActiveKey={this.state.tab}
            activeKey={tab}
            // onChange={this.onChangeTab}
            style={{ width: '100%', marginTop: '16px' }}
            tabBarStyle={{ paddingLeft: '10px', marginBottom: 0 }}
            destroyInactiveTabPane
          >
            <TabPane
              tab="平台活跃用户"
              key="user"
              style={{ marginTop: '16px', marginBottom: '16px' }}
            >
              <Table
                bordered
                className="row-font"
                columns={columnsUser}
                rowKey={(record) => {
                  return record.uid;
                }}
                dataSource={user_visit}
                pagination={false}
              />
            </TabPane>
            <TabPane
              tab="平台活跃应用"
              key="app"
              style={{ marginTop: '16px', marginBottom: '16px' }}
            >
              <Table
                bordered
                className="row-font"
                columns={columnsApp}
                rowKey={(record) => {
                  return record.aid;
                }}
                dataSource={app_visit}
                pagination={false}
              />
            </TabPane>

            <TabPane
              tab="平台活跃Tab"
              key="tab"
              style={{ marginTop: '16px', marginBottom: '16px' }}
            >
              <Table
                bordered
                className="row-font"
                columns={columnsTab}
                rowKey={(record) => {
                  return record.tab;
                }}
                dataSource={page_visit}
                pagination={false}
              />
            </TabPane>

            <TabPane
              tab="配置中心统计"
              key="conf"
              style={{ marginTop: '16px', marginBottom: '16px' }}
            >
              <Card style={{ marginBottom: '16px', marginTop: '16px' }}>
                <h3>应用数量: {app_sum}</h3>
                <h3>配置中心接入应用数量: {app_conf}</h3>
              </Card>
              <h3 style={{ fontStyle: 'bold' }}>
                {' '}
                <strong>配置中心未接入应用列表</strong>
              </h3>
              <Table
                bordered
                className="row-font"
                columns={columnsAppList}
                rowKey={(record) => {
                  return record.aid;
                }}
                dataSource={app_list}
                pagination={false}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
