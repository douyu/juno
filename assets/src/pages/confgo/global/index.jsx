import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';
import {
  Input,
  message,
  Tabs,
  Card,
  Table,
  Col,
  Row,
  Modal,
  Button,
  Select,
  Icon,
  Radio,
} from 'antd';
import { addResource, updateResource, checkResourceAppdep, getResourceAuthApp } from './service';
import AddView from './views/appv2.1';
import UpdateView from './views/update';
import SearchView from './views/search';
import AppDepView from './views/appdep';
import AppAuthView from './views/appauth';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

@connect(({ configResource, loading }) => ({
  resourceData: configResource.resourceData,
  authList: configResource.authList,
  appList: configResource.appList,
}))
export default class RedisMonitor extends Component {
  constructor(props) {
    super(props);
    this.updateData = {
      key: '',
      value: '',
      type: '',
      env: '',
      desc: '',
      is_show: false,
      is_common: false,
      idc_code: '',
    };

    this.query = {
      env: 'dev',
      type: 'redis',
      name: '',
      clickTag: 0,
      idc_code: 'HB-WHYL',
    };

    this.state = {
      showAdd: false,
      showUpdate: false,
      showDep: false,
      showAuth: false,

      selectID: '',
      addEnv: '',
      addType: '',

      updateEnv: '',
      updateType: '',

      env: 'dev',
      type: 'redis',
      queryKey: '',
      depList: [],
      idc_code: 'HB-WHYL',
    };
  }

  handleTabChange = (key) => {
    this.idc = key;
    const { dispatch, match } = this.props;
    dispatch(routerRedux.push(`/${key}`));
  };

  clearUpdate = () => {
    this.updateData = {
      key: '',
      value: '',
      type: '',
      env: '',
      is_show: false,
      is_common: false,
      desc: '',
    };

    this.setState({
      selectID: '',
      updateEnv: '',
      updateType: '',
      queryKey: '',
    });
  };

  componentWillMount() {
    this.getList();
  }

  getList = () => {
    const { env, type, queryKey, value, idc_code } = this.state;
    console.log('idc_code', idc_code);

    const { match, dispatch } = this.props;
    dispatch({
      type: 'configResource/queryList',
      payload: {
        env,
        type,
        name: queryKey,
        value,
        idc_code,
      },
    });
    dispatch({
      type: 'configResource/queryAppList',
      payload: { langs: 'Go' },
    });
  };

  getValType = (value) => {
    let originValue = null;
    let valueType = 'string';
    try {
      originValue = JSON.parse(value);
      if (Array.isArray(originValue)) {
        valueType = 'slice';
      } else if (typeof originValue === 'string') {
        valueType = 'string';
      } else {
        message.error(`资源值类型无法解析，只支持字符串和字符串数组`);
        return false;
      }
    } catch (err) {
      message.error(`资源值类型无法解析，只支持字符串和字符串数组`);
      return false;
    }
    return valueType;
  };

  updateResource = (data) => {
    const { selectID } = this.state;

    let { key, value, env, type, desc, is_show, is_common, idc_code } = data;
    const value_type = this.getValType(value);
    if (!value_type) {
      return;
    }

    updateResource({
      id: selectID,
      name: key,
      value,
      value_type,
      type,
      env,
      desc,
      is_show: is_show ? 2 : 1,
      is_common: is_common ? 2 : 1,
      idc_code,
    }).then((rs) => {
      if (rs.code === 0) {
        message.success('更新成功');
        this.setState({
          showUpdate: false,
        });
        this.getList();
        this.clearUpdate();
      } else {
        message.error(rs.msg);
      }
    });
  };

  addResource = (data) => {
    let { key, value, env, type, desc, is_show, is_common, idc_code } = data;
    if (key === '' || value === '') {
      return message.error('请填写完整信息');
    }
    const value_type = this.getValType(value);
    if (!value_type) {
      return;
    }
    const params = {
      name: key,
      value,
      env,
      type,
      value_type,
      desc,
      is_show: is_show ? 2 : 1,
      is_common: is_common ? 2 : 1,
      idc_code,
    };
    addResource([params]).then((rs) => {
      if (rs.code === 0) {
        message.success('新增成功');
        this.setState({
          showAdd: false,
        });
        this.getList();
        this.clearUpdate();
      } else {
        message.error(rs.msg);
      }
    });
  };

  getDepList = () => {
    const { selectID } = this.state;
    checkResourceAppdep({ id: selectID }).then((rs) => {
      if (rs.code === 0) {
        this.setState({
          depList: rs.data,
        });
      }
    });
  };

  getAuthList = () => {
    const { selectID } = this.state;
    this.props.dispatch({
      type: 'configResource/queryAuthList',
      payload: { res_id: selectID },
    });
  };

  render() {
    const that = this;
    const { match, routerData, location, resourceData = {} } = this.props;
    const { list = [], totalCount = 0 } = resourceData;
    const { selectID } = this.state;

    const IdcCodeMap = {
      'HB-WHYL': '武汉银联',
      'BJ-BG': '北京海淀',
      'BJ-ZW-10': '北京兆维',
      'BJ-YZ': '北京亦庄',
      'BJ-CP-WG': '北京昌平',
      'TENCENT-SHANGHAI-4': '腾讯云-华东地区(上海)',
      'ALIYUN-HB2-C': '华北阿里云C区',
      'ALIYUN-HB2-D': '华北阿里云D区',
      'ALIYUN-HB2-E': '华北阿里云E区',
      'ALIYUN-HB2-F': '华北阿里云F区',
      'ALIYUN-HB2-G': '华北阿里云G区',
      'ALIYUN-HN': '华南阿里云',
      'ALIYUN-SZ': '深圳阿里云',
      'ALIYUN-HD': '华东阿里云',
    };

    const cols = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'key',
        dataIndex: 'name',
        key: 'name',
        render: (t, r) => {
          let tm = t.split('|');
          if (tm.length > 2) {
            return tm[1];
          }
          return t;
        },
      },
      {
        title: 'value',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '环境',
        dataIndex: 'env',
        key: 'env',
      },
      {
        title: '机房',
        dataIndex: 'idc_code',
        key: 'idc_code',
        render(t, r) {
          return IdcCodeMap[r.idc_code];
        },
      },
      {
        title: '资源类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '加密',
        dataIndex: 'is_show',
        key: 'is_show',
        render(t) {
          if (t === 2) {
            return <Icon type="lock" />;
          }
        },
      },
      {
        title: '使用次数',
        dataIndex: 'dep_num',
        key: 'dep_num',
      },
      {
        title: '备注',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        render(t, r) {
          return (
            <div>
              <a
                onClick={() => {
                  that.updateData = {
                    key: r.name,
                    value: r.value,
                    env: r.env,
                    type: r.type,
                    value_type: r.value_type,
                    desc: r.desc,
                    is_show: r.is_show === 2,
                    is_common: r.is_common === 2,
                    idc_code: r.idc_code,
                  };
                  that.setState({ selectID: r.id, showUpdate: true });
                }}
              >
                编辑
              </a>
            </div>
          );
        },
      },
      {
        title: '查看引用',
        dataIndex: 'point',
        key: 'point',
        render(t, r) {
          return (
            <div>
              <Button
                onClick={(e) => {
                  that.setState(
                    {
                      selectID: r.id * 1,
                      showDep: true,
                    },
                    () => {
                      that.getDepList();
                    },
                  );
                }}
              >
                应用依赖
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <Card>
          <Row style={{ marginBottom: '10px' }}>
            <Col span={4}>
              <Button
                onClick={(e) => {
                  this.query.clickTag++;
                  this.setState({
                    showAdd: true,
                  });
                }}
              >
                新增资源
              </Button>
              <span style={{ marginLeft: '10px' }}>
                <a
                  href="http://doc.xxxx.com/ddse/preview/share/1c38c1be067d8d65f5d8?sid=336&shareType=1"
                  target={'_blank'}
                >
                  资源中心文档
                </a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <SearchView
                params={this.query}
                onChange={(e) => {
                  this.query = Object.assign({}, this.query, e);
                  let { env, type, name, value, idc_code } = this.query;
                  that.setState(
                    {
                      env: env,
                      type: type,
                      queryKey: name,
                      value: value,
                      idc_code: idc_code,
                    },
                    () => {
                      that.getList();
                    },
                  );
                }}
              />
            </Col>
          </Row>
          <br />
          <Table columns={cols} dataSource={list} size={'small'} />
        </Card>

        <AddView
          show={this.state.showAdd}
          tag={{ env: this.query.env, type: this.query.type }}
          clickTag={this.query.clickTag}
          cancel={() => {
            this.setState({ showAdd: false });
          }}
          submit={this.addResource}
        />

        <UpdateView
          show={this.state.showUpdate}
          data={that.updateData}
          cancel={() => {
            this.setState({ showUpdate: false });
          }}
          submit={this.updateResource}
        />

        <AppDepView
          show={this.state.showDep}
          cancel={(e) => {
            this.setState({ showDep: false });
          }}
          list={this.state.depList}
        />

        <AppAuthView
          show={this.state.showAuth}
          cancel={(e) => {
            this.setState({ showAuth: false });
          }}
          res_id={this.state.selectID * 1}
        />
      </div>
    );
  }
}
