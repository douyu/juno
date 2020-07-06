import React from 'react';
import { connect } from 'dva';
import { Alert, Card, Col, Radio, Row } from 'antd';

const RadioGroup = Radio.Group;

const DashboardList = [
  { key: 'api_dashboard_addr', label: 'API监控面板' },
  { key: 'instance_dashboard_addr', label: 'Instance监控面板' },
  { key: 'overview_dashboard_addr', label: '概览监控面板' },
];

@connect(({ setting }) => ({
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
    // 说明已经传了数据
    if (nextProps.idcCode === '' || nextProps.appName === '' || nextProps.mode === '') {
      return;
    }
    const { idcCode, appName, mode, env } = this.state;

    // 内容一样就不在渲染
    if (
      nextProps.idcCode === idcCode &&
      nextProps.appName === appName &&
      nextProps.mode === mode &&
      nextProps.env === env
    ) {
      return;
    }

    // 一定要同步
    this.setState(
      {
        idcCode: nextProps.idcCode,
        appName: nextProps.appName,
        env: nextProps.env,
        mode: nextProps.mode,
      },
      () => {
        this.getList();
      },
    );
  }

  getList = () => {
    const { appName, zoneCode, env, monitorType } = this.state;

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
    const dashboardKey = e.target.value;
    console.log('>>>>>>>>>> monitorTypeTChange', e.target.value);
    const { grafana } = this.props.setting.settings;

    if (!grafana) {
      return;
    }

    let dashboardPath = grafana['api_dashboard_addr'];
    this.setState({
      dashboardPath,
      dashboardSelected: dashboardKey,
    });

    // const {mapSys} = this.state;
    // let monitorHost = mapSys.get(e.target.value);
    // this.setState({
    //   monitorType: e.target.value,
    //   monitorHost: monitorHost,
    // });
  };

  renderGrafana = () => {
    const { appName, zoneCode, env, monitorHost } = this.state;
    let dashboardPath = this.state.dashboardPath;
    console.log('>>>>>>>>>> renderGrafana', dashboardPath);
    if (!dashboardPath) {
      return (
        <div style={{ marginTop: 10 }}>
          <Alert message="请选择监控类型" description="" type="warning" showIcon />
        </div>
      );
    }
    let url =
      dashboardPath +
      '?' +
      '&var-appname=' +
      appName +
      '&var-env=' +
      env +
      // '&from=now-30m&to=now&kiosk';
      '&from=now-30m&to=now';
    console.log('>>>>>>>>>> url', url);
    // let url = 'ss1111111111111';

    return (
      <div style={{ display: 'block', overflow: 'hidden' }}>
        <iframe
          src={url}
          scrolling="no"
          width="104%"
          height={2000}
          frameBorder={0}
          style={{ marginLeft: '-65px', overflow: 'hidden' }}
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
    } = this.state;

    const { grafana } = this.props.setting.settings;
    let dashboardRadios = [];
    grafana &&
      DashboardList.map((item) => {
        if (grafana[item.key]) {
          dashboardRadios.push(
            <Radio.Button key={item.key} value={item.key}>
              {item.label}
            </Radio.Button>,
          );
        }
      });
    if (!env) {
      return (
        <div style={{ marginTop: 10 }}>
          <Alert message="Warning" description="请选择环境." type="warning" showIcon />
        </div>
      );
    }

    return (
      <div style={{ backgroundColor: '#f7f8fa' }}>
        <div style={{ marginLeft: 10, marginTop: 10, marginRight: 10, marginBottom: 10 }}>
          <Row gutter={24} className="top">
            <Col span={22}>
              {dashboardRadios.length > 0 ? (
                <RadioGroup
                  value={dashboardSelected}
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
