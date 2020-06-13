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
  Row,
  Col,
} from 'antd';
import React from 'react';
import ReactCodeMirror from 'react-cmirror';
import '../style/code.less';
import { ServiceConfigItemCheck, ServiceConfigItemList } from '@/services/confgo';

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
      typ: 'link',
      blockList: [],
      blockMap: [],
      env: this.props.env,
      zoneCode: this.props.zoneCode,
    };
  }

  componentDidMount() {
    this.GetItemList();
  }

  handleSubmit = (values) => {
    if (this.state.is_resource === false) {
      values.value = this.configInputText;
    } else {
      values.resource_id = this.state.resource_id;
      values.value = '"{{' + this.state.resource_name + '}}"';
    }
    this.checkItem(values);
  };

  handleLinkSubmit = (values) => {
    let block = this.state.blockMap[values.link_id];
    values.value = this.configInputText;
    values.is_resource = 1;
    values.resource_id = values.link_id;
    values.is_public = 2;
    values.key = block.key;
    this.checkItem(values);
  };

  GetItemList = () => {
    ServiceConfigItemList({ env: this.state.env, zoneCode: this.state.zoneCode }).then((res) => {
      if (res.code != 0) {
        message.error('公用配置类别获取失败：' + res.msg);
      } else {
        let blockMap = [];
        res.data.forEach((element) => {
          blockMap[element.id] = element;
        });

        this.setState({
          blockList: res.data,
          blockMap: blockMap,
        });
      }
    });
  };

  checkItem = (values) => {
    values.value = this.configInputText;
    values.caid = this.props.caid;
    ServiceConfigItemCheck(values).then((res) => {
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

  changeTyp = (e) => {
    this.setState({
      typ: e.target.value,
    });
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

  linkChange = (e) => {
    const { blockMap } = this.state;
    this.setState({
      value: blockMap[e].value,
    });
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

    let blockListOption = [];
    this.state.blockList.forEach((element) => {
      blockListOption.push(<Option value={element.id}>{element.key}</Option>);
    });

    return (
      <Modal
        title="新建 Block"
        visible={show}
        maskClosable={false}
        width={1200}
        onCancel={this.close}
        footer={null}
        destroyOnClose
      >
        <Row>
          <Radio.Group value={this.state.typ} onChange={this.changeTyp}>
            <Radio.Button value="link">关联公共 Block</Radio.Button>
            <Radio.Button value="create">创建 Block</Radio.Button>
          </Radio.Group>
        </Row>
        {this.state.typ == 'create' && (
          <Row>
            <Form
              style={{ width: '100%', marginTop: '20px' }}
              {...layout}
              onFinish={this.handleSubmit}
              className="login-form"
              initialValues={{ is_resource: is_resource, is_public: 0 }}
            >
              <Form.Item
                label={'名称'}
                name="key"
                rules={[{ required: true, message: '请输入配置项的key' }]}
              >
                <Input placeholder="" />
              </Form.Item>
              <Form.Item
                label={'类型'}
                name="is_public"
                rules={[{ required: true, message: '选择配置类型' }]}
              >
                <Radio.Group>
                  <Radio key={0} value={0}>
                    私有
                  </Radio>
                  <Radio key={1} value={1}>
                    公有
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label={'值'}>
                <div className={'configEditor'}>
                  <ReactCodeMirror
                    ref="editor"
                    value={this.state.value}
                    options={{
                      theme: 'monokai',
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
          </Row>
        )}

        {this.state.typ == 'link' && (
          <Row>
            <Form
              style={{ width: '100%', marginTop: '20px' }}
              {...layout}
              onFinish={this.handleLinkSubmit}
              className="login-form"
              initialValues={{ is_resource: is_resource, is_public: 0 }}
            >
              <Form.Item
                label={'关联 Block'}
                name="link_id"
                rules={[{ required: true, message: '请选择关联 Block' }]}
              >
                <Select
                  showSearch
                  style={{ width: 400 }}
                  placeholder="选择 Block"
                  optionFilterProp="children"
                  onChange={this.linkChange}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {blockListOption}
                </Select>
              </Form.Item>
              <Form.Item label={'值'}>
                <div className={'configEditor'}>
                  <ReactCodeMirror
                    ref="editor"
                    value={this.state.value}
                    options={{
                      theme: 'monokai',
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
          </Row>
        )}
      </Modal>
    );
  }
}
