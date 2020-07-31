import React from 'react';
import {connect} from 'dva';
import {Alert, Card, Col, Empty, Radio, Row} from 'antd';
import {instanceOf} from "prop-types";

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
      mode: props.mode,
      zoneCode: props.zoneCode,
      env: props.env,
      monitorVersion: props.monitorVersion,
      versionName: props.versionName,
      typeList: [],
      mapSys: new Map(),
      monitorType: 1,
      monitorHost: '',
    };
  }

  componentDidMount() {
    console.log('>>>>> props', this.props);
    this.getList();

    // 加载设置
    this.props.dispatch({
      type: 'setting/loadSettings',
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log('Monitor -> componentWillReceiveProps -> nextProps', nextProps);
    // 说明已经传了数据
    if (nextProps.zoneCode === '' || nextProps.appName === '' || nextProps.mode === '') {
      return;
    }
    const {zoneCode, appName, mode, env, versionName} = this.state;

    // 内容一样就不在渲染
    if (
      nextProps.zoneCode === zoneCode &&
      nextProps.appName === appName &&
      nextProps.mode === mode &&
      nextProps.env === env &&
      nextProps.versionName === versionName
    ) {
      return;
    }

    // 一定要同步
    this.setState(
      {
        zoneCode: nextProps.zoneCode,
        appName: nextProps.appName,
        env: nextProps.env,
        mode: nextProps.mode,
        versionName: nextProps.versionName,
      },
      () => {
        this.getList();
      },
    );
  }

  getList = () => {
    const {appName, zoneCode, env, monitorType} = this.state;

    // getSysConfig({ sysType: 1 }).then((res) => {
    //   const { code, msg, data } = res;
    //   if (code !== 0) {
    //     message.error(msg);
    //     return false;
    //   }
    //   let mapSys = new Map();
    //   let typeList = [];
    //   data.map((v) => {
    //     if (v.sysType === 2) {
    //       mapSys.set(v.setCate, v.setStr);
    //       typeList.push(<Radio value={v.setCate}>{v.setCate}</Radio>);
    //     }
    //   });
    //   let monitorHost = mapSys.get(monitorType);
    //   this.setState({
    //     sysConfig: data,
    //     mapSys: mapSys,
    //     monitorHost: monitorHost,
    //     typeList,
    //   });
    //   return true;
    // });
  };


  monitorTypeTChange = (e) => {
    // console.log("---> monitorTypeTChange", e);
    const dashboardKey = e.target.value;

    const {version} = this.props.setting.settings;
    if (!version) {
      return;
    }

    let dashboardPath = '';
    const {versionName} = this.state;

    (version instanceof Array) && version.map((item) => {
      if (item.version && item.version === versionName && item.host) {
        dashboardPath = item.host + dashboardKey
      }
    })

    // let dashboardPath = grafana[dashboardKey];
    this.setState({
      dashboardPath,
      dashboardSelected: dashboardKey,
    });

  };

  renderGrafana = () => {
    const {appName, zoneCode, env, monitorHost} = this.state;
    let dashboardPath = this.state.dashboardPath;
    if (!dashboardPath) {
      return (
        <div style={{marginTop: 10}}>
          <Empty description={"请选择Dashboard"} style={{padding: '100px'}}/>
        </div>
      );
    }

    if (zoneCode == '' || zoneCode == 'all') {
      return (
        <div style={{marginTop: 10}}>
          <Empty description={"请选择可用区"} style={{padding: '100px'}}/>
        </div>
      );
    }
    let datasource = env + '.' + zoneCode;

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
      // '&from=now-30m&to=now&kiosk';
      '&from=now-30m&to=now';
    console.log('>>>>>>>>>> url', url);
    // let url = 'ss1111111111111';

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
      dashboardSelected,
      monitorVersion,
      versionName
    } = this.state;


    const {version} = this.props.setting.settings;
    console.log("监控 --- version", version);
    console.log("监控 --- versionName", versionName);

    let dashboardList = [];
    (version instanceof Array) && version.map((item) => {
      if (item.version && item.version === versionName) {
        dashboardList = item.dashboards ? item.dashboards : [];
      }
    })
    console.log("监控 --- dashboardList", dashboardList);
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
    console.log("dashboardSelected", dashboardSelected)
    console.log("dashboardRadios", dashboardRadios)
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
            <Col span={22}>
              {dashboardRadios ? (
                <RadioGroup
                  defaultValue={''}
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
