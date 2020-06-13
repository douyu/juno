import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
import React from 'react';

export default class NormalLoginForm extends React.Component {
  componentDidMount() {}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.submit(values);
      }
    });
  };

  render() {
    //新增指定的资源类型

    //type: redis grpc mysql hrpc rocketmq
    const { show, type } = this.props;

    return (
      <Modal
        title={`新增${type}配置`}
        visible={show}
        maskClosable
        onCancel={this.props.cancel}
        footer={null}
        destroyOnClose
      >
        <Form from={this.handleSubmit} className="login-form">
          <Form.Item
            label={'Key'}
            name="key"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            label={'Value'}
            name="value"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.TextArea placeholder="" autosize />
          </Form.Item>
          <Form.Item
            label={'Comment'}
            name="comment"
            rules={[{ required: false, message: 'Please input your Password!' }]}
          >
            <Input placeholder="" />
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
