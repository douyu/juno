import {
  Form, Icon, Input, Button, Checkbox,Modal,Switch
} from 'antd';
import React from 'react'


@Form.create()
export default class NormalLoginForm extends React.Component {

  componentDidMount() {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.submit(values)
      }
    });
  };

  render() {
    const {show,data={}} = this.props;
    const {key,value,env,type,desc,is_show,is_common,idc_code} = data;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="更新资源"
        visible={show}
        maskClosable
        onCancel={this.props.cancel}
        footer={null}
        destroyOnClose
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item label={"Key"}>
            {getFieldDecorator('key', {
              rules: [{ required: true, message: '请输入key' }],
              initialValue:key,
            })(
              <Input  placeholder="" disabled="disabled"/>
            )}
          </Form.Item>
          <Form.Item label={"Value"}>
            {/*todo 动态判断value类型 并展示*/}
            {getFieldDecorator('value', {
              rules: [{ required: true, message: '请输入value' }],
              initialValue:value,
            })(
              <Input.TextArea placeholder="" autosize/>
            )}
          </Form.Item>
          <Form.Item label={"环境"}>
            {getFieldDecorator('env', {
              rules: [{ required: false, message: '环境' }],
              initialValue:env,
            })(
              <Input placeholder=""  disabled="disabled"/>
            )}
          </Form.Item>
          <Form.Item label={"机房"}>
            {getFieldDecorator('idc_code', {
              rules: [{ required: false, message: '机房' }],
              initialValue:idc_code,
            })(
              <Input placeholder=""  disabled="disabled"/>
            )}
          </Form.Item>
          <Form.Item label={"资源类型"}>
            {getFieldDecorator('type', {
              rules: [{ required: false, message: '资源类型标签' }],
              initialValue:type,
            })(
              <Input placeholder=""  disabled="disabled" />
            )}
          </Form.Item>
          <Form.Item label={"备注"}>
            {getFieldDecorator('desc', {
              rules: [{ required: false, message: '资源备注' }],
              initialValue:desc,
            })(
              <Input placeholder="" />
            )}
          </Form.Item>
          <Form.Item label={"是否加密"}>
            {getFieldDecorator('is_show', {
              rules: [{ required: false, message: '加密开关' }],
              valuePropName:'checked',
              initialValue:is_show,
            })(
              <Switch checkedChildren="是" unCheckedChildren="否" />
            )}
          </Form.Item>
          {/*<Form.Item label={"是否为私有资源"}>*/}
          {/*  {getFieldDecorator('is_common', {*/}
          {/*    rules: [{ required: false, message: '公共资源开关' }],*/}
          {/*    valuePropName:'checked',*/}
          {/*    initialValue:is_common*/}
          {/*  })(*/}
          {/*    <Switch checkedChildren="是" unCheckedChildren="否" />*/}
          {/*  )}*/}
          {/*</Form.Item>*/}
          <Form.Item>
            <div style={{textAlign:'center'}}>
              <Button onClick={this.props.cancel} style={{marginRight:'16px'}}>
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