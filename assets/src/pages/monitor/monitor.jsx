import React from 'react';
import {connect} from 'dva';
import {Alert, Card, Col, message, Radio, Row, Empty} from 'antd';
import {instanceOf} from 'prop-types';
import {getFrameVersion} from './services';
import {history} from "@@/core/history";

import {
  GetAppConfig, GetAppViewHistory, PostAppConfig
} from '@/services/user';

const RadioGroup = Radio.Group;

@connect(({setting}) => ({
  setting,
}))
export default class Monitor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sysConfig: [],
      appName: props.appName,
      aid: props.aid,
      mode: props.mode,
      zoneCode: props.zoneCode,
      env: props.env,
      monitorVersion: props.monitorVersion,
      versionKey: props.versionKey,
      typeList: [],
      mapSys: new Map(),
      monitorType: 1,
      monitorHost: '',
      userConfig: this.props.userConfig,
      dashboardPath: this.props.location.query.dashboardPath,
    };
  }

  componentDidMount() {
    this.getList();

    // 加载设置
    this.props.dispatch({
      type: 'setting/loadSettings',
    });

    GetAppConfig(this.state.aid).then((res) => {
      if (res.code === 0) {
        this.setState({
          userConfig: res.data,
        });
      } else {
        message.error(res.msg);
      }
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log('Monitor -> componentWillReceiveProps -> nextProps', nextProps);
    // 说明已经传了数据
    if (nextProps.zoneCode === '' || nextProps.appName === '' || nextProps.mode === '') {
      return;
    }
    const {zoneCode, appName, mode, env, versionKey} = this.state;

    // 内容一样就不在渲染
    if (
      nextProps.zoneCode === zoneCode &&
      nextProps.appName === appName &&
      nextProps.mode === mode &&
      nextProps.env === env &&
      nextProps.versionKey === versionKey &&
      nextProps.userConfig === userConfig
    ) {
      return;
    }

    const {dashboardPath} = this.state;
    const {userConfig} = this.props;
    console.log("################   dashboardPath", dashboardPath, ">>>>>>>>> userConfig", userConfig);
    if (!dashboardPath && userConfig) {
      this.setState({
        dashboardPath: userConfig.dashboardPath,
      });
    }

    // 一定要同步
    this.setState(
      {
        zoneCode: nextProps.zoneCode,
        appName: nextProps.appName,
        env: nextProps.env,
        mode: nextProps.mode,
        versionKey: nextProps.versionKey,
        userConfig: nextProps.userConfig,
      },
      () => {
        this.getList();
      },
    );
  }

  getList = () => {
  };

  monitorTypeTChange = (e) => {
    // console.log("---> monitorTypeTChange", e);
    const dashboardPath = e.target.value;

    const {version, grafana} = this.props.setting.settings;
    if (!version || !grafana) {
      return;
    }

    this.setState({
      dashboardPath: dashboardPath,
    }, () => {
      this.saveUserConfig();
    });

    let queries = this.props.location.query;
    history.push({
      query: {
        ...queries,
        dashboardPath,
      },
    });
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

  renderGrafana = () => {
    const {appName, zoneCode, env, monitorHost, versionKey, aid} = this.state;

    let versionRealName = '';
    const {version} = this.props.setting.settings;
    version instanceof Array &&
    version.map((item) => {
      if (item.versionKey && item.versionKey === versionKey) {
        versionRealName = item.name;
      }
    });

    console.log('renderGrafana---aid', aid);

    const {dashboardPath = ""} = this.state;
    if (!dashboardPath || dashboardPath === "") {
      return (
        <div style={{marginTop: 10}}>
          <Empty description={'请选择监控类型'} style={{padding: '100px'}}/>
        </div>
      );
    }

    if (zoneCode == '' || zoneCode == 'all') {
      return (
        <div style={{marginTop: 10}}>
          <Empty description={'请选择可用区'} style={{padding: '100px'}}/>
        </div>
      );
    }
    let datasource = env + '.' + zoneCode + '.' + versionRealName;

    console.log('renderGrafana -> zoneCode', zoneCode);
    let url =
      dashboardPath +
      '?' +
      '&var-appname=' +
      appName +
      '&var-env=' +
      env +
      '&var-datasource=' +
      datasource +
      '&var-aid=' +
      aid +
      // '&from=now-30m&to=now&kiosk';
      '&from=now-30m&to=now';

    return (
      <div style={{display: 'block', overflow: 'hidden', marginLeft: '10px'}}>
        <iframe
          src={url}
          scrolling="no"
          width="104%"
          height={2000}
          frameBorder={0}
          style={{marginLeft: '-72px', overflow: 'hidden'}}
        />
      </div>
    );
  };

  render() {
    const {
      zoneCode,
      appName,
      env,
      typeList,
      monitorType = 0,
      sysConfig = [],
      mapSys,
      monitorHost,
      monitorVersion,
      versionKey,
    } = this.state;

    const {version} = this.props.setting.settings;
    console.log('监控 --- version', version);
    console.log('监控 --- versionKey', versionKey);
    console.log('>>>>>>>>> this.props.userConfig', this.props.userConfig);
    let dashboardList = [];
    version instanceof Array &&
    version.map((item) => {
      if (item.versionKey && item.versionKey === versionKey) {
        dashboardList = item.dashboards ? item.dashboards : [];
      }
    });
    console.log('监控 --- dashboardList', dashboardList);
    let dashboardRadios = [];
    dashboardList &&
    dashboardList.map((item) => {
      dashboardRadios.push(
        <Radio.Button key={item.name} value={item.value}>
          {item.name}
        </Radio.Button>,
      );
    });
    if (!env) {
      return (
        <div style={{marginTop: 10}}>
          <Alert message="Warning" description="请选择环境." type="warning" showIcon/>
        </div>
      );
    }

    //console.log('dashboardSelected', dashboardSelected);
    console.log('dashboardPath', this.state.dashboardPath);
    console.log('this.props.location.query.dashboardPath', this.props.location.query);
    return (
      <div style={{backgroundColor: '#f7f8fa'}}>
        <div
          style={{
            marginLeft: 10,
            marginTop: 10,
            marginRight: 10,
            marginBottom: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <Row gutter={24} className="top">
            <Col span={22} style={{marginLeft: '10px', paddingBottom: '10px'}}>
              {dashboardRadios ? (
                <RadioGroup
                  defaultValue={''}
                  value={this.state.dashboardPath}
                  onChange={this.monitorTypeTChange}
                  optionType="button"
                  buttonStyle="solid"
                >
                  {dashboardRadios}
                </RadioGroup>
              ) : (
                <span>请在设置界面设置监控面板地址</span>
              )}
            </Col>
          </Row>
          {this.renderGrafana()}
        </div>
      </div>
    );
  }
}
