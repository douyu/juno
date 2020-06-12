import React from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
  Input,
  Radio,
  List,
  Tag,
  InputNumber,
  Divider
} from 'antd';

const {TextArea} = Input;
const RadioGroup = Radio.Group;
import moment from 'moment';
import {checkDep, installDep, getSysConfig, setSysConfig, delSysConfig} from './services';


const sysTypeList = [{name: "设置配置依赖解析时间（分钟）", value: 1}, {name: "监控展示Grafana地址", value: 2}]

export default class SysManage extends React.PureComponent {
  constructor(props) {
    super(props);
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
  }

  GetCheckDep = (): void => {
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

  GetSysConfig = (): void => {
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

  inputChange = (e) => {
    console.log('inputChange', e);
    this.setState({setInt: e});
  };

  inputMonitorChange = (e) => {
    console.log('inputMonitorChange', e.target.value);
    this.setState({monitorAddr: e.target.value, setStr: e.target.value});
  };

  inputMonitorCateChange = (e) => {
    console.log('inputMonitorCateChange', e.target.value);
    this.setState({setCate: e.target.value});
  };

  onSelectType = (e) => {
    console.log('onSelectType', e);
    this.setState({opType: e, sysType: e});
  }

  onSelectMonitorType = (e) => {
    console.log('onSelectMonitorType', e);
    this.setState({setInt: e});
  }


  handleTimeSpanChange = () => {
    const {sysType = 0, setInt = 0, setStr = '', setCate = '', id = 0} = this.state;
    //let sysType, setInt, setStr;
    let needAddr = true;
    switch (sysType) {
      case 1: // 配置解析时间
        needAddr = false;
        break;
      case 2:
        break;
      default:
        message.error("类型选择不合法");
        return
    }
    setSysConfig({id, sysType, setInt, setCate: needAddr ? setCate : '', setStr: needAddr ? setStr : ''}).then(rs => {
      const {code, msg, data} = rs;
      if (code === 0) {
        message.success('提交成功：', msg);
        this.GetSysConfig();
        this.setState({isEdit: false, isAdd: false, sysType: 0, setInt: 0, setStr: ''});
      } else {
        message.error('提交失败:' + msg);
      }
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

  typeChange = (e) => {
    // console.log(">>>>>>>>>> logChildTypeChange", e.target.value);
    this.setState({
      sysTag: e.target.value,
    });
  };


  enterLoading = () => {
    this.setState({loading: true});
  };

  stopLoading = () => {
    this.setState({loading: false});
  };

  edit = (record) => {
    const {id, sysType, setInt, setStr, setCate} = record;
    console.log(">>>>>>>>>> record", id, sysType, setInt, setStr);
    this.setState({isEdit: true, sysType, setInt, setStr, setCate, id});
  };

  delete = (id) => {
    console.log(">>>>>>>>>> id", id);
    delSysConfig({id}).then(rs => {
      const {code, msg, data} = rs;
      if (code === 0) {
        message.success('删除成功：', msg);
        this.GetSysConfig();
      } else {
        message.error('删除失败:' + msg);
      }
    });
  };

  add = () => {
    this.setState({isAdd: true, sysType: '', setInt: '', setStr: '', setCate: ''});
  };

  cancel = () => {
    //const {id, sysType, setInt, setStr} = this.state;
    //console.log(">>>>>>>>>> record", id, sysType, setInt, setStr);
    this.setState({isEdit: false, isAdd: false, sysType: 0, setInt: 0, setStr: '', setCate: ''});
  };


  render() {
    const {checkRes = '', depRes = [], sysTag = 0, opType = 0, sysConfig = [], loading, isAdd = false, isEdit = false, sysType = 0, setInt = 0, setStr = '', setCate = ''} = this.state;
    const that = this;
    const isShowMonitor = opType === 2 || sysType === 2;
    console.log(">>>>>>>>>> render", sysType, setInt, setStr, isShowMonitor);
    const recordColumns = [
      {
        title: '设置类型',
        dataIndex: 'sysType',
        key: 'sysType',
        width: 200,
        render(val) {
          if (val === 1) {
            return '配置依赖解析时间(分钟)';
          }
          if (val === 2) {
            return '监控展示Grafana地址';
          }
          return val;
        },
      }, {
        title: '设置类别',
        dataIndex: 'setCate',
        key: 'setCate',
        width: 100,
        render(val, record) {
          if (record.sysType === 1) {
            return '无'
          }
          return val;
        }
      }, {
        title: '设置值',
        dataIndex: 'setInt',
        key: 'setInt',
        width: 100,
        render(val, record) {
          if (record.sysType === 2) {
            return '无'
          }
          return val;
        }
      }, {
        title: '设置地址',
        dataIndex: 'setStr',
        key: 'setStr',
        width: 100,
        render(val, record) {
          if (record.sysType === 1) {
            return '无'
          }
          return val;
        },
      }, {
        title: '更新时间',
        dataIndex: 'update_time',
        key: 'update_time',
        width: 200,
        render(val) {
          return <span>{moment(val, 'X').format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      }, {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width: 200,
        fixed: 'right',
        render(val, record) {
          return [<a onClick={() => {
            that.edit(record);
          }}>编辑</a>, <Divider type="vertical"/>, (<Popconfirm
            title={'你确定要删除该配置？'}
            onConfirm={() => that.delete(record.id)}
            okText="我很确定"
            cancelText="算了"
          >
            <a>删除</a>
          </Popconfirm>),
          ];
        },
      },
    ];
    return (
      <div>
        <Card title={'系统管理'}>
          <Row gutter={24} className="top" style={{marginTop: 16, marginBottom: 16}}>
            <Col span={22}>
              <RadioGroup value={sysTag} onChange={this.typeChange}>
                <Radio value={1}>{'Pprof环境检测和安装'}</Radio>
                <Radio value={2}>{'其他设置'}</Radio>
              </RadioGroup>
            </Col>
          </Row>
          {sysTag === 2 && <Row style={{marginTop: 8}}>
              <Button type="primary" onClick={this.add} style={{marginLeft: 10}}>新增</Button>
          </Row>}
          {sysTag === 2 && <Modal visible={isEdit || isAdd} onCancel={this.cancel} onOk={this.handleTimeSpanChange}>
              <Row>
                  <Col span={4} style={{fontWeight: 'bold'}}>设置类型</Col>
                  <Col span={20}><Select style={{width: 200}} onSelect={this.onSelectType} value={sysType}
                                         disabled={isEdit}>
                    {
                      sysTypeList.map(v => {
                        return <Select.Option value={v.value}>{v.name}</Select.Option>
                      })
                    }
                  </Select>
                  </Col>
              </Row>
            {!isShowMonitor && <Row style={{marginTop: 8}}>
                <Col span={4} style={{fontWeight: 'bold'}}>设置时间</Col>
                <Col span={20}><InputNumber placeholder={'设置配置依赖解析时间（分钟）'} onChange={this.inputChange} disabled={false}
                                            value={setInt}
                                            style={{width: 300}}/></Col>
            </Row>}
            {isShowMonitor && <Row style={{marginTop: 8}}> <Col span={4} style={{fontWeight: 'bold'}}>设置类别</Col>
                <Col span={20}>
                    <Input placeholder={'填写监控类别'} onChange={this.inputMonitorCateChange} disabled={isEdit}
                           value={setCate}
                           style={{width: 400}}/></Col>
            </Row>}
            {isShowMonitor && <Row style={{marginTop: 8}}> <Col span={4} style={{fontWeight: 'bold'}}>设置地址</Col>
                <Col span={20}>
                    <Input placeholder={'设置监控Grafana展示地址'} onChange={this.inputMonitorChange} disabled={false}
                           value={setStr}
                           style={{width: 400}}/></Col>
            </Row>}
          </Modal>}
          {sysTag === 1 && <List
              grid={{gutter: 16, column: 4}}
              dataSource={depRes}
              renderItem={item => (
                <List.Item>
                  <Card title={item.name}>
                    {item.check_res === 1 && <Tag color="green" key={2}>
                        已安装
                    </Tag>}
                    {item.check_res === 0 && <Tag color="geekblue" key={1}>
                        未安装
                    </Tag>}
                    {(item.check_res === 0 && item.can_install > 0) &&
                    <Popconfirm
                        placement="rightBottom"
                        title={'该操作有一定的延迟，确认操作？'}
                        onConfirm={() => {
                          this.handleCheckLog(item.can_install);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" loading={loading}>安装</Button>
                    </Popconfirm>}
                  </Card>
                </List.Item>
              )}
          />}
          {sysTag === 2 && <Table
              style={{marginTop: '12px'}}
              columns={recordColumns}
              dataSource={sysConfig}
          />}
        </Card>

        < / div>
          );
          }
          }
