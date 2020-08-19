import React from 'react';
import {
  AutoComplete,
  Button,
  Cascader,
  Descriptions,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Spin,
  Tabs,
  Tag,
  Tree
} from 'antd';
import {
  DeleteOutlined,
  FileAddOutlined,
  LinkOutlined,
  PlusOutlined,
  RocketOutlined,
  SettingOutlined
} from '@ant-design/icons'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/duotone-light.css';
import {History} from './components'
import styles from './index.less';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import UseCaseMenu from "./components/UseCaseMenu";
import SettingDialog from "./components/SettinngDialog";
import {stringify} from 'qs';
import KeyValueEditor from "./components/KeyValueEditor";
import ServiceBindDialog from "./components/ServiceBindDialog";
import {bindProtoToApp} from "@/services/grpctest";
import MonacoEditor from "react-monaco-editor";
import ScrollArea from 'react-scrollbar'

const {DirectoryTree, TreeNode} = Tree;

const DefaultScript = `
// 发出请求之前被调用
test.preRequest = function() {
    // your code
}

// 请求后被调用
test.onResponse = function(data) {
    // your code
}
`

@connect(({grpcDebugModel, app}) => ({
  ...grpcDebugModel,
  appList: app.list || []
}))
export default class GrpcDebug extends React.Component {

  form = React.createRef()
  payloadEditor = null
  scriptEditor = null

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    document.onkeydown = null;
  }

  componentDidMount() {
    const {dispatch, user_cases, location, selected_service} = this.props;
    const {query} = location;

    document.onkeydown = (event) => {
      if (event.key.toLowerCase() === 's' && event.ctrlKey) {
        this.onSave();
        event.preventDefault();
        return false;
      }
      return true;
    };

    let service = [];
    if (query.app && query.service) {
      service = [query.app, query.service];
    }

    if (query.listTab) {
      this.onTabChange(query.listTab)
    }

    dispatch({
      type: 'grpcDebugModel/loadProtoList',
    });

    dispatch({
      type: 'app/fetch',
      payload: {
        page: 1,
        pageSize: 5000
      }
    });

    dispatch({
      type: 'grpcDebugModel/loadAppServiceTree'
    }).then(res => {
      if (service.length !== 2 && res.code === 0 && res.data.length > 0 && selected_service.length === 0) {
        // 首次加载
        service = [res.data[0].app_name, res.data[0].services[0].id]
      }
      if (service.length === 2) this.onChangeService(service);
      else if (selected_service.length === 2) {
        this.refreshURL({
          app: selected_service[0],
          service: selected_service[1]
        })
      }
    });
  }

  refreshURL = (payload) => {
    const {location, dispatch} = this.props;
    let query = location.query || {};
    dispatch(routerRedux.push({
      search: stringify({
        ...query,
        ...payload
      })
    }));
  };

  /**
   * 切换服务的时候
   * @param service ["app_name", service_id]
   */
  onChangeService = (service) => {
    const {dispatch, match, location} = this.props;
    console.log("select service", service)

    let query = location.query || {};
    query.app = service[0];
    query.service = service[1];
    dispatch(routerRedux.push({
      search: stringify(query)
    }));
    dispatch({
      type: 'grpcDebugModel/loadUserCases',
      payload: {
        appName: service[0],
        serviceID: service[1]
      }
    });

  };

  onSelectUserCaseTree = (selectedKeys, e) => {
    const {dispatch, form} = this.props;
    let selectedKey = selectedKeys[0];
    let matches = selectedKey.match(/^(\w+):(\w+)$/);
    if (matches.length !== 3) {
      console.error("invalid selected key:" + selectedKey);
      return
    }
    let type = matches[1];
    let id = matches[2];
    switch (type) {
      case 'method':
        return;
      case 'case':
        this.loadUserCase(id);
        break;
      case 'new':
        dispatch({
          type: 'grpcDebugModel/newUseCase',
          payload: {id}
        }).then(res => {
          this.form.current.setFieldsValue({
            case_name: this.props.editor.form.case_name,
            metadata: ''
          });
        });
        break;
      default:
    }
    dispatch({
      type: 'grpcDebugModel/changeSelectedUserCase',
      payload: selectedKey
    });
  };

  loadUserCase = (id) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'grpcDebugModel/loadUseCase',
      payload: {
        id
      }
    }).then(res => {
      this.form.current.setFieldsValue({
        case_name: this.props.editor.form.case_name,
        metadata: this.props.editor.form.metadata,
      });
    })
  };

  onGrpcInputChange = (val) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'grpcDebugModel/updateCaseInput',
      payload: val
    })
  };

  onTestScriptChange = val => {
    const {dispatch} = this.props;
    dispatch({
      type: 'grpcDebugModel/updateCaseScript',
      payload: val
    })
  }

  onSendRequest = () => {
    const {form, editor, dispatch, selected_service} = this.props;
    let method_id = editor.form.method_id;
    if (!method_id) {
      message.error("请先创建/选择用例");
      return;
    }

    this.form.current.validateFields().then((fields) => {
      console.log(fields);
      if (!fields.address) {
        message.error("请输入地址");
        return;
      }
      let inputObj;
      try {
        inputObj = JSON.parse(editor.form.input);
      } catch (e) {
        message.error("无效的JSON格式");
        return;
      }
      let payload = {
        name: fields.case_name,
        method_id: method_id,
        input: JSON.stringify(inputObj),
        address: fields.address,
        metadata: editor.form.metadata,
        script: editor.form.script
      };
      dispatch({
        type: 'grpcDebugModel/sendRequest',
        payload: payload
      })
    });
  };

  onSave = () => {
    const {form, editor, dispatch, selected_service} = this.props;
    if (selected_service.length !== 2) message.error("未选择服务");
    this.form.current.validateFields().then((fields) => {
      let payload = {
        name: fields.case_name,
        method_id: editor.form.method_id,
        input: editor.form.input,
        metadata: editor.form.metadata,
        script: editor.form.script
      };
      let prom;
      if (editor.form.id) {
        // 更新
        payload.id = editor.form.id;
        prom = dispatch({
          type: 'grpcDebugModel/updateUserCase',
          payload: payload
        });
      } else {
        // 新增
        prom = dispatch({
          type: 'grpcDebugModel/createUserCase',
          payload: payload
        })
      }
      prom.then(res => {
        // load user-case-list
        dispatch({
          type: 'grpcDebugModel/loadUserCases',
          payload: {
            appName: selected_service[0],
            serviceID: selected_service[1]
          }
        });
      })
    });
  };

  onUserCaseTreeRightClicked = ({event, node}) => {
    const {dispatch} = this.props;
    let nodeKey = node.props.eventKey;
    if (!nodeKey) {
      return;
    }
    let matches = nodeKey.match(/^(\w+):(\w+)$/);
    let nodeType = matches[1];
    let nodeId = matches[2];
    if (nodeType === 'case') {
      UseCaseMenu.show([
        {
          label: '删除',
          icon: <DeleteOutlined/>,
          onClick: () => this.handleDeleteUserCase(nodeId)
        }
      ])
    }
  };

  handleDeleteUserCase = (id) => {
    const {dispatch, selected_service} = this.props;
    Modal.confirm({
      title: '确认删除?',
      content: '确认删除该用例吗？删除后无法恢复',
      okText: '是的',
      cancelText: '我再想想',
      onCancel: () => {
      },
      onOk: () => {
        dispatch({
          type: 'grpcDebugModel/deleteUserCase',
          payload: {
            id
          }
        }).then(() => {
          dispatch({
            type: 'grpcDebugModel/loadUserCases',
            payload: {
              appName: selected_service[0],
              serviceID: selected_service[1]
            }
          })
        })
      },
    })
  };

  onTabChange = (tab) => {
    const {dispatch, selected_service} = this.props;
    dispatch({type: 'grpcDebugModel/changeTab', payload: tab});
    this.setState({})

    this.refreshURL({
      listTab: tab
    });

  };

  onSelectPublicCase = (selectedKeys) => {
    const {dispatch} = this.props;
    let key = selectedKeys[0];
    dispatch({
      type: 'grpcDebugModel/loadPublicCase',
      payload: key
    });
  };

  onSaveSettings = (values) => {
    console.log(values)
    this.props.dispatch({
      type: 'grpcDebugModel/saveSettings',
      payload: values
    });
  };

  onShowSettingDialog = () => {
    this.props.dispatch({
      type: 'grpcDebugModel/loadSettings'
    });
    this.props.dispatch({
      type: 'grpcDebugModel/showSettings',
      payload: true
    })
  };

  onShowServiceBindDialog = (visible = true) => {
    this.props.dispatch({
      type: 'grpcDebugModel/showServiceBindDialog',
      payload: visible
    })
  };

  onBindAppService = (fields) => {
    let that = this
    bindProtoToApp(fields)
      .then(res => {
        if (res.code !== 0) {
          message.error(res.msg);
          return;
        } else {
          message.success("绑定成功");
          this.onShowServiceBindDialog(false);

          that.props.dispatch({
            type: 'grpcDebugModel/loadAppServiceTree'
          });
        }
      })
  };

  onMetadataChange = (data) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'grpcDebugModel/updateMetadata',
      payload: data
    });
    // FIXME: 不知道为什么Props更新了但是没有被重新渲染，只能用这种猥琐方法了
    this.setState({});
  };

  render() {
    const {
      app_service_tree,
      use_cases,
      editor,
      selected_user_case,
      node_addr_list,
      selected_service,
      right_menu_visible,
      right_menu_position,
      right_menu,
      dispatch,
      response,
      active_tab,
      selected_history_id,
      public_cases,
      settings,
      setting_dialog_visible,
      service_bind_dialog_visible,
      proto_list,
      appList,
      use_case_loading
    } = this.props;
    let addrOptions = node_addr_list?.hosts ? node_addr_list.hosts.filter(i => i.env !== 'prod' && i.env !== 'gray').map(item => {
      return <AutoComplete.Option key={item.addr} value={item.addr + ':' + node_addr_list.port}>
        <Tag>{item.env}</Tag>
        <span>{item.addr}:{node_addr_list.port}</span>
      </AutoComplete.Option>
    }) : [];
    if (settings && settings.localhost) {
      addrOptions.push(<AutoComplete.Option key={settings.localhost}
                                            value={settings.localhost + ':' + node_addr_list.port}>
        <Tag>local</Tag>
        <span>{settings.localhost}:{node_addr_list.port}</span>
      </AutoComplete.Option>)
    }

    let metadata = editor.form.metadata || [];
    if (!(metadata instanceof Array)) {
      try {
        metadata = JSON.parse(metadata);
      } catch (e) {
        metadata = [];
      }
    }

    return <div className={styles.debugPage}>
      <div className={styles.layoutHeader}>
        <Cascader
          showSearch
          value={selected_service}
          className={styles.serviceCascader}
          displayRender={(labels) => {
            return labels.join('/')
          }}
          placeholder="切换服务"
          options={(app_service_tree || []).map(app => {
            return {
              label: app.app_name,
              value: app.app_name,
              children: (app.services || []).map(service => {
                return {
                  value: '' + service.id,
                  label: service.name
                }
              })
            }
          })}
          onChange={this.onChangeService}
        />
        <Button shape="circle" icon={<SettingOutlined/>} className={styles.settingButton}
                onClick={this.onShowSettingDialog}/>

        <Button shape="circle" icon={<LinkOutlined/>} className={styles.bindServiceButton}
                onClick={this.onShowServiceBindDialog}/>
      </div>
      <div className={styles.main}>
        <div
          className={styles.layoutSider}>
          <Tabs
            type={"card"}
            className={styles.leftTabs}
            activeKey={active_tab}
            onChange={this.onTabChange}
            renderTabBar={(props, DefaultTabBar) => {
              return <DefaultTabBar {...props} style={{
                backgroundColor: 'rgb(250,250,250)',
                padding: '10px 0 0 10px',
                margin: '0',
                flex: '0 0 50px'
              }}/>
            }}>
            <Tabs.TabPane key="history" tab="History">
              {active_tab === 'history' ? (
                <History
                  selectedService={selected_service}
                  onChange={(id) => {
                    dispatch({type: 'grpcDebugModel/loadHistoryItem', payload: id}).then(res => {
                      if (res.code === 0) {
                        this.form.current.setFieldsValue({
                          case_name: editor.form.case_name,
                          address: res.data.addr,
                        })
                      }
                    })
                  }}
                  activeId={selected_history_id}
                />
              ) : null}
            </Tabs.TabPane>
            <Tabs.TabPane key="api" tab="API">
              <ScrollArea style={{height: '830px'}}>
                <DirectoryTree
                  onRightClick={this.onUserCaseTreeRightClicked}
                  defaultExpandAll
                  onSelect={this.onSelectUserCaseTree}
                  selectedKeys={[selected_user_case]}
                  style={{marginTop: '10px'}}
                >
                  {(use_cases || []).map((method, id) => {
                    return <TreeNode
                      title={method.description ?
                        <Popover content={method.description}>{method.name}</Popover> : method.name
                      }
                      key={`method:${method.id}`}>
                      <TreeNode
                        icon={<PlusOutlined/>}
                        key={`new:${method.id}`}
                        title="New" isLeaf/>
                      {method.use_cases ? method.use_cases.map((tc, id) => {
                        return <TreeNode title={tc.name} key={`case:${tc.id}`} isLeaf/>
                      }) : null}
                    </TreeNode>
                  })}
                </DirectoryTree>
              </ScrollArea>
            </Tabs.TabPane>
          </Tabs>
        </div>

        {editor.form.method_id ? <Spin spinning={use_case_loading} wrapperClassName={styles.formSpin}>
            {this.renderForm(editor, addrOptions, metadata, response)}
          </Spin>
          : <div style={{flex: '1 1 auto', padding: '100px'}}>
            <Empty desciption={"请选择用例"}/>
          </div>}
      </div>

      <SettingDialog
        onCancel={() => {
          dispatch({
            type: 'grpcDebugModel/showSettings',
            payload: false,
          })
        }}
        settings={settings}
        onSave={this.onSaveSettings}
        visible={setting_dialog_visible}
      />

      <ServiceBindDialog
        visible={service_bind_dialog_visible}
        protoList={proto_list}
        appList={appList}
        onSubmit={this.onBindAppService}
        onCancel={() => {
          dispatch({
            type: 'grpcDebugModel/showServiceBindDialog',
            payload: false,
          })
        }}
      />

    </div>
  }

  renderForm(editor, addrOptions, metadata, response) {
    const {request_loading} = this.props
    return <Form ref={this.form} className={styles.layoutContent}>
      <div className={styles.caseNameLine}>
        <Form.Item rules={[{required: true}]} name={"case_name"} initialValue={editor.form.case_name}>
          <Input placeholder="请输入用例名称" addonBefore={"Name"}/>
        </Form.Item>
        <Popover content="Ctrl-S">
          <Button icon={<FileAddOutlined/>} onClick={this.onSave}>Save</Button>
        </Popover>
      </div>
      <div className={styles.caseAddrLine}>
        <Form.Item name={"address"}>
          <AutoComplete
            optionLabelProp="value"
            dataSource={addrOptions}
          >
            <Input addonBefore={"Address"} placeholder="请输入地址"/>
          </AutoComplete>
        </Form.Item>
        <Button icon={<RocketOutlined/>} type="primary" loading={request_loading} onClick={this.onSendRequest}>Send</Button>
      </div>
      <div className={styles.basicInfoLine}>
        <Descriptions bordered size="small">
          <Descriptions.Item label="App">{editor.info.app_name}</Descriptions.Item>
          <Descriptions.Item label="Service">{editor.info.service_name}</Descriptions.Item>
          <Descriptions.Item label="Method">{editor.info.method_name}</Descriptions.Item>
        </Descriptions>
      </div>

      <div className={styles.inputOutputLayout}>
        <div className={styles.inputContainer}>
          <Tabs
            className={styles.inputTabs}
            tabBarStyle={{height: '100%'}}
            defaultActiveKey={"payload"}
            onChange={tab => {
              let dimension = {width: '100%', height: 'auto'}
              setTimeout(() => {
                switch (tab) {
                  case 'payload':
                    this.payloadEditor?.layout()
                    break
                  case 'script':
                    this.scriptEditor?.layout()
                    break
                }
              })
            }}
            renderTabBar={(props, DefaultTab) => {
              return <DefaultTab
                {...props}
                style={{
                  padding: '0 10px',
                  margin: '0',
                  backgroundColor: 'rgb(250,250,250)'
                }}
              />
            }}
          >
            <Tabs.TabPane tab={"Payload"} key={"payload"}>
              <div className={styles.grpcPayload}>
                <MonacoEditor
                  width={"100%"}
                  height={"663px"}
                  value={editor.form.input}
                  onChange={val => {
                    this.onGrpcInputChange(val)
                  }}
                  language={"json"}
                  theme={"vs"}
                  options={{
                    automaticLayout: true
                  }}
                  editorDidMount={editor => {
                    this.payloadEditor = editor
                  }}
                />
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab={"Metadata"} key={"metadata"}>
              <div className={styles.metadataInputLine}>
                <KeyValueEditor
                  data={metadata}
                  onChange={this.onMetadataChange}
                />
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab={"Test Script"} key={"script"}>
              <MonacoEditor
                width={"100%"}
                height={"663px"}
                value={editor.form.script || DefaultScript}
                language={"javascript"}
                theme={"vs"}
                onChange={val => {
                  this.onTestScriptChange(val)
                }}
                editorDidMount={editor => {
                  this.scriptEditor = editor
                }}
              />
            </Tabs.TabPane>
          </Tabs>

        </div>
        <div className={styles.outputContainer}>
          <Tabs
            className={styles.outputTabs}
            tabBarStyle={{height: '100%'}}
            defaultActiveKey={"response"}
            renderTabBar={(props, DefaultTab) => {
              return <DefaultTab
                {...props}
                style={{
                  padding: '0 10px',
                  margin: '0',
                  backgroundColor: 'rgb(250,250,250)'
                }}
              />
            }}
          >
            <Tabs.TabPane tab={"Response"} key={"response"}>
              <div className={styles.responseContainer}>
                {response === null ? (
                  <div style={{textAlign: 'center', padding: '40px', color: '#c3c3c3'}}>
                    <RocketOutlined style={{fontSize: "48px"}}/>
                    <p style={{marginTop: '20px'}}>发起请求获取响应</p>
                  </div>
                ) : (
                  <Spin spinning={request_loading}>
                    <div
                      className={styles.responseStatusBar + (response.status === 'success' ? '' : ' ' + styles.responseStatusBarFail)}>
                      <span className={styles.statusBlock}>
                        <span>Test: </span>
                        <span>
                          {response.test_passed ? <span className={styles.statusSuccess}>passed</span>
                            : <span className={styles.statusFail}>failed</span>}
                        </span>
                      </span>
                      <span className={styles.statusBlock}>
                        <span>Status: </span>
                        <span>
                          {response.status === "success" ?
                            <span className={styles.statusSuccess}>success</span>
                            : <span className={styles.statusFail}>fail</span>}
                        </span>
                      </span>
                      <span className={styles.statusBlock}>
                        <span>Time: </span>
                        <span className={styles.statusSuccess}>
                          {response.time_cost}ms
                        </span>
                      </span>
                    </div>
                    {response.status === "success" ? (
                      // 成功
                      <div className={styles.responseSuccess}>
                        <MonacoEditor
                          width={"100%"}
                          height={"621px"}
                          value={response.output}
                          language={"json"}
                          theme={"vs"}
                          options={{
                            readOnly: true,
                            automaticLayout: true
                          }}
                        />
                      </div>
                    ) : (
                      // 失败
                      <div className={styles.responseFail}>
                        <Tag color="red">error</Tag>
                        {response.error}
                      </div>
                    )}
                  </Spin>
                )}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab={"Logs"} key={"logs"}>
              {(response?.logs && Object.keys(response?.logs).length) ?
                <Descriptions size={"small"} bordered style={{margin: '10px'}}>
                  {Object.keys(response?.logs || {}).map((key, idx) => {
                    return <Descriptions.Item label={key} key={idx} span={24}>
                      {response.logs[key]}
                    </Descriptions.Item>
                  })}
                </Descriptions> : <Empty style={{margin: '10px'}}/>}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>

    </Form>;
  }
}
