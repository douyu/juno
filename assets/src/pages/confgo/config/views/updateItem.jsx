import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Modal,
  Select,
  Switch,
  Table,
  Radio,
  message,
} from 'antd';
import React from 'react';
import { connect } from 'dva';
import ReactCodeMirror from 'react-cmirror';
import '../style/code.less';
import { ServiceConfigItemCheck } from '@/services/confgo';

const Option = Select;
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
    key: 'key-value',
    label: 'KV',
  },
];

export default class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      valueType: undefined,
    };
  }

  handleSubmit = (values) => {
    const { item = {} } = this.props;
    const { id, is_resource } = item;
    values.id = id * 1;
    if (item.resource_id) {
      values.resource_id = item.resource_id;
    }
    if (!is_resource) {
      //取消关联
      delete values.resource_id;
    }
    this.setState({ resource_id: 0 }, () => {
      this.checkItem(values);
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

  chooseResource = (e) => {
    this.props.changeResource(e);
  };

  //选中资源
  selectResource = (e) => {
    const { resourceData = {} } = this.props.item || {};
    const { list = [] } = resourceData;
    const resource =
      list.find((v) => {
        return v.id === e * 1;
      }) || {};
    this.props.changeResourceID(e);
    this.props.form.setFieldsValue({
      value: `"{{${resource.name}}}"`,
    });
    message.success('选择成功，请提交');
  };

  // 重置状态
  close = (e) => {
    this.setState({
      type: '',
    });
  };

  render() {
    const that = this;
    //todo  资源类型的配置直接从模版生成
    const { show, item = {}, env, zone_code } = this.props;
    const {
      key,
      value,
      comment,
      is_resource = false,
      resource_id = 0,
      resourceData = {},
      is_public = 0,
    } = item;
    const { list = [] } = resourceData;

    const resource = list.find((v) => v.id === resource_id) || {};
    const { type: resource_type } = resource;

    const cols = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (t, r) => {
          let tm = t.split('|');
          if (tm.length > 2) {
            return tm[1];
          }
          return t;
        },
      },
      {
        title: '值',
        dataIndex: 'value',
      },
      {
        title: '操作',
        dataIndex: 'op',
        render: (t, r) => {
          if (r.id === resource_id) {
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
        title="更新 Block"
        visible={show}
        maskClosable={false}
        width={1200}
        onCancel={(e) => {
          this.close();
          this.props.cancel();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          {...layout}
          onFinish={this.handleSubmit}
          className="login-form"
          initialValues={{
            key: key,
            value: value,
            is_public: is_public,
            is_resource: is_resource,
            comment: comment,
          }}
        >
          <Form.Item
            label={'名称'}
            name="key"
            rules={[{ required: true, message: '请输入配置项的key!' }]}
          >
            <Input placeholder="" disabled="disable" />
          </Form.Item>
          <Form.Item
            label={'类型'}
            name="is_public"
            rules={[{ required: true, message: '选择配置类型' }]}
          >
            <Radio.Group disabled="disable">
              <Radio key={0} value={0}>
                私有
              </Radio>
              <Radio key={1} value={1}>
                公有
              </Radio>
              <Radio key={2} value={2}>
                关联
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={'值'}
            name="value"
            rules={[{ required: false, message: '请输入配置项的value!' }]}
          >
            <div className={'configEditor'}>
              <ReactCodeMirror
                ref="editor"
                value={value}
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
          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Button onClick={this.props.cancel} style={{ marginRight: '16px' }}>
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
