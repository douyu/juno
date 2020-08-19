import React from 'react';
import PPofList from '../pprof/pprof';
import Monitor from '../monitor/monitor';
import {Col, Empty, message, Row, Tabs} from 'antd';
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
import {getFrameVersion} from "@/pages/monitor/services";
import Event from "@/pages/app/components/Event";
import Test from "@/pages/app/components/Test";

const {TabPane} = Tabs;

@connect(({setting}: any) => ({
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
      // this.getFrameVersion(appName);
    }

    let queries = this.props.location.query;

    history.push({
      query: {
        ...queries,
        tab: tab,
      },
    });

    const {zone, versionKey} = queries
    if (zone) {
      this.setState({
        zoneCode: zone
      })
    }

    // 加载设置
    this.props.dispatch({
      type: 'setting/loadSettings',
    });

    if (versionKey) {
      this.setState({
        versionKey
      })
    } else {
      if (appName != undefined && appName != 0) {
        this.getFrameVersion(appName);
      }
    }

  }

  getAppInfo = (aid: number, appName: string) => {
    const {env} = this.state
    this.getAppEnvZone(appName);
    this.GetList(aid, env)
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
      const {code, data} = res;
      if (code !== 0) {
        // message.error(msg);
        return;
      }
      const {versionKey} = data;

      this.setState({
        versionKey,
      });

      let queries = this.props.location.query;
      history.push({
        query: {
          ...queries,
          versionKey
        }
      })

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
    this.setState({
      zoneList: []
    })
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
    const versionKey = e;
    this.setState({versionKey});
    let queries = this.props.location.query;
    history.push({
      query: {
        ...queries,
        versionKey
      }
    })
  };

  onSelectMonitorVersion = (e: any) => {
    this.setState({monitorVersion: e})
  }

  render() {
    let view = null;
    const {aid, appName, env, appEnvZone, monitorVersion, versionKey, tab} = this.state;
    let {disable} = this.state;
    const {version} = this.props.setting.settings;
    // const grafanaConf = grafana instanceof Array ? grafana : []

    if (appName != undefined && appName != '') {
      disable = false;
    }

    if (aid == undefined || isNaN(aid) || aid == 0) {
      view = (
        <div style={{marginTop: 10, width: '100%'}}>
          <Empty description={"请选择应用"} style={{padding: '100px'}}/>
        </div>
      );
    } else if (env == undefined || env == "") {
      view = (
        <div style={{marginTop: 10, width: '100%'}}>
          <Empty description={"请选择环境"} style={{padding: '100px'}}/>
        </div>
      );
    } else {
      view = (
        <Tabs
          defaultActiveKey={this.state.tab}
          activeKey={tab}
          onChange={this.onChangeTab}
          style={{width: '100%', marginTop: '-10px'}}
          tabBarStyle={{paddingLeft: '10px', marginBottom: 0}}
        >
          <TabPane tab="详情" key="detail">
            <Detail
              aid={aid}
              env={env}
              appNodeList={this.state.appNodeList}
              onEditAppNode={() => {
                this.getAppInfo(this.state.aid, this.state.appName)
              }}
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
              versionKey={versionKey}
            />
          </TabPane>

          <TabPane tab={"事件"} key={"event"}>
            <Event active={tab === 'event'} appName={appName} env={env}/>
          </TabPane>

          <TabPane tab={"Test"} key={"test"}>
            <Test
              appName={appName}
              env={env}
              zoneCode={this.state.zoneCode}
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
                versionKey={versionKey}
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
