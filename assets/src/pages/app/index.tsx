import React, { PureComponent } from 'react';
import Confgo from '../confgo/config/confgo';
import PPofList from '../pprof/pprof';
import Monitor from '../monitor/monitor';
import { connect } from 'dva';
import { Card, Row, Col, message, Alert, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AppHeader from './components/AppHeader/index';
import { routerRedux } from 'dva/router';
import { ServiceAppList, ServiceGetAppList } from '@/services/app';
import { ConfgoBase } from '../confgo/config/view';
import { ServiceGetIdcList } from '@/services/idc';
import { ServiceAppInfo, ServiceAppEnvZone } from '@/services/app';
import { history } from 'umi';
import styles from './style.less';
import Detail from './components/Detail/index';
import ZoneSelect from '@/components/ZoneSelect';
import Config from './components/Config';

const { TabPane } = Tabs;

export default class App extends React.Component<ConfgoBase, any> {
  constructor(props) {
    super(props);
    this.state = {
      appName: this.props.location.query.appName,
      env: this.props.location.query.env,
      aid: parseInt(this.props.location.query.aid),
      appInfo: {},
      appList: [],
      appIdcList: [],
      idcList: [],
      appEnvZone: [],
      zoneList: [],
      appNodeList: [],
      disable: true,
      zoneCode: 'all',
      tab: this.props.location.query.tab == undefined ? 'detail' : this.props.location.query.tab,
    };
  }

  componentDidMount() {
    ServiceAppList().then((res) => {
      if (res.code === 0) {
        this.setState({
          appList: res.data.list,
        });
      } else {
        message.error(res.msg);
      }
    });
    ServiceGetIdcList().then((res) => {
      if (res.code === 0) {
        this.setState({
          idcList: res.data.list,
        });
      } else {
        message.error(res.msg);
      }
    });
    const { aid, appName, tab } = this.state;
    if (aid != undefined && aid != 0 && appName != undefined && appName != 0) {
      this.getAppInfo(aid, appName);
      this.GetList(this.state.aid, this.state.env);
      this.getAppEnvZone(appName);
    }

    let queries = this.props.location.query;

    history.push({
      query: {
        ...queries,
        tab: tab,
      },
    });
  }

  getAppInfo = (aid: number, appName: string) => {
    this.getAppEnvZone(appName);
    ServiceAppInfo(aid, appName).then((res) => {
      if (res.code === 0) {
        this.setState({
          appInfo: res.data,
          aid: aid,
          appName: appName,
        });
        let queries = this.props.location.query;
        history.push({
          query: {
            ...queries,
            appName: appName,
            aid: aid,
          },
        });
      } else {
        message.error(res.msg);
      }
    });
  };

  setEnv = (value: string) => {
    this.setState({
      env: value,
      zoneCode: 'all',
    });
    this.genZoneList(this.state.appEnvZone, value);
    this.GetList(this.state.aid, value);
    let queries = this.props.location.query;
    history.push({
      query: {
        ...queries,
        env: value,
      },
    });
  };

  getAppEnvZone = (appName: string) => {
    ServiceAppEnvZone(appName).then((res) => {
      if (res.code === 0) {
        this.genZoneList(res.data, this.state.env);
        this.setState({
          appEnvZone: res.data,
        });
      } else {
        message.error(res.msg);
      }
    });
  };

  genZoneList = (list: any, env: string) => {
    list.forEach((element) => {
      if (element.env == env) {
        this.setState({
          zoneList: element.zone_list,
        });
      }
    });
  };

  callback = (tab: string) => {
    this.getAppEnvZone(this.state.appName);
    this.setState({
      tab,
    });
    let queries = this.props.location.query;
    history.push({
      query: {
        ...queries,
        tab: tab,
      },
    });
  };

  GetList = (aid: number, env: string) => {
    ServiceGetAppList({ aid: aid, env: env, pageSize: 10000 }).then((res: any) => {
      if (res.code == 0) {
        this.setState({
          appNodeList: res.data.list,
        });
      } else {
        message.error(res.message);
      }
    });
  };

  onChangeZone = (value: string) => {
    if (value != 'all') {
      ServiceGetAppList({
        aid: this.state.aid,
        env: this.state.env,
        pageSize: 10000,
        zone_code: value,
      }).then((res: any) => {
        if (res.code == 0) {
          this.setState({
            appNodeList: res.data.list,
          });
        } else {
          message.error(res.message);
        }
      });
    } else {
      this.GetList(this.state.aid, this.state.env);
    }
  };

  changeZone = (e: any) => {
    this.onChangeZone(e.target.value);
    this.setState({ zoneCode: e.target.value });
  };

  render() {
    let view = null;
    const { aid, appName, env, appEnvZone } = this.state;
    let { disable } = this.state;

    if (appName != undefined && appName != '') {
      disable = false;
    }

    if (aid == undefined || isNaN(aid) || aid == 0) {
      view = (
        <Col span={24} style={{ marginTop: 20 }}>
          <Alert
            style={{ marginLeft: 10, marginRight: 20, marginBottom: 20 }}
            message="优先选择应用"
            description=""
            type="info"
          />
        </Col>
      );
    } else {
      view = (
        <Tabs
          defaultActiveKey={this.state.tab}
          onChange={this.callback}
          style={{ width: '100%', marginTop: '10px' }}
          tabBarStyle={{ paddingLeft: '10px', marginBottom: 0 }}
        >
          <TabPane tab="详情" key="detail">
            <Detail
              aid={aid}
              env={env}
              appNodeList={this.state.appNodeList}
              appEnvZone={appEnvZone}
            />
          </TabPane>
          <TabPane tab="配置" key="confgo">
            <Config
              aid={aid}
              env={env}
              appName={appName}
              appInfo={this.state.appInfo}
              appIdcList={''}
              zoneCode={this.state.zoneCode}
              param={''}
              idcList={this.state.idcList}
              appEnvZone={this.state.appEnvZone}
              zoneList={this.state.zoneList}
            />
          </TabPane>
          <TabPane tab="监控" key="monitor">
            <Monitor
              aid={aid}
              env={env}
              appName={appName}
              appInfo={this.state.appInfo}
              appNodeList={this.state.appNodeList}
              appIdcList={''}
              zoneCode={''}
              param={''}
              appEnvZone={appEnvZone}
              idcList={this.state.idcList}
              zoneList={this.state.zoneList}
            />
          </TabPane>
          <TabPane tab="Pprof" key="pprof">
            <PPofList
              aid={aid}
              env={env}
              appName={appName}
              appInfo={this.state.appInfo}
              appNodeList={this.state.appNodeList}
              appIdcList={''}
              zoneCode={''}
              param={''}
              appEnvZone={appEnvZone}
              idcList={this.state.idcList}
              zoneList={this.state.zoneList}
            />
          </TabPane>
        </Tabs>
      );
    }
    return (
      <PageHeaderWrapper>
        <div style={{ backgroundColor: '#fff' }}>
          <div style={{ padding: 10 }}>
            <Row>
              <AppHeader
                appInfo={this.state.appInfo}
                appIdcList={this.state.appIdcList}
                appList={this.state.appList}
                appName={this.state.appName}
                getAppInfoAction={this.getAppInfo}
                setEnvAction={this.setEnv}
                env={env}
                zone_code={''}
                idcList={this.state.idcList}
                initDisable={disable}
              />
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col span={12}>
                <ZoneSelect
                  appEnvZone={appEnvZone}
                  env={env}
                  onChange={this.changeZone}
                  defalutZone={this.state.zoneCode}
                />
              </Col>
            </Row>
          </div>

          <Row>{view}</Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}
