import React from 'react';
import PPofList from '../pprof/pprof';
import Monitor from '../monitor/monitor';
import {Alert, Col, message, Row, Tabs, Select} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import AppHeader from './components/AppHeader/index';
import {ServiceAppEnvZone, ServiceAppInfo, ServiceAppList, ServiceGetAppList} from '@/services/app';
import {ConfgoBase} from '../confgo/config/view';
import {ServiceGetIdcList} from '@/services/idc';
import {history} from 'umi';
import Detail from './components/Detail/index';
import ZoneSelect from '@/components/ZoneSelect';
import Config from './components/Config';
import {connect} from "dva";
import Etcd from "@/pages/etcd/etcd";
import VersionSelect from '@/components/VersionSelect';
import {getFrameVersion} from "@/pages/monitor/services";

const {TabPane} = Tabs;

@connect(({setting}) => ({
  setting,
}))
export default class App extends React.Component<ConfgoBase & { location: { query: any } }, any> {
  constructor(props: any) {
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
      monitorVersion: '',
      disable: true,
      zoneCode: 'all',
      versionName: '',
      frameVersion: '',
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
    const {aid, appName, tab} = this.state;
    if (aid != undefined && aid != 0 && appName != undefined && appName != 0) {
      this.getAppInfo(aid, appName);
      this.GetList(this.state.aid, this.state.env);
      this.getAppEnvZone(appName);
      this.getFrameVersion(appName);
    }

    let queries = this.props.location.query;

    history.push({
      query: {
        ...queries,
        tab: tab,
      },
    });

    const {zone} = queries
    if (zone) {
      this.setState({
        zoneCode: zone
      })
    }
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

  getFrameVersion = (appName: string) => {
    getFrameVersion({appName}).then((res) => {
      const {code, msg, data} = res;
      if (code !== 0) {
        // message.error(msg);
        return;
      }
      const {frameVersion, versionKey} = data;

      this.setState({
        versionName: versionKey,
      });

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
    list.forEach((element: any) => {
      if (element.env == env) {
        this.setState({
          zoneList: element.zone_list,
        });
      }
    });
  };

  onChangeTab = (tab: string) => {
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
    ServiceGetAppList({aid: aid, env: env, pageSize: 10000}).then((res: any) => {
      if (res.code == 0) {
        this.setState({
          appNodeList: res.data.list,
        });
      } else {
        message.error(res.msg);
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
          message.error(res.msg);
        }
      });
    } else {
      this.GetList(this.state.aid, this.state.env);
    }
  };

  changeZone = (e: any) => {
    const zone = e.target.value
    this.onChangeZone(zone);
    this.setState({zoneCode: zone});
    let queries = this.props.location.query;
    history.push({
      query: {
        ...queries,
        zone
      }
    })
  };

  changeVersion = (e: any) => {
    const versionName = e;
    this.setState({versionName});
  };

  onSelectMonitorVersion = (e) => {
    this.setState({monitorVersion: e})
  }

  render() {
    let view = null;
    const {aid, appName, env, appEnvZone, monitorVersion, versionName} = this.state;
    let {disable} = this.state;
    const {version} = this.props.setting.settings;
    // const grafanaConf = grafana instanceof Array ? grafana : []

    if (appName != undefined && appName != '') {
      disable = false;
    }

    if (aid == undefined || isNaN(aid) || aid == 0) {
      view = (
        <Col span={24} style={{marginTop: 20}}>
          <Alert
            style={{marginLeft: 10, marginRight: 20, marginBottom: 20}}
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
          onChange={this.onChangeTab}
          style={{width: '100%', marginTop: '-10px'}}
          tabBarStyle={{paddingLeft: '10px', marginBottom: 0}}
        >
          <TabPane tab="详情" key="detail">
            <Detail
              aid={aid}
              env={env}
              appNodeList={this.state.appNodeList}
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
          <TabPane tab="Pprof" key="pprof">
            <PPofList
              aid={aid}
              env={env}
              appName={appName}
              appInfo={this.state.appInfo}
              appNodeList={this.state.appNodeList}
              appIdcList={''}
              zoneCode={this.state.zoneCode}
              param={''}
              appEnvZone={appEnvZone}
              idcList={this.state.idcList}
              zoneList={this.state.zoneList}
            />
          </TabPane>
          <TabPane tab="Etcd查询" key="etcd">
            <Etcd
              aid={aid}
              env={env}
              appName={appName}
              appInfo={this.state.appInfo}
              appNodeList={this.state.appNodeList}
              appIdcList={''}
              zoneCode={this.state.zoneCode}
              param={''}
              appEnvZone={appEnvZone}
              idcList={this.state.idcList}
              zoneList={this.state.zoneList}
            />
          </TabPane>
          {/*     <TabPane tab={<Select style={{width: 160}} defaultValue={'监控'} bordered={false}
                                onSelect={this.onSelectMonitorVersion}>
            {(grafana || []).map(item => <Select.Option key={item.version}
                                                        value={item.version}> {`监控 ` + item.version}</Select.Option>)}

          </Select>} key="monitor">*/}
          <TabPane tab="监控" key="monitor">
            <Monitor
              monitorVersion={monitorVersion}
              aid={aid}
              env={env}
              appName={appName}
              appInfo={this.state.appInfo}
              appNodeList={this.state.appNodeList}
              appIdcList={''}
              param={''}
              appEnvZone={appEnvZone}
              idcList={this.state.idcList}
              zoneList={this.state.zoneList}
              zoneCode={this.state.zoneCode}
              versionName={versionName}
            />
          </TabPane>

        </Tabs>
      );
    }
    return (
      <PageHeaderWrapper>
        <div style={{backgroundColor: '#fff', borderRadius: '8px'}}>
          <div style={{padding: 10}}>
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
                versionConfig={version}
                versionName={versionName}
                changeVersion={this.changeVersion}
              />
            </Row>
            <Row>
              <Col span={12}>
                <ZoneSelect
                  appEnvZone={appEnvZone}
                  env={env}
                  onChange={this.changeZone}
                  zoneCode={this.state.zoneCode}
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
