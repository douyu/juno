import { Form, Icon, Input, Button, Checkbox, Modal, message, Radio, Tooltip, Select } from 'antd';
import React from 'react';

export default class NewConfigFileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  onFinish = (values) => {
    const { file_name } = values;
    values.file_name = `${file_name}.` + values.file_typ;
    this.props.submit(values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  onChangeZone = (e) => {
    this.setState({
      selectZone: e.target.value,
    });
  };

  cancel = () => {
    this.props.cancel();
  };

  render() {
    const { show, prefix, zoneList } = this.props;

    let optionZone = [];
    if (zoneList != undefined) {
      zoneList.forEach((zoneItem) => {
        optionZone.push(<Radio value={zoneItem.zone_code}>{zoneItem.zone_name}</Radio>);
      });
    }

    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    return (
      <Modal
        title="新增配置文件"
        visible={show}
        maskClosable
        onCancel={this.props.cancel}
        footer={null}
        destroyOnClose
      >
        <Form
          {...layout}
          className="login-form"
          name="basic"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label={'机房'}
            name="zone_code"
            rules={[{ required: true, message: '请选择配置文件环境' }]}
          >
            <Radio.Group>{optionZone}</Radio.Group>
          </Form.Item>
          <Form.Item
            label={'配置类型'}
            name="file_typ"
            rules={[{ required: true, message: '请输入配置类型' }]}
          >
            <Select placeholder="选择配置类型" allowClear>
              <Option value="toml">toml</Option>
              <Option value="yaml">yaml</Option>
              );
            </Select>
          </Form.Item>
          <Form.Item
            label={'配置名称'}
            name="file_name"
            rules={[{ required: true, message: '请输入配置文件名称' }]}
          >
            <Input placeholder="dev,live,pre,prod..." />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Button onClick={this.cancel} style={{ marginRight: '16px' }}>
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
