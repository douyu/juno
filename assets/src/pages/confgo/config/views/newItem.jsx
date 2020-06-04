import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Modal,
  Select,
  Switch,
  Radio,
  Table,
  message,
} from 'antd';
import React from 'react';
import ReactCodeMirror from 'react-cmirror';
import '../style/code.less';
import { ServiceConfigItemCheck } from '@/services/confgo';

const TypeOptions = [
  {
    key: 'redis',
    label: 'redis',
  },
  {
    key: 'mysql',
    label: 'mysql',
  },
  {
    key: 'grpc',
    label: 'grpc',
  },
  {
    key: 'rocketmq',
    label: 'rocketmq',
  },
  {
    key: 'etcd',
    label: 'etcd',
  },
  {
    key: 'crpc',
    label: 'crpc',
  },
  {
    key: 'mongo',
    label: 'mongo',
  },
  {
    key: 'key',
    label: 'key',
  },
];

const valueTypeMap = {
  boolean: '布尔',
  number: '数值',
  string: '字符串',
  array: '数组',
};

export default class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.configInputText = '';
    this.state = {
      is_resource: false,
      resource_id: 0,
      resource_name: '',
      resource_type: '',
      type: 'redis',
      valueType: '',
      value: undefined,
      readOnly: false,
    };
  }

  componentDidMount() {}

  handleSubmit = (values) => {
    if (this.state.is_resource === false) {
      values.value = this.configInputText;
    } else {
      values.resource_id = this.state.resource_id;
      values.value = '"{{' + this.state.resource_name + '}}"';
    }
    this.checkItem(values);
  };

  checkItem = (values) => {
    values.value = this.configInputText;
    values.caid = this.props.caid;
    ServiceConfigItemCheck(values).then((res) => {
      console.log(1111, res);
      if (res.code != 0) {
        message.error('配置格式错误：' + res.msg);
      } else {
        this.props.submit(values);
        this.close();
      }
    });
  };

  onChange = (e) => {
    const val = e.target.value;
    this.configInputText = val;
  };

  //选中资源
  selectResource = (e) => {
    const { resourceData = {} } = this.props.item || {};
    const { list = [] } = resourceData;
    const resource =
      list.find((v) => {
        return v.id === e * 1;
      }) || {};
    this.setState({
      resource_id: e * 1,
      resource_name: resource.name,
      resource_type: resource.value_type,
    });
    this.props.form.setFieldsValue({
      value: `"{{${resource.name}}}"`,
    });
    message.success('选择成功，请提交');
  };

  close = (e) => {
    this.setState({
      valueType: '',
      value: undefined,
    });
    this.props.cancel();
  };

  render() {
    const that = this;
    const { show, prefix, item = {}, env, zone_code } = this.props;
    const { resourceData = {} } = item;
    const { list = [] } = resourceData;

    const { is_resource } = this.state;

    const cols = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '值',
        dataIndex: 'value',
      },
      {
        title: '操作',
        dataIndex: 'op',
        render: (t, r) => {
          if (r.id === this.state.resource_id) {
            return (
              <span>
                <a style={{ color: '#52c41a' }}>已选择</a>
              </span>
            );
          }
          return (
            <span>
              <a
                onClick={(e) => {
                  that.selectResource(r.id);
                }}
              >
                选择
              </a>
            </span>
          );
        },
      },
    ];
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };
    return (
      <Modal
        title="新增配置"
        visible={show}
        maskClosable={false}
        width={1200}
        onCancel={this.close}
        footer={null}
        destroyOnClose
      >
        <Form
          {...layout}
          onFinish={this.handleSubmit}
          className="login-form"
          initialValues={{ is_resource: is_resource }}
        >
          <Form.Item
            label={'标识'}
            name="key"
            rules={[{ required: true, message: '请输入配置项的key' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item label={'值'}>
            <div className={'configEditor'}>
              <ReactCodeMirror
                ref="editor"
                value={this.state.value}
                options={{
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
          </Form.Item>
          {/* <Form.Item label={'是否使用配置资源'} name="is_resource" valuePropName="checked">
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={(e) => {
                this.setState({
                  is_resource: e,
                  readOnly: e,
                });
              }}
            /> 
          </Form.Item>*/}
          {is_resource && (
            <Form.Item label={'选择配置资源'}>
              <div>
                环境-机房：
                <span>
                  {env}-{this.props.zone_codeMap[zone_code]}
                </span>
              </div>
              <div style={{ marginTop: '10px' }}>
                类型：
                <span>
                  <Radio.Group
                    value={this.state.type}
                    onChange={(e) => {
                      this.setState({
                        type: e.target.value,
                      });
                    }}
                  >
                    {TypeOptions.map((el) => (
                      <Radio key={el.key} value={el.key}>
                        {el.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </span>
              </div>
              <div style={{ marginTop: '10px' }}>
                资源名称：
                <span>
                  <Input
                    value={this.state.query}
                    onChange={(e) => {
                      this.setState({ query: e.target.value });
                    }}
                  />
                </span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Table
                  columns={cols}
                  dataSource={list
                    .filter((v) => v.type === this.state.type)
                    .filter((v) => {
                      if (!this.state.query) {
                        return true;
                      }
                      return v.name.indexOf(this.state.query) !== -1;
                    })}
                  size={'small'}
                />
              </div>
            </Form.Item>
          )}
          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Button onClick={this.close} style={{ marginRight: '16px' }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" className="login-form-button">
                提交
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
