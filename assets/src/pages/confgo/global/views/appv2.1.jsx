import react from 'react';
import { Form, Modal, Input, Icon, Row, Col, Radio, Button, Switch, Select } from 'antd';
import StandardFormRow from '../components/StandardFormRow';

const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { xs: { span: 8 }, sm: { span: 4 } },
  wrapperCol: { xs: { span: 16 }, sm: { span: 20 } },
};

const subFormItemLayout = {
  labelCol: { xs: { span: 8 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 16 }, sm: { span: 18 } },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

let id = 0;

@Form.create()
export default class View extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'redis',
      mode: 'single',
      ref: 'redis://:密码@地址',
    };
  }

  componentDidMount() {
    const { type } = this.props.tag;
    if (type == '') return;
    this.setState({
      type,
    });
  }

  componentWillUpdate(nextprops) {
    if (nextprops.show == false || this.state.ref == 'redis://:密码@地址') {
      return;
    }
    this.setState({
      ref: 'redis://:密码@地址',
    });
  }

  componentWillReceiveProps(nextProps) {
    //切换应用，同步切换
    if (nextProps.aid !== this.state.aid) {
      this.setState({ aid: nextProps.aid }, () => {
        this.getAppList().then((_) => {
          //获取配置列表
          this.autoChangeConfig(); //自动选择第一个配置文件
        });
      });
    }
  }

  onChangeType = (e) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    let mode = 'single';
    if (e.target.value === 'etcd') {
      mode = 'muti';
    }
    this.setState({
      type: e.target.value,
      mode,
    });
    form.setFieldsValue({
      keys: keys.filter((_) => false),
      mode,
    });
  };

  onChangeMode = (e) => {
    this.setState({
      mode: e.target.value,
    });
  };

  onSelectType = (e) => {
    let ref = '';
    switch (e) {
      case 'redis':
        ref = 'redis://:密码@地址';
        break;
      case 'mysql':
        ref =
          '用户名:密码@tcp(地址)/数据库?charset=utf8&parseTime=True&loc=Local&readTimeout=1s&timeout=1s&writeTimeout=1s';
        break;
    }
    this.setState({
      ref,
    });
  };

  addSlave = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  removeSlave = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter((key) => key !== k),
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      const { names = [], mode } = values;
      values.value = '"' + values.value + '"';
      if (mode === 'muti') {
        values.value = '[' + values.value;
        for (let k of names) {
          if (!k || k === '') {
            continue;
          }
          values.value = values.value + ',"' + k + '"';
        }
        values.value = values.value + ']';
      }
      let prefix = values.type;
      let suffix = values.env + '-' + values.idc_code;
      if (values.type === 'redis' || values.type === 'mysql' || values.type === 'mongo') {
        // if (mode === 'muti') {
        //   values.key = values.key + '-slave';
        // } else {
        //   values.key = values.key + '-master';
        // }
      }
      values.key = prefix + '|' + values.key + '|' + suffix;
      // 默认进行数据加密
      values.is_show = 1;
      console.log('Received values of form: ', values);
      this.props.submit(values);
    });
  };

  render() {
    const { show, tag } = this.props;
    const { env = 'dev' } = tag;
    const { type, mode, idc_code, ref } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    // const types = ['redis', 'mysql', 'mongodb', 'etcd', 'grpc', 'dyrpc', 'rocketmq', 'key-value'];
    const types = [
      {
        key: 'redis',
        label: 'redis',
      },
      {
        key: 'mysql',
        label: 'mysql',
      },
      {
        key: 'mongodb',
        label: 'mongodb',
      },
      {
        key: 'etcd',
        label: 'etcd',
      },
      {
        key: 'grpc',
        label: 'grpc',
      },
      {
        key: 'dyrpc',
        label: 'dyrpc',
      },
      {
        key: 'rocketmq',
        label: 'rocketmq',
      },
      {
        key: 'key-value',
        label: 'key-value',
      },
    ];
    const envs = ['dev', 'live', 'pre', 'stress', 'gray', 'prod'];
    const chooseMode = {
      redis: true,
      mysql: true,
      mongodb: true,
      etcd: true,
      grpc: false,
      dyrpc: false,
      rocketmq: true,
      'key-value': true,
    };
    const singleModeText = {
      redis: '单主库',
      mysql: '单主库',
      mongodb: '单主库',
      etcd: '默认',
      rocketmq: '单机',
      'key-value': '单值',
    };
    const mutiModeText = {
      redis: '多从库',
      mysql: '多从库',
      etcd: '集群',
      mongodb: '多从库',
      rocketmq: '集群',
      'key-value': '多值',
    };
    const buttonText = {
      redis: '添加从库',
      mysql: '添加从库',
      mongodb: '添加从库',
      etcd: '添加实例',
      rocketmq: '添加实例',
      'key-value': '添加值',
    };

    const IdcCodeOptions = [
      {
        key: 'HB-WHYL',
        label: '武汉银联',
      },
      {
        key: 'BJ-CP-WG',
        label: '北京昌平',
      },
      {
        key: 'TENCENT-SHANGHAI-4',
        label: '腾讯云-华东地区(上海)',
      },
      {
        key: 'BJ-BG',
        label: '北京海淀',
      },
      {
        key: 'BJ-ZW-10',
        label: '北京兆维',
      },
      {
        key: 'BJ-YZ',
        label: '北京亦庄',
      },
      {
        key: 'ALIYUN-HB2-C',
        label: '华北阿里云C区',
      },
      {
        key: 'ALIYUN-HB2-D',
        label: '华北阿里云D区',
      },
      {
        key: 'ALIYUN-HB2-E',
        label: '华北阿里云E区',
      },
      {
        key: 'ALIYUN-HB2-F',
        label: '华北阿里云F区',
      },
      {
        key: 'ALIYUN-HB2-G',
        label: '华北阿里云G区',
      },
      {
        key: 'ALIYUN-HN',
        label: '华南阿里云',
      },
      {
        key: 'ALIYUN-SZ',
        label: '深圳阿里云',
      },
      {
        key: 'ALIYUN-HD',
        label: '华东阿里云',
      },
    ];

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item {...formItemLayoutWithOutLabel} required={false} key={k}>
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: '资源值不能为空',
            },
          ],
        })(<Input placeholder="资源值" style={{ width: '90%' }} />)}
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.removeSlave(k)}
        />
      </Form.Item>
    ));

    return (
      <div>
        <Modal
          title="新增修改资源"
          visible={show}
          maskClosable
          onCancel={this.props.cancel}
          onOk={this.handleSubmit}
          destroyOnClose
          width={'800px'}
        >
          <Form>
            <Row>
              <Form.Item label={'资源类型'} {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: type,
                })(
                  <Select style={{ width: '300px' }} onSelect={this.onSelectType}>
                    {types.map((el) => (
                      <Option key={el.key} value={el.key}>
                        {el.label}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label={'资源值填写参考'} {...formItemLayout}>
                <TextArea
                  style={{ width: '90%', height: '100px' }}
                  value={ref}
                  disabled="disabled"
                />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label={'环境'} {...formItemLayout}>
                {getFieldDecorator('env', {
                  initialValue: env,
                })(
                  <Radio.Group buttonStyle="solid">
                    {envs.map((v) => {
                      return <Radio.Button value={v}>{v}</Radio.Button>;
                    })}
                  </Radio.Group>,
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label={'机房'} {...formItemLayout}>
                {getFieldDecorator('idc_code', {
                  initialValue: idc_code || IdcCodeOptions[0].key,
                })(
                  <Select style={{ width: '300px' }}>
                    {IdcCodeOptions.map((el) => (
                      <Option key={el.key} value={el.key}>
                        {el.label}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Row>
            {chooseMode[type] && (
              <div>
                <Row>
                  <Col span={16}>
                    <Form.Item label={'模式'} {...subFormItemLayout}>
                      {getFieldDecorator('mode', {
                        initialValue: mode,
                      })(
                        <Radio.Group
                          onChange={this.onChangeMode}
                          buttonStyle="solid"
                          disabled={type === 'etcd'}
                        >
                          <Radio.Button value={'single'}>{singleModeText[type]}</Radio.Button>
                          <Radio.Button value={'muti'}>{mutiModeText[type]}</Radio.Button>
                        </Radio.Group>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    {mode === 'muti' && (
                      <Form.Item {...subFormItemLayout}>
                        <Button type="dashed" onClick={this.addSlave}>
                          <Icon type="plus" />
                          {buttonText[type]}
                        </Button>
                      </Form.Item>
                    )}
                  </Col>
                </Row>
              </div>
            )}
            <Row>
              <Col span={8} offset={4}>
                {/*<Form.Item label={"加密"} {...subFormItemLayout}>*/}
                {/*    {getFieldDecorator('is_show', {*/}
                {/*        rules: [{ required: false, message: '加密开关' }],*/}
                {/*        valuePropName: 'checked',*/}
                {/*      initialValue: 1,*/}
                {/*    })(*/}
                {/*        <Switch checkedChildren="是" unCheckedChildren="否"  />*/}
                {/*    )}*/}
                {/*</Form.Item>*/}
              </Col>
              {/*<Col span={8}>*/}
              {/*    <Form.Item label={"私有资源"} {...subFormItemLayout}>*/}
              {/*        {getFieldDecorator('is_common', {*/}
              {/*            rules: [{ required: false, message: '公共资源开关' }],*/}
              {/*            valuePropName: 'checked',*/}
              {/*        })(*/}
              {/*            <Switch checkedChildren="是" unCheckedChildren="否"  disabled="disabled"/>*/}
              {/*        )}*/}
              {/*    </Form.Item>*/}
              {/*</Col>*/}
            </Row>
            <Row>
              <Form.Item label={'资源名'} {...formItemLayout}>
                {getFieldDecorator('key', {
                  rules: [{ required: true, message: '请填写资源名' }],
                })(<Input placeholder={'资源名'} style={{ width: '90%' }} />)}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label={'资源值'} {...formItemLayout}>
                {getFieldDecorator('value', {
                  rules: [{ required: true, message: '请填写资源值' }],
                })(<Input placeholder={'资源值'} style={{ width: '90%' }} />)}
              </Form.Item>
              {formItems}
              <Form.Item label={'备注'} {...formItemLayout}>
                {getFieldDecorator('desc', {
                  rules: [{ required: false }],
                })(<Input placeholder="" style={{ width: '90%' }} />)}
              </Form.Item>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
