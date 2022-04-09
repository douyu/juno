import React from 'react';
import { connect } from 'dva';
import { Tooltip, Descriptions, Icon, Row, Col, Select, Tag } from 'antd';
import Help from '../../components/Help';
import { routerRedux } from 'dva/router';
const { Option } = Select;

const IdcCodeMap = {
  'HB-WHYL': '武汉银联',
  'BJ-BG-18': '北京海淀办公',
  'BJ-ZW-10': '北京兆维',
  'BJ-YZ': '北京亦庄',
  'ALIYUN-HN': '华南阿里云',
  'ALIYUN-SZ': '深圳阿里云',
  'ALIYUN-HD': '华东阿里云',
  'ALIYUN-HB2-C': '华北阿里云C区',
  'ALIYUN-HB2-D': '华北阿里云D区',
  'ALIYUN-HB2-E': '华北阿里云E区',
  'ALIYUN-HB2-F': '华北阿里云F区',
  'ALIYUN-HB2-G': '华北阿里云G区',
  'ALIYUN-HB2-H': '华北阿里云H区',
  'BJ-CP-WG': '北京昌平',
  'TENCENT-SHANGHAI-4': '腾讯云-华东地区(上海)',
};

@connect(({ appHeaderModel, loading }) => ({
  appList: [],
  idcList: appHeaderModel.idcList,
}))
export default class HeaderView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      app: this.props.appName,
      env: this.props.env,
      idcCode: this.props.idcCode,
    };

    this.changeReduxUrl();
  }

  componentWillMount() {}

  componentDidMount() {
    this.getEnv();
    this.getAppList();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // 说明已经传了数据
    if (nextProps.appInfo.appName === '' || nextProps.appInfo.appName === undefined) {
      return;
    }

    const { app } = this.state;

    // 内容一样就不在渲染
    if (nextProps.appInfo.appName === app) {
      return;
    }

    // // 一定要同步
    // this.setState({
    //   app: nextProps.appInfo.appName,
    // },() => {
    //   this.props.getAppInfo(this.state.app)
    // })
  }

  // 改变浏览器url，便于分享
  changeReduxUrl = () => {
    const { dispatch } = this.props;
    const { app, env, idcCode } = this.state;

    // let url = this.props.path;
    // if (app === "" || env === "" || idcCode === "") {
    //   return;
    // }
    //
    // url = url.replace(":app", app);
    // url = url.replace(":env", env);
    // url = url.replace(":idcCode", idcCode);
    //
    // dispatch(
    //   routerRedux.push({
    //     pathname: url
    //   })
    // );
  };

  getAppList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appHeaderModel/getAppList',
      payload: {
        appName: this.state.app,
      },
    });
  };

  getEnv = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appHeaderModel/getEnv',
    });
  };

  onSelectApp = (value) => {
    this.setState(
      {
        app: value,
      },
      () => {
        this.changeReduxUrl();
        this.props.getAppInfo(value);
      },
    );
  };

  onChangeEnv = (value) => {
    this.setState(
      {
        env: value,
      },
      () => {
        this.changeReduxUrl();
        this.props.setEnv(value);
      },
    );
    // 更新环境联动机房选择
    const { appInfo = {}, appIdcList = [], appList = [], minervaVersion } = this.props;
    appIdcList.forEach((item) => {
      if (item.env === value) {
        if (IdcCodeMap[item.idcCode] !== undefined) {
          this.onChangeIdc(item.idcCode);
        }
      }
    });
  };

  onChangeIdc = (value) => {
    this.setState(
      {
        idcCode: value,
      },
      () => {
        this.changeReduxUrl();
        this.props.setIdcCode(value);
      },
    );
  };

  onBlur = (value) => {
    console.log('blur');
  };

  onFocus = (value) => {
    console.log('focus');
  };

  onSearch = (value) => {
    console.log('search:', value);
  };

  isRepeat = (m, env) => {
    let f = false;
    m.forEach((v) => {
      if (v === env) {
        f = true;
        return f;
      }
    });
    return f;
  };

  render() {
    const { appInfo = {}, appIdcList = [], appList = [], minervaVersion, switchIdc } = this.props;
    const {
      aid,
      gid,
      name,
      appName,
      createTime,
      updateTime,
      level,
      lang,
      bizDomain,
      createdBy,
      updatedBy,
      httpPort,
      rpcPort,
      healthPort,
      gitUrl,
      users,
    } = appInfo || {};
    let { env, app, idcCode } = this.state;
    if (app === ':app') {
      app = '选择应用';
    }
    if (env === ':env') {
      env = '选择环境';
    }

    let dataSource = [];
    appList.forEach((value) => {
      dataSource.push(<Option value={value.appName}>{value.appName}</Option>);
    });

    let envOpt = [];
    let idcOpt = [];
    let envRepeatMap = [];

    envRepeatMap.push('prod');
    envOpt.push(
      <Option value="prod">
        <Tag color="#f50">prod</Tag>
      </Option>,
    );
    appIdcList.forEach((value) => {
      if (!this.isRepeat(envRepeatMap, value.env)) {
        envRepeatMap.push(value.env);
        switch (value.env) {
          case 'dev':
            envOpt.push(
              <Option value={value.env}>
                <Tag color="#87d068">{value.env}</Tag>
              </Option>,
            );
            break;
          case 'live':
            envOpt.push(
              <Option value={value.env}>
                <Tag color="#2db7f5">{value.env}</Tag>
              </Option>,
            );
            break;
          case 'pre':
            envOpt.push(
              <Option value={value.env}>
                <Tag color="#108ee9">{value.env}</Tag>
              </Option>,
            );
            break;
          case 'stress':
            envOpt.push(
              <Option value={value.env}>
                <Tag color="#f50">{value.env}</Tag>
              </Option>,
            );
            break;
          case 'gray':
            envOpt.push(
              <Option value={value.env}>
                <Tag color="#f50">{value.env}</Tag>
              </Option>,
            );
            break;
          case 'pub':
            envOpt.push(
              <Option value={value.env}>
                <Tag color="#f50">{value.env}</Tag>
              </Option>,
            );
            break;
          case 'prod':
            envOpt.push(
              <Option value={value.env}>
                <Tag color="#f50">{value.env}</Tag>
              </Option>,
            );
            break;
          default:
            envOpt.push(<Option value={value.env}>{value.env}</Option>);
        }
      }
      if (value.env === env) {
        if (IdcCodeMap[value.idcCode] !== undefined) {
          idcOpt.push(<Option value={value.idcCode}>{IdcCodeMap[value.idcCode]}</Option>);
        }
      }
    });
    return (
      <Row>
        <Col span={11} style={{ float: 'right' }}>
          <Descriptions size="small" column={5}>
            <Descriptions.Item label="应用ID">{aid}</Descriptions.Item>

            <Descriptions.Item label="项目域">{bizDomain}</Descriptions.Item>
            <Descriptions.Item label="HTTP">{httpPort}</Descriptions.Item>
            <Descriptions.Item label="gRPC">{rpcPort}</Descriptions.Item>
            <Descriptions.Item label="Govern">{healthPort}</Descriptions.Item>

            <Descriptions.Item label="超链接">
              <a href={gitUrl} target="_blank">
                <Icon type="gitlab" />
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="负责人">{users}</Descriptions.Item>
            <Descriptions.Item label="Minerva">{minervaVersion}</Descriptions.Item>
            <Descriptions.Item>
              <Tooltip title={name}>
                <span>{appName}</span>
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    );
  }
}
