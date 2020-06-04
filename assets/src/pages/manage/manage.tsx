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
} from 'antd';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
import moment from 'moment';
import { checkDep, installDep, getSysConfig, setSysConfig } from './services';
import { reqList } from '@/pages/resource/app/service';

export default class SysManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkRes: '',
      depRes: [],
      sysType: 1,
      sysConfig: [],
      timeSpan: 0,
      loading: false,
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
    getSysConfig({ sysType: 1 }).then((res) => {
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
    this.setState({ timeSpan: e });
  };

  handleTimeSpanChange = (e) => {
    const { timeSpan } = this.state;
    setSysConfig({ sysType: 1, setInt: timeSpan }).then(rs => {
      const { code, msg, data } = rs;
      if (code === 0) {
        message.success('提交成功：', msg);
        this.GetSysConfig();
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
    installDep({ installType: e * 1 }).then(rs => {
      const { code, msg, data } = rs;
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
      sysType: e.target.value,
    });
  };


  enterLoading = () => {
    this.setState({ loading: true });
  };

  stopLoading = () => {
    this.setState({ loading: false });
  };

  render() {
    const { checkRes = '', depRes = [], sysType = 0, timeSpan = 0, sysConfig = [], loading } = this.state;
    const recordColumns = [
      {
        title: '设置类型',
        dataIndex: 'sysType',
        key: 'sysType',
        width: 100,
        render(val) {
          if (val === 1) {
            return '配置依赖解析时间(分钟)';
          }
          return val;
        },
      }, {
        title: '设置值',
        dataIndex: 'setInt',
        key: 'setInt',
        width: 100,
      }, {
        title: '操作时间',
        dataIndex: 'update_time',
        key: 'update_time',
        width: 200,
        fixed: 'right',
        render(val) {
          return <span>{moment(val, 'X').format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
    ];
    return (
      <div>
        <Card title={'系统管理'}>
          <Row gutter={24} className="top" style={{ marginTop: 16, marginBottom: 16 }}>
            <Col span={22}>
              <RadioGroup value={sysType} onChange={this.typeChange}>
                <Radio value={1}>{'Pprof环境检测和安装'}</Radio>
                <Radio value={2}>{'其他设置'}</Radio>
              </RadioGroup>
            </Col>
          </Row>
          {sysType === 2 &&
          <Row gutter={1} style={{ marginBottom: '12px' }}>
            <InputNumber placeholder={'设置配置依赖解析时间（分钟）'} onChange={this.inputChange} disabled={false}
                         style={{ width: 300 }}/>
            <Button type="primary" onClick={this.handleTimeSpanChange} style={{ marginLeft: 10 }}>提交</Button>
          </Row>
          }
          {sysType === 1 && <List
            grid={{ gutter: 16, column: 4 }}
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
          {sysType === 2 && <Table
            style={{ marginTop: '12px' }}
            columns={recordColumns}
            dataSource={sysConfig}
          />}
        </Card>

      </div>
    );
  }
}
