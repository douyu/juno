import React, { useEffect } from 'react';
import { Modal, Input, Form } from 'antd';

function SettingDialog(props) {
  const { settings, onSave } = props;
  const [form] = Form.useForm();

  let onOk = () => {
    form.validateFields().then((values) => {
      onSave(values);
    });
  };

  useEffect(() => {
    if (props.visible) form.setFieldsValue(settings);
  }, [settings]);

  return (
    <Modal title="设置" {...props} onOk={onOk}>
      <Form layout="horizontal" form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item
          label="本地调试地址"
          help="当前主机的访问地址，比如：192.168.0.123"
          name={'localhost'}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default SettingDialog;
