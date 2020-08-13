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
} from 'antd';
import PprofIframe from './components/PprofIframe';
import moment from 'moment';
import ZoneSelect from '@/components/ZoneSelect';
import { checkDep } from './services';
import { installDep } from '@/pages/manage/services';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const pprofBtn = {
  profile: { name: 'CPU分析（profile）', type: 'profile' },
  profile_hy: { name: 'CPU分析（🔥火焰图）', type: 'profile_hy' },
  heap: { name: '内存分析（heap）', type: 'heap' },
  heap_hy: { name: '内存分析（🔥火焰图）', type: 'heap_hy' },
  goroutine: { name: '协程分析（goroutine）', type: 'goroutine' },
  goroutine_hy: { name: '协程分析（🔥火焰图）', type: 'goroutine_hy' },
  block: { name: '阻塞同步分析（block）', type: 'block' },
  block_hy: { name: '阻塞同步分析（🔥火焰图）', type: 'block_hy' },
};

const { TextArea } = Input;

@connect(({ pprofModel, setting, loading }) => ({
  setting,
  pprofList: pprofModel.pprofList,
  //appNodeList: appModel.appNodeList
}))
export default class PPofList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      btnList: [],
      loading: false,
      app: {},
      pageShowType: 'item',
      pprofActiveBtn: '查看分析',
      pprofActiveTime: '',
      visible: false,
      remarkVisible: false,
      remarkBox: '',
      scenenId: '',
      authCode: 1,
      iframepage: 'about:blank',
      hostName: '', // 通过下拉框,选择对应的节点
      appName: props.appName,
      mode: props.mode,
      zoneCode: props.zoneCode,
      env: props.env,
      depRes: {},
    };
    this.aid = 0;
  }

  componentDidMount() {
    console.log('>>>>> props', this.props);
    this.getList();
    this.GetCheckDep();
    // 加载设置
    this.props.dispatch({
      type: 'setting/loadSettings',
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // 说明已经传了数据
    if (nextProps.zoneCode === '' || nextProps.appName === '' || nextProps.mode === '') {
      return;
    }
    const { zoneCode, appName, mode, env } = this.state;

    // 内容一样就不在渲染
    if (
      nextProps.zoneCode === zoneCode &&
      nextProps.appName === appName &&
      nextProps.mode === mode &&
      nextProps.env === env
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
      },
      () => {
        this.getList();
        this.GetCheckDep();
      },
    );
  }

  GetCheckDep = () => {
    checkDep({ installType: 1 }).then((res) => {
      if (res.status >= 300) return;

      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }
      this.setState({
        depRes: res.data,
      });
      return true;
    });
  };

  //获取节点状态
  getList = () => {
    const { appName, zoneCode, env } = this.state;

    this.props.dispatch({
      type: 'pprofModel/list',
      payload: { app_name: appName, zone_code: zoneCode === 'all' ? null : zoneCode, env },
    });

    this.props.dispatch({
      type: 'appModel/nodeList',
      payload: { appName, zoneCode, env },
    });
  };

  btnLoadingFun = (type, op) => {
    let obj = {};
    obj[type + 'Loading'] = op === true;
    this.setState(obj);
  };

  enterLoading = () => {
    this.setState({ loading: true });
  };

  stopLoading = () => {
    this.setState({ loading: false });
  };

  // 切换实例
  changeNode = (hostName) => {
    this.setState({
      hostName: hostName,
    });
    const { appName, idcCode, env } = this.state;
    this.props.dispatch({
      type: 'pprofModel/list',
      payload: { app_name: appName, idc_code: idcCode, host_name: hostName, env },
    });
  };

  showProfileSvg = (id, type, url) => {
    var that = this;
    let typeName = pprofBtn[type].name;
    if (typeName === undefined) {
      typeName = '查看分析';
    }

    const { dispatch } = this.props;
    this.btnLoadingFun('profile', true);
    that.setState({
      pprofActiveBtn: typeName,
      iframepage: url,
      visible: true,
    });
  };

  // 获取go应用pprof
  runPprof = () => {
    const { dispatch } = this.props;
    const { appName, zoneCode, hostName, env } = this.state;

    // 耗时比较久,所以这里要loading
    this.enterLoading();

    dispatch({
      type: 'pprofModel/run',
      payload: {
        zone_code: zoneCode,
        app_name: appName,
        host_name: hostName,
        env,
      },
      callback: (resp) => {
        this.stopLoading();
        this.getList();

        if (resp.status >= 300) {
          return;
        }

        if (resp.code !== 0) {
          message.error(resp.msg);
          return;
        }

        message.success('成功！因文件服务延时，请稍等片刻查看相关分析文件！', 8);
      },
    });
  };

  handleCheckLog = (e) => {
    console.log('click', e);
    const {} = this.state;
    installDep({ installType: e * 1 }).then((rs) => {
      const { code, msg, data } = rs;
      if (code === 0) {
        message.success('安装成功：', msg);
        this.GetCheckDep();
      } else {
        message.error('安装失败:' + msg);
      }
    });
  };

  onCancel = (e) => {
    this.setState({
      iframepage: '',
      visible: false,
    });
  };

  columns = [
    {
      title: '时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 300,
      render: (text) => {
        console.log('111', text);
        return moment(text * 1000).format('YYYY年MM月DD日HH:mm');
      },
    },
    {
      title: '实例',
      dataIndex: 'hostName',
      key: 'hostName',
      width: 300,
    },
    {
      title: 'pprof预览',
      dataIndex: 'pprofList',
      key: 'pprofList',
      width: 1000,
      render: (pprofList) => (
        <span>
          {pprofList.length > 0 &&
            pprofList.map((item) => {
              return (
                <Button
                  key={'pp' + item.id}
                  data-id={item.id}
                  data-type={item.type}
                  style={{ marginRight: '8px', marginTop: `8px` }}
                  onClick={() => {
                    this.showProfileSvg(item.id, item.type, item.url);
                  }}
                >
                  {pprofBtn[item.type].name}
                </Button>
              );
            })}
        </span>
      ),
    },
  ];

  render() {
    const iframeHeight = 750;
    const that = this;
    let {
      appIdcList = [],
      pprofList = [],
      appNodeList = [],
      defalutZone,
      appEnvZone,
      onChangeZone,
    } = this.props;
    // const { aid, env, appNodeList, appEnvZone, onChangeZone, defalutZone} = props;
    const { pprofActiveBtn, zoneCode, appName, env } = this.state;
    const { loading, depRes } = this.state;
    const { golang, flameGraph, graphviz } = depRes;
    console.log('env,zoneCode ', env, zoneCode);
    if (!env || !zoneCode) {
      return (
        <div style={{ marginTop: 10 }}>
          <Alert message="Warning" description="请选择环境和可用区." type="warning" showIcon />
        </div>
      );
    }
    let changeZone = (e) => {
      onChangeZone(e.target.value);
    };
    return (
      <div style={{ marginLeft: 10, marginTop: 10, marginRight: 10, marginBottom: 10 }}>
        <Row>
          <Col span={8}>
            <Select
              dropdownMatchSelectWidth
              showSearch
              allowClear={true}
              style={{ width: 300 }}
              placeholder="选择实例"
              onChange={this.changeNode}
            >
              {appNodeList != undefined &&
                appNodeList.length > 0 &&
                appNodeList.map((v, i) => {
                  return (
                    <Select.Option key={i} value={v.host_name}>
                      {v.host_name + ' (' + v.ip + ')'}
                    </Select.Option>
                  );
                })}
            </Select>
          </Col>
          <Col span={4}>
            <Popconfirm
              placement="rightBottom"
              title={'CPU分析需等待30s，确认操作？'}
              onConfirm={this.runPprof}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" className={'pprof-btn'} loading={loading}>
                更新分析图表
              </Button>
            </Popconfirm>
          </Col>
          <Col span={8}>
            {golang === 1 && (
              <Tag color="green" key={1}>
                Golang <CheckCircleOutlined />
              </Tag>
            )}
            {golang === 0 && (
              <Tag color="geekblue" key={2}>
                Golang <CloseCircleOutlined />
              </Tag>
            )}

            {flameGraph === 1 && (
              <Tag color="green" key={3}>
                FlameGraph <CheckCircleOutlined />
              </Tag>
            )}
            {flameGraph === 0 && (
              <Tag color="geekblue" key={4}>
                FlameGraph <CloseCircleOutlined />
              </Tag>
            )}

            {graphviz === 1 && (
              <Tag color="green" key={5}>
                Graphviz <CheckCircleOutlined />
              </Tag>
            )}
            {graphviz === 0 && (
              <Tag color="geekblue" key={6}>
                Graphviz <CloseCircleOutlined />
              </Tag>
            )}
          </Col>
        </Row>

        <Row style={{ marginTop: '10px', marginLeft: '10px' }}>
          <Table
            columns={this.columns}
            dataSource={pprofList}
            pagination={{ pageSize: 9999, hideOnSinglePage: true }}
          />
        </Row>

        <Modal
          title={pprofActiveBtn}
          width="88%"
          visible={this.state.visible}
          onCancel={this.onCancel}
          maskClosable={true}
          footer={null}
        >
          <div>
            <PprofIframe iframepage={this.state.iframepage} />
          </div>
        </Modal>
        {/* <Card bordered={false} style={{ marginBottom: '20px', height: { iframeHeight } + 'px' }}/>
        </Card> */}
      </div>
    );
  }
}
