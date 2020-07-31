import React from 'react';
import {Button, Card, Form, Input, List, message, Popconfirm, Radio, Tag} from 'antd';
import {checkDep, getSysConfig, installDep} from './services';
import SettingBlock from "@/pages/manage/SettingBlock";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {connect} from 'dva';
import GatewaySetting from "@/pages/manage/GatewaySetting";
import GrafanaSetting from "@/pages/manage/GrafanaSetting";
import EtcdSetting from "@/pages/manage/EtcdSetting";
import VersionSetting from "@/pages/manage/AppVersionSetting";

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

          {/*      <GrafanaSetting/>*/}

          <GatewaySetting/>

          <EtcdSetting/>

          <VersionSetting/>

        </Card>
      </PageHeaderWrapper>
    );
  }
}
