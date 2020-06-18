import React from 'react';
import { connect } from 'dva';
import {
  Row,
  Card,
  Menu,
  Select,
  Modal,
  Button,
  Popconfirm,
  message,
  Col,
  Table,
  Input,
  Tag,
  Checkbox,
  Tabs,
  Icon,
  Alert,
  Tooltip,
  Layout,
  List,
  Radio,
} from 'antd';

const RadioGroup = Radio.Group;
import moment from 'moment';
import { getSysConfig, installDep } from '@/pages/manage/services';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

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
    getSysConfig({ sysType: 1 }).then((res) => {
      const { code, msg, data } = res;
      if (code !== 0) {
        message.error(msg);
        return false;
      }
      let mapSys = new Map();
      let typeList = [];
      data.map((v) => {
        if (v.sysType === 2) {
          mapSys.set(v.setCate, v.setStr);
          typeList.push(<Radio value={v.setCate}>{v.setCate}</Radio>);
        }
      });
      let monitorHost = mapSys.get(monitorType);
      this.setState({
        sysConfig: data,
        mapSys: mapSys,
        monitorHost: monitorHost,
        typeList,
      });
      return true;
    });
  };

  monitorTypeTChange = (e) => {
    const { mapSys } = this.state;
    console.log('>>>>>>>>>> monitorTypeTChange', e.target.value);
    let monitorHost = mapSys.get(e.target.value);
    this.setState({
      monitorType: e.target.value,
      monitorHost: monitorHost,
    });
  };

  renderGrafana = () => {
    const { appName, zoneCode, env, monitorHost } = this.state;
    console.log('>>>>>>>>>> renderGrafana', monitorHost);
    if (monitorHost === '' || monitorHost == undefined) {
      return (
        <div style={{ marginTop: 10 }}>
          <Alert message="请选择监控类型" description="" type="warning" showIcon />
        </div>
      );
    }
    let url =
      monitorHost +
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
    } = this.state;
    console.log('render ', env, zoneCode, monitorHost, sysConfig, mapSys);
    if (!env) {
      return (
        <div style={{ marginTop: 10 }}>
          <Alert message="Warning" description="请选择环境." type="warning" showIcon />
        </div>
      );
    }

    return (
      <div>
        <Card style={{ marginLeft: '10px' }}>
          <Row gutter={24} className="top" style={{ marginTop: 16, marginBottom: 16 }}>
            <Col span={1} style={{ fontWeight: 'bold' }}>
              类型
            </Col>
            <Col span={22}>
              <RadioGroup value={monitorType} onChange={this.monitorTypeTChange}>
                {typeList}
              </RadioGroup>
            </Col>
          </Row>
          {this.renderGrafana()}
        </Card>
      </div>
    );
  }
}
