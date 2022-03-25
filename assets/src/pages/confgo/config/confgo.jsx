import {
  Input,
  message,
  Col,
  Row,
  Menu,
  Card,
  Tabs,
  Layout,
  Button,
  Icon,
  Spin,
  Table,
  Radio,
  Badge,
  Tooltip,
  Collapse,
  Popconfirm,
  Divider,
  Tag,
  Modal,
  Alert,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import React, { Component } from 'react';
const confirm = Modal.confirm;
import { getOpSapn } from './util/type';
import {
  ConfuAddItem,
  ConfuUpdateItem,
  ConfuDelItem,
  publishCmc,
  ConfuAddfile,
  ConfuUpdateNewItem,
  SyncConfigNodes,
  TomlContentFormat,
  SupervisorAction,
  ReloadEtcdWatch,
} from './service';

import NewItemForm from './views/newItem';
import UpdateItemForm from './views/updateItem';
import PublishForm from './views/publishItem';
import NewConfigFile from './views/newConfigFile';
import HistoryList from './views/historyList';
import Preview from './views/preview';
import RollbackView from './views/rollbackList';
import FileManageView from './views/fileManage';
import FileDiffView from './views/fileDiff';

import ReactCodeMirror from 'react-cmirror';
import 'codemirror/lib/codemirror.css';
import tomlcode from 'codemirror/mode/toml/toml';
import toml from 'toml';
import {
  PlusCircleOutlined,
  TableOutlined,
  FileOutlined,
  HddOutlined,
  FileDoneOutlined,
  QuestionCircleOutlined,
  CaretRightOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import './style/code.less';
import './style.less';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;
const Panel = Collapse.Panel;
const { TextArea } = Input;

@connect(({ confuNew, loading }) => ({
  app: confuNew.app,
  msg: confuNew.msg,
  apps: confuNew.apps,
  configList: confuNew.configList,
  file_path: confuNew.file_path,
  configText: confuNew.configText,
  commonText: confuNew.commonText,
  statusList: confuNew.statusList,
  resourceData: confuNew.resourceData,
  appConfigList: confuNew.appConfigList,
  configChangeList: confuNew.configChangeList,
  configHistoryList: confuNew.configHistoryList,
  // relatedList: confuNew.relatedList
}))
export default class Configserver extends React.Component {
  constructor(props) {
    super(props);
    this.configInputText = '';
    this.state = {
      caid: 0,
      aid: parseInt(this.props.aid),
      appName: this.props.appName,
      file_name: '',
      filterKey: '',
      tab: 'table',

      searchKey: '',
      showKeyFilter: false,
      searchValue: '',
      showValueFilter: false,

      selectItemID: 0,
      selectKey: '',
      selectValue: '',
      selectComment: '',
      selectIsResource: false,
      selectResourceID: 0,
      selectIsPublic: 0,

      showAddItem: false,
      showUpdateItem: false,
      showPublish: false,
      publish_loading: false,
      showConfigFile: false,
      showHistory: false,
      showPreview: false,
      showRollback: false,
      showFileManage: false,
      showFileDiff: false,

      readOnly: true,
      loading: false,

      instance_load: false,
      showStatusSync: false,
      env: this.props.env,
      zone_code: this.props.zoneCode,
      idcList: this.props.idcList,
    };
  }

  componentDidMount() {
    //todo aid发生变化时需要重新加载数据
    let { aid } = this.props;
    if (aid != undefined) {
      aid = aid * 1;
      this.setState({ aid: aid }, () => {
        this.getAppList().then((_) => {
          //获取配置列表
          this.autoChangeConfig(); //自动选择第一个配置文件
        });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // 切换应用，同步切换
    let newAid = parseInt(nextProps.aid);
    if (newAid !== this.state.aid && !isNaN(newAid) && newAid !== undefined && newAid !== 0) {
      this.setState({ aid: newAid, tab: 'text' }, () => {
        this.getAppList().then((_) => {
          //获取配置列表
          this.autoChangeConfig(); //自动选择第一个配置文件
        });
      });
    }
    if (nextProps.env !== this.state.env && nextProps.env !== undefined && nextProps.env !== '') {
      if (isNaN(this.state.aid)) {
        return;
      }
      this.setState({ env: nextProps.env, tab: 'text' }, () => {
        this.getAppList().then((_) => {
          //获取配置列表
          this.autoChangeConfig(); //自动选择第一个配置文件
        });
      });
    }
  }

  showConfirm = (action, zone_code, hostname) => {
    const that = this;
    const descMap = {
      start: {
        title: '确定启动应用进程吗？',
        content: `应用进程会被执行systemd start命令`,
      },
      restart: {
        title: '确定重启应用进程吗？',
        content: '应用进程会被执行systemd restart命令',
      },
      stop: {
        title: '确定停止应用进程吗？',
        content: '应用进程会被执行systemd stop命令',
      },
    };

    const desc = descMap[action] || {};
    confirm({
      title: desc.title,
      content: (
        <div>
          <p>{desc.content}</p>
          <h4>操作实例：</h4>
          <p>{hostname}</p>
        </div>
      ),
      onOk() {
        that.doAction(action, zone_code, hostname);
      },
      onCancel() { },
      okText: '确定',
      cancelText: '取消',
    });
  };

  //supervisor控制
  doAction = (action, zone_code, hostname) => {
    const { appName } = this.props;
    let app_name = appName;
    const hostList = [];
    hostList[0] = hostname;
    const tasks = hostList.map((host_name) => {
      return SupervisorAction({ app_name, zone_code, host_name, action });
    });
    this.setState({
      visible: true,
      loading: true,
    });
    //若是start stop restart则执行完成后需要执行status查看状态
    const handlerResult = (list) => {
      return list
        .reduce((a, b) => {
          return a.concat(b);
        })
        .map((v) => {
          return Object.keys(v).map((k) => {
            return {
              name: k,
              content: v[k],
            };
          });
        })
        .reduce((a, b) => {
          return a.concat(b);
        });
    };
    Promise.all(tasks)
      .then((list) => {
        if (list.length === 0) {
          message.error('没有操作权限，请联系管理员');
          return;
        } else if (list[0] == null) {
          message.error('没有操作权限，请联系管理员');
          return;
        }
        const result = handlerResult(list);
        this.setState({
          result_list: result,
        });
        const statusTasks = hostList.map((host_name) => {
          return SupervisorAction({
            app_name,
            zone_code,
            host_name,
            action: 'status',
          });
        });
        Promise.all(statusTasks).then((list) => {
          const statusResult = handlerResult(list);
          this.setState({
            result_list: result.concat(statusResult),
            loading: false,
          });
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          visible: false,
        });
        message.error(err.message);
      });
  };

  refreshState() {
    this.setState({
      showStatusSync: true,
    });
    SyncConfigNodes({ caid: this.state.caid })
      .then((rs) => {
        this.getConfigStatusList();
        message.success('同步成功');
        this.setState({
          showStatusSync: false,
        });
      })
      .catch((err) => {
        this.setState({
          showStatusSync: false,
        });
      });
  }

  //自动选择第一个配置文件
  autoChangeConfig = () => {
    const { appConfigList = [] } = this.props;
    const appInfo = appConfigList[0] || {};
    const { configs = [] } = appInfo;
    if (!configs[0]) {
      //置空配置
      this.props.dispatch({
        type: 'confuNew/setConfigReset',
      });
      this.setState({
        file_name: '',
        caid: 0,
        env: '',
        zone_code: this.props.zoneCode,
        format: '',
        readOnly: true,
      });
      return;
    }
    const { id: caid, file_name, zone_code, format, env } = configs[0] || {};
    this.setState(
      {
        file_name,
        caid,
        env: env,
        format,
        readOnly: true,
      },
      () => {
        //获取配置数据
        this.getConfigList();
      },
    );
  };

  //获取项目配置列表
  getAppList = () => {
    let { env, zone_code, appName } = this.props;
    return this.props.dispatch({
      type: 'confuNew/queryAppConfigs',
      payload: {
        aid: this.state.aid,
        env,
        zone_code: zone_code,
        app_name: appName,
      },
    });
  };

  //获取项目配置列表
  getConfigList = () => {
    const { caid } = this.state;
    this.props.dispatch({
      type: 'confuNew/queryConfig',
      payload: {
        caid,
      },
    });
    this.props.dispatch({
      type: 'confuResource/queryRelatedList',
      payload: {
        caid,
      },
    });
    this.setState({
      searchKey: '',
      searchValue: '',
    });
  };

  //选择对应配置文件
  changeAppConfig = (e) => {
    const { item, key, keyPath } = e;
    const [_, zone_code] = keyPath;

    // 解析caid和format
    let caid = 0;
    let env = '';
    let format = '';

    const arr = key.split('_');
    if (arr.length === 3) {
      caid = arr[0] * 1;
      env = arr[1];
      format = arr[2];
    }
    const file_name = item.props.children;

    this.setState(
      {
        file_name,
        caid,
        zone_code,
        env,
        format,
        readOnly: true,
        showStatusSync: true,
      },
      () => {
        this.getConfigList();

        //mark 性能优化
        setTimeout(() => {
          this.getConfigChangeList();
          this.getConfigStatusList();
          this.getHistoryList();
        }, 500);
      },
    );
  };

  changeTab = (e) => {
    this.setState({ tab: e });
    if (e === 'history') {
      this.getConfigChangeList();
    } else if (e === 'table' || e === 'text') {
      this.getConfigList();
    } else if (e === 'status') {
      const { caid } = this.state;
      this.setState({
        showStatusSync: true,
      });
      SyncConfigNodes({ caid: caid })
        .then((rs) => {
          this.getConfigStatusList();
          this.setState({
            showStatusSync: false,
          });
        })
        .catch((err) => {
          message.success('实例状态同步失败，请刷新');
          this.setState({
            showStatusSync: false,
          });
        });
    }
  };

  //发布历史
  getHistoryList = () => {
    const { caid } = this.state;
    return this.props.dispatch({
      type: 'confuNew/queryHistoryList',
      payload: { caid },
    });
  };

  //配置变更历史
  getConfigChangeList = () => {
    const { caid } = this.state;
    this.props.dispatch({
      type: 'confuNew/queryConfigChangeList',
      payload: { caid, page: 1, limit: 50 },
    });
  };

  //配置实例状态
  getConfigStatusList = () => {
    const { caid } = this.state;
    this.props.dispatch({
      type: 'confuNew/queryStatusList',
      payload: { caid },
    });
    this.setState({
      showStatusSync: false,
    });
  };

  //配置资源状态检查
  checkResource = () => {
    const { caid } = this.state;
    checkResourceConfig({ caid })
      .then((rs) => {
        if (rs.code === 0) {
          this.setState({
            resourceCheckList: rs.data,
          });
        }
      })
      .catch((err) => { });
  };

  addItem = (v) => {
    const { caid } = this.state;
    const { resource_id, key, value, comment, is_public, is_resource } = v;
    ConfuAddItem({ caid, key, value, comment, resource_id, is_public, is_resource }).then((rs) => {
      if (rs.code === 0) {
        message.success('添加成功');
        this.getConfigList();
        this.setState({
          showAddItem: false,
        });
      } else {
        message.error(rs.msg);
      }
    });
  };

  updateItem = (v) => {
    const { caid } = this.state;
    const { id, key, value, comment, resource_id, is_public } = v;
    ConfuUpdateItem({ id, caid, key, value, comment, resource_id, is_public }).then((rs) => {
      if (rs.code === 0) {
        message.success('更新成功');
        this.setState({
          showUpdateItem: false,
        });
        this.getConfigList();
      } else {
        message.success('更新失败' + rs.msg);
      }
    });
  };

  delItem = (v) => {
    const { id } = v;
    ConfuDelItem({ id }).then((rs) => {
      if (rs.code === 0) {
        message.success('删除成功');
        this.getConfigList();
      } else {
        message.success('删除失败');
      }
    });
  };

  publishItem = (v) => {
    this.setState({
      publish_loading: true,
    });
    const { caid } = this.state;
    const { message: msg } = v;
    publishCmc({ caid, message: msg }).then((rs) => {
      if (rs.code === 0) {
        message.success('发布成功');
        this.setState({
          showPublish: false,
        });
        this.getConfigList();
      } else {
        message.error('发布失败:' + rs.msg);
      }
      this.setState({
        publish_loading: false,
      });
    });
  };

  AddConfigFile = (v) => {
    let { aid, appName, env } = this.props;
    const { file_name, zone_code, file_typ } = v;
    ConfuAddfile({ aid: parseInt(aid), appName, env, zone_code, file_name, file_typ }).then(
      (rs) => {
        if (rs.code === 0) {
          message.success(`添加${file_name}成功`);
          this.setState({
            showConfigFile: false,
          });
          this.getAppList();
        } else {
          message.error('添加失败:' + rs.msg);
        }
      },
    );
  };

  saveText = (v) => {
    const { caid, format } = this.state;
    const text = this.configInputText;
    if (format === 'toml') {
      try {
        toml.parse(text);
      } catch (err) {
        return message.error('toml文件存在语法错误：' + err.message);
      }
    } else if (format === 'yml' || format === 'yaml') {
      try {
        const rs = yaml.parse(text);
        if (typeof rs === 'string' || Array.isArray(rs)) {
          return message.error('yaml文件存在语法错误：顶层元素需要为对象');
        }
      } catch (err) {
        return message.error('yaml文件存在语法错误：' + err.message);
      }
    } else if (format === 'json') {
      try {
        JSON.parse(text);
      } catch (err) {
        return message.error('json文件存在语法错误：' + err.message);
      }
    }

    //上报
    this.setState({
      loading: true,
    });
    ConfuUpdateNewItem({ caid, config_text: text })
      .then((rs) => {
        if (rs.code === 0) {
          message.success('保存成功');
          this.setState({ readOnly: true });
          this.getConfigList();
        } else {
          message.error('保存失败');
        }
        this.setState({
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
      });
  };

  filterByKey = (item) => {
    if (!this.state.searchKey || item.key.includes(this.state.searchKey)) {
      return true;
    }
    return false;
  };

  filterByValue = (item) => {
    if (!this.state.searchValue || item.value.includes(this.state.searchValue)) {
      return true;
    }
    return false;
  };

  //根据key对object进行排序
  sortObj = (obj, keys) => {
    const temp = {};
    const arr = keys
      .map((k) => {
        const val = obj[k];
        if (val) {
          return { [k]: val };
        }
      })
      .filter((v) => v)
      .forEach((item) => {
        Object.keys(item).forEach((k) => {
          temp[k] = item[k];
        });
      });
    return temp;
  };

  handleFileManage = () => {
    this.setState({
      showFileManage: true,
    });
  };

  handleFileDiff = () => {
    this.setState({
      showFileDiff: true,
    });
  };

  //获取指定环境的资源列表
  getEnvResource = () => {
    const { file_name, env, zone_code } = this.state;
    const { appId } = this.props;
    this.props.dispatch({
      type: 'confuNew/queryList',
      payload: {
        env: env,
        zone_code: zone_code,
        page: 1,
        limit: 1000,
        app_id: appId,
      },
    });
  };

  render() {
    const that = this;
    const {
      appId = 0,
      app = {},
      apps = [],
      configList = [],
      configText,
      commonText,
      appConfigList = [],
      configChangeList = [],
      statusList = [],
      configHistoryList = [],
      resourceData = {},
      appInfo: { aid, appName },
      msg,
      idcList,
      file_path = '',
      zoneCode,
    } = this.props;
    console.log('render -> configText', configText);

    const { users = [] } = app;
    const appInfo = appConfigList[0] || {};
    const {
      caid,
      file_name,
      format,
      env,
      filterKey,
      selectItemID,
      selectKey,
      selectValue,
      selectComment,
      selectIsResource,
      selectResourceID,
      selectIsPublic,
      fileDelModalVisible: showFileManage,
      fileDelConfirmLoading,
      result_list = [],
    } = this.state;
    const changeNum = configList.filter((v) => v.status * 1 !== 1).length;

    const leftCardStyle = {
      borderRadius: '4px',
      marginTop: '4px',
      marginLeft: '4px',
    };
    const statusMap = (t, status) => {
      const map = {
        1: <span></span>,
        2: <span>{getOpSapn('new')}</span>,
        3: <span>{getOpSapn('update')}</span>,
        4: <span>{getOpSapn('del')}</span>,
      };
      return map[status];
    };

    const changListCols = [
      {
        key: 'key',
        dataIndex: 'key',
        title: 'Block',
        width: 120,
        render(t, r) {
          return <span style={{ wordBreak: 'break-word' }}>{t}</span>;
        },
      },
      {
        key: 'op_type',
        dataIndex: 'op_type',
        title: '操作',
        width: 80,
        render(t) {
          const opMap = {
            1: getOpSapn('new', '新增'),
            2: getOpSapn('update', '更新'),
            3: getOpSapn('del', '删除'),
          };
          return <span>{opMap[t]}</span>;
        },
      },
      {
        key: 'old_value',
        dataIndex: 'old_value',
        title: '旧值',
        render(t) {
          let tmp = t;
          if (t.length > 200) {
            tmp = tmp.substring(0, 200) + '...';
          }
          return <span style={{ wordBreak: 'break-word' }}>{tmp}</span>;
        },
      },
      {
        key: 'new_value',
        dataIndex: 'new_value',
        title: '新值',
        render(t) {
          let tmp = t;
          if (t.length > 200) {
            tmp = tmp.substring(0, 200) + '...';
          }
          return <span style={{ wordBreak: 'break-word' }}>{tmp}</span>;
        },
      },
      {
        key: 'update_time',
        dataIndex: 'update_time',
        title: '时间',
        width: 180,
        render(t) {
          return moment(t * 1000).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        key: 'op_name',
        dataIndex: 'op_name',
        width: 180,
        title: '操作人',
      },
    ];

    const statusCol = [
      {
        key: 'is_use',
        dataIndex: 'is_use',
        title: (
          <span>
            配置状态
            <Tooltip
              title={`当前实例上的systemd配置文件项是否接入配置中心\n。若显示未接入，则需要修改systemd下发配置，路径改为配置中心提供的路径\n。若已经修改下发过，点击【同步实例状态】刷新。`}
            >
              <QuestionCircleOutlined style={{ marginLeft: '6px' }} />
            </Tooltip>
          </span>
        ),
        render(t) {
          return t ? getOpSapn('new', '已接入') : <div>{getOpSapn('del', '未接入')}</div>;
        },
      },
      {
        key: 'is_latest',
        dataIndex: 'is_latest',
        title: (
          <span>
            文件状态
            <Tooltip
              title={`当前实例上的配置文件是否为最新发布\n。若显示未同步，点击【刷新文件状态】。若刷新无效则需要【重新发布】一次。`}
            >
              <QuestionCircleOutlined style={{ marginLeft: '6px' }} />
            </Tooltip>
          </span>
        ),
        render(t) {
          return t ? getOpSapn('new', '已同步') : getOpSapn('del', '未同步');
        },
      },
      {
        key: 'is_effect',
        dataIndex: 'is_effect',
        title: (
          <span>
            配置状态
            <Tooltip title={`重启之后应用配置是否生效`}>
              <QuestionCircleOutlined style={{ marginLeft: '6px' }} />
            </Tooltip>
          </span>
        ),
        render(t) {
          return t ? getOpSapn('new', '已生效') : <div>{getOpSapn('del', '未生效')}</div>;
        },
      },
      {
        key: 'hostname',
        dataIndex: 'hostname',
        title: '实例名称',
      },
      {
        key: 'message',
        dataIndex: 'message',
        title: '提交日志',
      },
      {
        key: 'timestamp',
        dataIndex: 'timestamp',
        title: '文件同步时间/进程启动时间',
        render(t, r) {
          const { process_start_time = 0, is_latest, is_use } = r;
          if (process_start_time !== 0) {
            const syncTime = t * 1000;
            const startTime = process_start_time * 1000;
            //进程生效状态
            let process_start_status = null;
            if (syncTime > startTime) {
              //配置未完全生效
              process_start_status = (
                <Tooltip title={'配置文件已经同步完成，进程尚未重启生效'}>
                  <Icon type="clock-circle" style={{ color: 'orange' }} />
                </Tooltip>
              );
            } else if (is_latest && is_use) {
              // 配置文件已同步，进程已重启，生效
              process_start_status = (
                <Tooltip title={'最新配置已经生效'}>
                  <Icon type="check-circle" style={{ color: 'green' }} />
                </Tooltip>
              );
            }
            return (
              <div>
                <p>{moment(syncTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                <p>
                  {moment(startTime).format('YYYY-MM-DD HH:mm:ss')} {process_start_status}
                </p>
              </div>
            );
          }
          return (
            <div>
              <p>{moment(t * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          );
        },
      },
      {
        key: 'params',
        dataIndex: 'params',
        title: (
          <span>
            启动参数
            <Tooltip
              title={
                '当前实例上的systemd配置中的启动参数， ${ConfigDir}变量为配置中心默认下发路径。启动时间为进程启动时间。'
              }
            >
              <Icon style={{ marginLeft: '6px' }} type="question-circle" />
            </Tooltip>
          </span>
        ),
        render(t, r) {
          const paramsArr = t.split('/bin/%(program_name)s');
          if (paramsArr.length !== 2) {
            return t;
          }
          const params = paramsArr[1];
          return (
            <div>
              <p style={{ margin: 0 }}>{params}</p>
            </div>
          );
        },
      },
      {
        key: 'op',
        dataIndex: 'op',
        title: '操作',
        render(t, r) {
          const { pub_id, is_latest } = r;
          if (is_latest) {
            return (
              <div>
                <Button
                  style={{ color: 'black' }}
                  onClick={(e) => {
                    that.showConfirm('restart', this.state.zone_code, r.hostname);
                  }}
                >
                  重启
                </Button>
              </div>
            );
          }
        },
      },
    ];

    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 8,
      border: 0,
      overflow: 'hidden',
    };

    //文本编辑器options
    const options = {
      lineNumbers: true, //显示行号
      mode: { name: 'text/html' }, //定义mode
      theme: 'ambiance', //选中的theme
      lineWrapping: true,
    };

    if (msg === '权限错误') {
      return (
        <div style={{ marginTop: 10 }}>
          <Alert
            message="权限不足"
            description="对线上配置操作需要管理员权限"
            type="error"
            showIcon
          />
        </div>
      );
    }
    let idcArr = [];
    let zone_codeMap = [];

    idcList.forEach((element) => {
      idcArr.push(element.zone_code);
      zone_codeMap[element.zone_code] = element.zone_name;
    });

    const genHeader = (record) => (
      <div>
        <div className={'cube'}>
          {record.is_public == 0 && <Tag color="#2db7f5">私有</Tag>}
          {record.is_public == 1 && <Tag color="#f50">公有</Tag>}
          {record.is_public == 2 && <Tag color="#87d068">关联</Tag>}
        </div>
        <div className={'cube-title'}>
          <h3>{record.key}</h3>
        </div>
      </div>
    );

    const genExtra = (record) => (
      <div>
        {statusMap(record.key, record.status)}
        <Divider type="vertical" />
        {record.status != 4 && (
          <Tag
            color={'blue'}
            onClick={(event) => {
              event.stopPropagation();
              that.setState({
                selectItemID: record.id,
                selectKey: record.key,
                selectValue: record.value,
                selectComment: record.comment,
                selectIsResource: record.is_resource,
                selectResourceID: record.resource_id,
                selectIsPublic: record.is_public,
                showUpdateItem: true,
              });
              that.getEnvResource();
            }}
          >
            编辑
          </Tag>
        )}
        {record.status != 4 && (
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => {
              that.delItem({ id: record.id });
            }}
          >
            <Tag color={'red'}>删除</Tag>
          </Popconfirm>
        )}
      </div>
    );

    let configItemList = [];
    configList.forEach((element) => {
      configItemList.push(
        <Panel
          header={genHeader(element)}
          key={element.key}
          className="site-collapse-custom-panel"
          extra={genExtra(element)}
        >
          <ReactCodeMirror
            ref="editor"
            value={element.value}
            options={{
              mode: 'text/x-toml',
              lineNumbers: true,
              autoMatchParens: true,
              lineWrapping: false,
              readOnly: this.state.readOnly,
              scrollbarStyle: null,
            }}
          />
        </Panel>,
      );
    });

    return (
      <Layout>
        <Sider width={250} style={{ backgroundColor: 'transparent' }}>
          <Card style={leftCardStyle}>
            <p style={{ textAlign: 'left' }}>
              配置文件列表
              <Button
                style={{ marginLeft: '8px' }}
                size={'small'}
                type={'primary'}
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  this.setState({ showConfigFile: true });
                }}
              >
                添加配置
              </Button>
            </p>
            {appInfo && appInfo.configs ? (
              <Menu
                selectedKeys={[caid + '_' + env + '_' + format]}
                mode="inline"
                style={{ height: '50%', borderRight: 0 }}
                defaultOpenKeys={idcArr}
                onClick={this.changeAppConfig}
              >
                {Object.keys(this.sortObj(appInfo.files, idcArr)).map((zone_code) => {
                  if (zoneCode == 'all' || zoneCode == zone_code) {
                    return (
                      <Menu.SubMenu key={zone_code} title={<h4>{`${zone_codeMap[zone_code]}`}</h4>}>
                        {appInfo.files[zone_code].map((v) => {
                          console.log('this.state.zone_code', this.state.zone_code);
                          return (
                            <Menu.Item
                              style={{ paddingLeft: '20px' }}
                              key={v.id + '_' + v.env + '_' + v.format}
                            >
                              {v.file_name}
                            </Menu.Item>
                          );
                        })}
                      </Menu.SubMenu>
                    );
                  }
                })}
              </Menu>
            ) : (
              <div style={{ textAlign: 'left' }}>
                <Button type={'primary'} onClick={() => this.setState({ showConfigFile: true })}>
                  添加配置文件
                </Button>
              </div>
            )}
          </Card>
          <Card style={leftCardStyle}>
            <p style={{ textAlign: 'left' }}>文件管理</p>
            <Button type="primary" onClick={this.handleFileManage} style={{ marginLeft: '4px' }}>
              文件管理
            </Button>
            <Button type="primary" onClick={this.handleFileDiff} style={{ marginLeft: '4px' }}>
              文件对比
            </Button>
          </Card>
        </Sider>
        <Content>
          <div>
            {caid !== 0 && (
              <Row style={{ marginTop: '4px', marginLeft: '4px', marginRight: '4px' }}>
                <Col span={4} style={{ textAlign: 'left' }}>
                  <Button
                    style={{ float: 'left', marginRight: '6px' }}
                    onClick={(e) => {
                      //加载节点数据
                      this.getAppList().then((_) => {
                        //获取配置列表
                        this.autoChangeConfig(); //自动选择第一个配置文件
                        message.success('数据已更新');
                      });
                    }}
                  >
                    <Icon type="sync" />
                    刷新数据
                  </Button>
                  <Tooltip
                    title={`当前页面为静态页面，修改配置前需要刷新获取最新配置数据，以免覆盖其他人的配置数据`}
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Col>
                <Col span={20} style={{ textAlign: 'right' }}>
                  <Button.Group>
                    <Button
                      type={'primary'}
                      onClick={() => {
                        that.setState({ showPublish: true });
                      }}
                    >
                      发布配置
                    </Button>
                    <Button
                      type={'danger'}
                      onClick={(e) => {
                        that.changeTab('status');
                      }}
                    >
                      重启列表
                    </Button>
                    <Button
                      type={'primary'}
                      onClick={(e) => {
                        that.setState({ showRollback: true });
                      }}
                    >
                      配置回滚
                    </Button>
                    <Button
                      onClick={() => {
                        that.getHistoryList();
                        that.setState({ showHistory: true });
                      }}
                    >
                      发布历史
                    </Button>
                  </Button.Group>
                </Col>
              </Row>
            )}
            {caid !== 0 && (
              <Tabs
                style={{
                  backgroundColor: '#fff',
                  marginTop: '5px',
                  marginLeft: '5px',
                  marginRight: '5px',
                }}
                activeKey={this.state.tab}
                onChange={this.changeTab}
              >
                <TabPane
                  tab={
                    <span>
                      <div style={{ marginLeft: 10 }}>
                        <TableOutlined />
                        配置编辑
                      </div>
                    </span>
                  }
                  key="table"
                >
                  <Row>
                    <Col style={{ marginTop: '-5px' }}>
                      <Button.Group>
                        <Button
                          style={{ marginLeft: '10px' }}
                          type="primary"
                          onClick={() => {
                            that.setState({ showAddItem: true });
                            that.getEnvResource();
                          }}
                        >
                          添加 Block
                        </Button>
                      </Button.Group>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24} style={{ marginTop: '10px' }}>
                      <Collapse
                        bordered={false}
                        defaultActiveKey={['application']}
                        expandIcon={({ isActive }) => (
                          <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                        className="site-collapse-custom-collapse"
                        expandIconPosition="right"
                      >
                        {configItemList}
                      </Collapse>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <FileOutlined />
                      发布预览
                    </span>
                  }
                  key="text"
                >
                  <Spin spinning={this.state.loading} />
                  <Row>
                    <Col
                      style={{
                        textAlign: 'left',
                        marginLeft: '8px',
                        marginBottom: '8px',
                        fontSize: '18px',
                      }}
                      span={12}
                    >
                      {file_name}
                    </Col>
                    <Col
                      style={{
                        textAlign: 'right',
                        marginRight: '8px',
                        marginBottom: '8px',
                      }}
                      span={11}
                    >
                      <Button.Group>
                        <span>
                          <Button
                            onClick={(e) => {
                              copy(configText);
                              message.success('已复制到剪切板');
                            }}
                          >
                            复制
                          </Button>
                        </span>
                      </Button.Group>
                    </Col>
                  </Row>
                  <div className={'configEditor'}>
                    <ReactCodeMirror
                      ref="editor"
                      value={configText}
                      options={{
                        mode: 'text/x-toml',
                        lineNumbers: true,
                        autoMatchParens: true,
                        lineWrapping: true,
                        readOnly: this.state.readOnly,
                      }}
                      onChange={(editor, data, value) => {
                        this.configInputText = editor.getValue();
                      }}
                    />
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <FileDoneOutlined />
                      <Badge count={changeNum} overflowCount={9999} offset={[0, 18]}>
                        变更历史
                      </Badge>
                    </span>
                  }
                  key="history"
                >
                  <Table
                    columns={changListCols}
                    dataSource={configChangeList}
                    size={'small'}
                    pagination={false}
                    rowKey={'id'}
                  />
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <HddOutlined />
                      实例列表
                    </span>
                  }
                  key="status"
                >
                  <Spin spinning={this.state.showStatusSync} />
                  <div style={{ marginLeft: '10px' }}>
                    配置文件路径:
                    <span
                      style={{
                        marginLeft: '8px',
                        marginRight: '8px',
                        fontSize: '16px',
                      }}
                    >{`${file_path}`}</span>
                    <a
                      onClick={(e) => {
                        copy(`${file_path}`);
                        message.success('已复制，请重新下发配置文件生效');
                      }}
                    >
                      点击复制
                    </a>
                    <Tooltip
                      title={`修改systemd下发的配置文件路径，由原来的项目相对路径改为配置中心的路径`}
                    >
                      <Icon style={{ marginLeft: '6px' }} type="question-circle" />
                    </Tooltip>
                    <span
                      style={{
                        float: 'right',
                        marginRight: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <Button
                        type={'primary'}
                        onClick={(e) => {
                          that.setState({
                            showStatusSync: true,
                          });
                          SyncConfigNodes({ caid: caid })
                            .then((rs) => {
                              that.getConfigStatusList();
                              message.success('同步成功');
                              that.setState({
                                showStatusSync: false,
                              });
                            })
                            .catch((err) => {
                              that.setState({
                                showStatusSync: false,
                              });
                            });
                        }}
                      >
                        刷新实例状态
                      </Button>
                    </span>
                    <Table
                      size="small"
                      columns={statusCol}
                      dataSource={statusList}
                      pagination={false}
                    />
                  </div>
                </TabPane>
              </Tabs>
            )}

            <NewItemForm
              show={this.state.showAddItem}
              cancel={() => {
                this.setState({ showAddItem: false });
              }}
              item={{
                resourceData: resourceData,
              }}
              env={this.state.env}
              zone_code={this.state.zone_code}
              submit={this.addItem}
              caid={this.state.caid}
              zone_codeMap={zone_codeMap}
            />

            <UpdateItemForm
              show={this.state.showUpdateItem}
              env={this.state.env}
              zone_code={this.state.zone_code}
              cancel={() => {
                this.setState({ showUpdateItem: false });
              }}
              changeResource={(e) => {
                that.setState({
                  selectIsResource: e,
                });
              }}
              changeResourceID={(e) => {
                that.setState({
                  selectResourceID: e * 1,
                });
              }}
              caid={this.state.caid}
              submit={this.updateItem}
              item={{
                id: selectItemID,
                key: selectKey,
                value: selectValue,
                comment: selectComment,
                is_resource: selectIsResource,
                resource_id: selectResourceID,
                resourceData: resourceData,
                is_public: selectIsPublic,
              }}
              zone_codeMap={zone_codeMap}
            />

            <PublishForm
              show={this.state.showPublish}
              publish_loading={this.state.publish_loading}
              file_name={file_name}
              item={{ caid }}
              cancel={() => {
                this.setState({ showPublish: false });
              }}
              submit={this.publishItem}
            />

            <NewConfigFile
              show={this.state.showConfigFile}
              cancel={() => {
                this.setState({ showConfigFile: false });
              }}
              submit={this.AddConfigFile}
              zoneList={this.props.zoneList}
            />

            <HistoryList
              show={this.state.showHistory}
              cancel={() => {
                this.setState({ showHistory: false });
                this.props.dispatch({
                  type: 'confuNew/setPublishChangeData',
                  payload: {},
                });
              }}
              list={configHistoryList}
            />

            <Preview
              oldCode={configText}
              newCode={this.configInputText}
              show={this.state.showPreview}
              cancel={() => {
                this.setState({ showPreview: false });
              }}
            />

            {this.state.showRollback && (
              <RollbackView
                caid={caid}
                show={this.state.showRollback}
                rollback={() => {
                  that.getConfigList();
                }}
                cancel={() => {
                  this.setState({ showRollback: false });
                }}
              />
            )}
            <FileManageView
              show={this.state.showFileManage}
              app_name={appName}
              app_id={aid}
              env={env}
              zone_code={this.state.zone_code}
              cancel={() => {
                this.setState({ showFileManage: false }, () => {
                  this.autoChangeConfig;
                });
              }}
            />
            <FileDiffView
              show={this.state.showFileDiff}
              originCid={this.state.caid}
              rafeCid={0}
              appConfigList={this.props.appConfigList}
              cancel={() => {
                this.setState({ showFileDiff: false });
              }}
            />
          </div>
        </Content>
        <Modal
          title="操作面板"
          visible={this.state.visible}
          onOk={(e) => {
            this.refreshState();
            this.setState({ visible: false, result_list: [] });
          }}
          okText={'确定'}
          onCancel={(e) => {
            this.refreshState();
            this.setState({ visible: false, result_list: [] });
          }}
          cancelText={'关闭'}
        >
          <div>
            <Spin spinning={this.state.loading} />
          </div>
          <div style={{ backgroundColor: 'black', borderRadius: '5px' }}>
            {result_list.map((v, i) => {
              const { name, content } = v;
              return (
                <p key={i} style={{ color: 'green' }}>
                  {content}
                </p>
              );
            })}
          </div>
        </Modal>
      </Layout>
    );
  }
}
// export default CSSModules(Index, styles)
