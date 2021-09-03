import React from 'react';
import PPofList from '../pprof/pprof';
import Grpcadmin from '../grpcadmin/index';
import Monitor from '../monitor/monitor';
import {Col, Empty, message, Row, Tabs} from 'antd';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import AppHeader from './components/AppHeader/index';
import {
  ServiceAppEnvZone,
  ServiceAppInfo,
  ServiceAppList,
  ServiceAppNodeList,
} from '@/services/app';
import {
  PostAppViewHistory, GetAppConfig, PostAppConfig, PostAppVisit
} from '@/services/user';
import {ConfgoBase} from '../confgo/config/view';
import {ServiceGetIdcList} from '@/services/idc';
import {history} from 'umi';
import Detail from './components/Detail/index';
import ZoneSelect from '@/components/ZoneSelect';
import Config from './components/Config';
import {connect} from 'dva';
import Etcd from '@/pages/etcd/etcd';
import Applog from '@/pages/applog/applog';
import {getFrameVersion} from '@/pages/monitor/services';
import Event from '@/pages/app/components/Event';
import Test from '@/pages/app/components/Test';
import {Dispatch} from '@@/plugin-dva/connect';
import styles from "./style.less";

const {TabPane} = Tabs;

interface AppProps {
  location: { query: any };
  setting: any;
  dispatch: Dispatch;
  k8sClusters: any[];
}

@connect(({setting}: any) => ({
  setting,
  k8sClusters: setting.settings.k8s_cluster?.list || [],
}))
export default class App extends React.Component<ConfgoBase & AppProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      serviceVersion: this.props.location.query.serviceVersion,
      publishVersion: this.props.location.query.publishVersion,
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
      userConfig: {}, // userConfig 只是用于刷新页面记录上一次操作用，只需要首次渲染时获取
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
      this.getUserAppConfig(aid);
      // this.getFrameVersion(appName);
    }

    let queries = this.props.location.query;

    history.push({
      query: {
        ...queries,
        tab: tab,
      },
    });

    const {zone, versionKey} = queries;
    if (zone) {
      this.setState({
        zoneCode: zone,
      });
    }

    // 加载设置
    this.props.dispatch({
      type: 'setting/loadSettings',
    });

    if (versionKey) {
      this.setState({
        versionKey,
      });
    } else {
      if (appName != undefined && appName != 0) {
        this.getFrameVersion(appName);
      }
    }
  }

  getAppInfo = (aid: number, appName: string) => {
    const {env} = this.state;
    this.getAppEnvZone(appName);
    this.GetList(aid, env);
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
        PostAppViewHistory({aid});  // 记录应用访问
        this.saveTabVisit(this.state.tab);
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
          versionKey,
        },
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

  getUserAppConfig = (aid: number) => {
    GetAppConfig(aid).then((res) => {
      if (res.code === 0) {
        this.setState({
          userConfig: res.data,
        });
        if (!res.data.versionKey || res.data.versionKey === '') {
          return
        }
        let queries = this.props.location.query;
        const {versionKey} = queries;
        if (!versionKey) {
          this.setState({
            versionKey: res.data.versionKey,
          });
          history.push({
            query: {
              ...queries,
              versionKey: res.data.versionKey,
            },
          });
        }
      } else {
        message.error(res.msg);
      }
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
      zoneList: [],
    });
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

    this.saveTabVisit(tab);
  };

  GetList = (aid: number, env: string) => {
    ServiceAppNodeList({aid: aid, env: env, pageSize: 10000}).then((res: any) => {
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
      ServiceAppNodeList({
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
    const zone = e.target.value;
    this.onChangeZone(zone);
    this.setState({zoneCode: zone});
    let queries = this.props.location.query;
    history.push({
      query: {
        ...queries,
        zone,
      },
    });
  };

  changeVersion = (e: any) => {
    const versionKey = e;
    this.setState({versionKey}, () => {
        this.saveUserConfig();
      }
    );
    let queries = this.props.location.query;
    history.push({
      query: {
        ...queries,
        versionKey,
      },
    });
  };

  onSelectMonitorVersion = (e: any) => {
    this.setState({monitorVersion: e});
  };

  saveUserConfig = () => {
    const {versionKey, aid, dashboardPath} = this.state;
    const para = {
      aid,
      config: {
        versionKey, dashboardPath
      }
    };
    PostAppConfig(para).then((res) => {
      if (res.code === 0) {
      } else {
        message.error(res.msg);
      }
    });
  };

  saveTabVisit = (tab: string) => {
    //console.log(">>>>>>>>>>>>>>>>>> this.props.location", this.props.location);
    const url = this.props.location.pathname + '?' + this.props.location.search;

    const {aid, env} = this.state;
    if (aid && env && tab) {
      const para = {
        aid, env, tab,
        url,
      };
      PostAppVisit(para).then((res) => {
        if (res.code === 0) {
        } else {
          message.error(res.msg);
        }
      });
    }
  };

  render() {
    let view = null;
    const {aid, appName, env, monitorVersion, versionKey, tab, serviceVersion, publishVersion, userConfig = {}} = this.state;
    let {appEnvZone} = this.state;
    let {disable} = this.state;
    const {version} = this.props.setting.settings;
    const {k8sClusters} = this.props;

    let envList = appEnvZone?.map((item: any) => item.env) || [];

    let zoneList: any[] = [];

    if (env) {
      appEnvZone.forEach((item: any) => {
        if (item.env === env) {
          zoneList = item.zone_list;
        }
      });
    }

    k8sClusters.map((item) => {
      item.env.map((envItem: string) => {
        envList.indexOf(envItem) < 0 && envList.push(envItem);
        if (
          env === envItem &&
          zoneList.findIndex((zoneItem: any) => zoneItem.zone_code === item.zone_code) < 0
        ) {
          zoneList.push({zone_code: item.zone_code, zone_name: item.zone_name});
        }
      });
    });

    if (appName != undefined && appName != '') {
      disable = false;
    }

    if (aid == undefined || isNaN(aid) || aid == 0) {
      view = (
        <div style={{marginTop: 10, width: '100%'}}>
          <Empty description={'请选择应用'} style={{padding: '100px'}}/>
        </div>
      );
    } else if (env == undefined || env == '') {
      view = (
        <div style={{marginTop: 10, width: '100%'}}>
          <Empty description={'请选择环境'} style={{padding: '100px'}}/>
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
          destroyInactiveTabPane 
        >
          <TabPane tab="详情" key="detail">
            <Detail
              aid={aid}
              env={env}
              appNodeList={this.state.appNodeList}
              onEditAppNode={() => {
                this.getAppInfo(this.state.aid, this.state.appName);
              }}
            />
          </TabPane>
          <TabPane tab="监控" key="monitor">
            <Monitor
              aid={aid}
              env={env}
              appName={appName}
              zoneCode={this.state.zoneCode}
              versionKey={versionKey}
              location={this.props.location}
              userConfig={userConfig}
            />
          </TabPane>
          <TabPane tab="配置" key="confgo">
            <Config
              serviceVersion={serviceVersion}
              publishVersion={publishVersion}
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
          <TabPane tab="日志" key="applog">
            <Applog
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
          <TabPane tab="Etcd" key="etcd">
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

          <TabPane tab={'事件'} key={'event'}>
            <Event active={tab === 'event'} appName={appName} env={env}/>
          </TabPane>
          <TabPane tab={'grpc'} key={'grpc'}>
            <Grpcadmin
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
              idcCode={this.state.zoneCode}
            />

          </TabPane>

          {this.props.setting.settings.test_platform?.enable && (
            <TabPane tab={'Test'} key={'test'}>
              <Test appName={appName} env={env} zoneCode={this.state.zoneCode}/>
            </TabPane>
          )}
        </Tabs>
      );
    }
    return (
      <>
        <div style={{backgroundColor: '#fff', borderRadius: 
        '8px', overflow: 'hidden',
        position:"absolute",
        "top":0,bottom:0,width:'100%',
        display:"flex",
        flexDirection:"column",
        }}>
          <div style={{padding: 10}}>
            <Row>
              <AppHeader
                appInfo={this.state.appInfo}
                appIdcList={this.state.appIdcList}
                appList={this.state.appList}
                envList={envList}
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
                envZone={appEnvZone}
              />
            </Row>
            <Row>
              <Col span={12}>
                <ZoneSelect
                  zoneList={zoneList}
                  appEnvZone={appEnvZone}
                  env={env}
                  onChange={this.changeZone}
                  zoneCode={this.state.zoneCode}
                />
              </Col>
            </Row>
          </div>
          <Row style={{flex:'auto'}} className={styles.viewContent}>{view}</Row>
        </div>
      </>
    );
  }
}
