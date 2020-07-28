import React from 'react';
import {Button, Card, Form, Input, List, message, Popconfirm, Radio, Tag} from 'antd';
import {checkDep, getSysConfig, installDep} from './services';
import SettingBlock from "@/pages/manage/SettingBlock";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {connect} from 'dva';
import GatewaySetting from "@/pages/manage/GatewaySetting";
import GrafanaSetting from "@/pages/manage/GrafanaSetting";

const {TextArea} = Input;
const RadioGroup = Radio.Group;

const sysTypeList = [{name: "设置配置依赖解析时间（分钟）", value: 1}, {name: "监控展示Grafana地址", value: 2}]

@connect(({setting}) => ({
  ...setting
}))
export default class SysManage extends React.Component {
  constructor(props) {
    super(props);
    this.grafanaFormRef = React.createRef()
    this.configDepFormRef = React.createRef()
    this.state = {
      checkRes: '',
      depRes: [],
      sysType: 1,
      setInt: 0,
      setStr: '',
      sysConfig: [],
      opType: 0,
      monitorAddr: '',
      loading: false,
      isEdit: false,
      isAdd: false,
      sysTag: 1,
      setCate: '',
      id: 0,
    };
  }

  componentDidMount() {
  }

  componentWillMount() {
    this.GetCheckDep();
    this.GetSysConfig();
    this.loadSettings().then(r => {
      this.grafanaFormRef.current && this.grafanaFormRef.current.resetFields()
      this.configDepFormRef.current && this.configDepFormRef.current.resetFields()
    })
  }

  loadSettings() {
    return this.props.dispatch({
      type: 'setting/loadSettings'
    })
  }

  GetCheckDep = () => {
    checkDep().then((res) => {
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

  GetSysConfig = () => {
    getSysConfig({sysType: 1}).then((res) => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }
      this.setState({
        sysConfig: res.data,
      });
      return true;
    });
  };

  handleCheckLog = (e) => {
    console.log('click', e);
    const {} = this.state;
    // 耗时比较久,所以这里要loading
    this.enterLoading();
    installDep({installType: e * 1}).then(rs => {
      const {code, msg, data} = rs;
      if (code === 0) {
        message.success('安装成功：', msg);
        this.GetCheckDep();
      } else {
        message.error('安装失败:' + msg);
      }
      this.stopLoading();
    });
  };

  enterLoading = () => {
    this.setState({loading: true});
  };

  stopLoading = () => {
    this.setState({loading: false});
  };

  setEdit = (name, value) => {
    console.log("setEdit", name, value)
    this.props.dispatch({
      type: 'setting/setEdit',
      payload: {
        name,
        value
      },
    }).then(() => {
      this.setState({})

      this.grafanaFormRef.current.resetFields()
    })
  }

  saveSetting = (name, content) => {
    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name,
        content
      },
    }).then(() => {
      this.props.dispatch({
        type: 'setting/loadSettings',
      })
    })
  }

  render() {
    const {depRes = [], loading} = this.state;
    const {grafanaConfig} = this.props;

    return (
      <PageHeaderWrapper>
        <Card>
          <SettingBlock title={'PProf环境检测'} editable={false}>
            <List
              grid={{gutter: 16, column: 4}}
              dataSource={depRes}
              renderItem={item => (
                <List.Item>
                  <Card title={item.name} style={{height: '160px'}}>
                    {item.check_res === 1 && <Tag color="green" key={2}>
                      已安装
                    </Tag>}
                    {item.check_res === 0 && <Tag color="geekblue" key={1}>
                      未安装
                    </Tag>}
                    <div style={{paddingTop: '10px'}}>
                      <Popconfirm
                        placement="rightBottom"
                        title={'该操作有一定的延迟，确认操作？'}
                        onConfirm={() => {
                          this.handleCheckLog(item.can_install);
                        }}
                        okText="Yes"
                        cancelText="No"
                        disabled={!(item.check_res === 0 && item.can_install > 0)}
                      >
                        {/* <Button disabled={!(item.check_res === 0 && item.can_install > 0)} type="primary"
                                loading={loading}>安装</Button> */}
                      </Popconfirm>
                    </div>
                  </Card>
                </List.Item>
              )}
            >
            </List>
          </SettingBlock>

          <SettingBlock
            title={"Grafana设置"}
            editable={true}
            edit={this.props.onEdit.grafana}
            onEdit={() => this.setEdit("grafana", true)}
            onCancel={() => this.setEdit("grafana", false)}
            onSave={() => {
              this.grafanaFormRef.current.submit()
            }}
          >
            <Form
              ref={this.grafanaFormRef}
              labelCol={{span: 3}}
              labelAlign={"left"}
              onFinish={(vals) => {
                console.log(JSON.stringify(vals))
                this.saveSetting("grafana", JSON.stringify(vals))
              }}
            >
              <Form.Item
                label={"Grafana地址"}
                name={"host"}
                initialValue={grafanaConfig.host}
                rules={[
                  {required: true, message: "请填写Grafana地址"},
                  // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
                ]}
              >
                <Input
                  disabled={!this.props.onEdit.grafana}
                  placeholder={"示例: http://1.2.3.4:3000"}
                />
              </Form.Item>
              <Form.Item
                label={"Header名称"} name={"header_name"} initialValue={grafanaConfig.header_name}
                rules={[
                  {required: true, message: "请填写Header名称"},
                ]}
              >
                <Input
                  placeholder={"用于Grafana授权的Header名称，可在Grafana配置文件中查看"}
                  disabled={!this.props.onEdit.grafana}/>
              </Form.Item>
              <Form.Item
                name={"api_dashboard_addr"}
                label={"API监控面板地址"}
                rules={[
                  {pattern: /^\/grafana\/[a-zA-Z0-9\.\/]{3,}$/, message: "无效的监控面板地址，应该以 /grafana/ 开头"}
                ]}
                initialValue={grafanaConfig.api_dashboard_addr}
              >
                <Input placeholder={"API监控面板地址，比如：/grafana/d/api"} disabled={!this.props.onEdit.grafana}/>
              </Form.Item>
              <Form.Item
                name={"instance_dashboard_addr"}
                label={"实例监控面板"}
                initialValue={grafanaConfig.instance_dashboard_addr}
                rules={[
                  {pattern: /^\/grafana\/[a-zA-Z0-9\.\/]{3,}$/, message: "无效的监控面板地址，应该以 /grafana/ 开头"}
                ]}
              >
                <Input placeholder={"实例监控面板地址，比如：/grafana/d/instance"} disabled={!this.props.onEdit.grafana}/>
              </Form.Item>
              <Form.Item
                name={"overview_dashboard_addr"}
                label={"概览监控面板"}
                initialValue={grafanaConfig.overview_dashboard_addr}
                rules={[
                  {pattern: /^\/grafana\/[a-zA-Z0-9\.\/]{3,}$/, message: "无效的监控面板地址，应该以 /grafana/ 开头"}
                ]}
              >
                <Input placeholder={"概览监控面板地址，比如：/grafana/d/overview"} disabled={!this.props.onEdit.grafana}/>
              </Form.Item>
            </Form>
          </SettingBlock>

          <SettingBlock
            editable={true}
            edit={this.props.onEdit.config_dep}
            title={"配置依赖设置"}
            onEdit={() => {
              this.setEdit("config_dep", true)
            }}
            onCancel={() => {
              this.setEdit("config_dep", false)
            }}
            onSave={() => {
              this.configDepFormRef.current.submit()
            }}
          >
            <Form
              ref={this.configDepFormRef}
              onFinish={(vals) => {
                this.saveSetting("config_dep", JSON.stringify(vals))
              }}
            >
              <Form.Item
                initialValue={this.props.configDepSetting.interval}
                name={"interval"}
                label={"定时任务间隔时间"}
              >
                <Input disabled={!this.props.onEdit.config_dep}/>
              </Form.Item>
            </Form>
          </SettingBlock>
          <GrafanaSetting/>

          <GatewaySetting/>

        </Card>
      </PageHeaderWrapper>
    );
  }
}
