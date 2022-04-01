import { Form, Input, Button, Select, Card, message } from 'antd';
import React from 'react';
import { history } from 'umi';

const formItemLayout = {
  labelCol: {
    xs: { span: 18 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function CommonForm(props) {
  const [form] = Form.useForm();

  let initialValues = props.initialValues;
  let request = props.request;
  let id = props.id;

  const onFinish = (values) => {
    request({
      ...values,
      id: parseInt(id),
    }).then((res) => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }

      message.success(res.msg);
      history.goBack();
      return true;
    });
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
      initialValues={initialValues}
    >
      <Form.Item
        name="zone_name"
        label="可用区名称"
        rules={[
          {
            required: true,
            message: '请输入可用区名称',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="zone_code"
        label="可用区码"
        rules={[
          {
            required: true,
            message: '请输入可用区码',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region_name"
        label="地区名称"
        rules={[
          {
            required: true,
            message: '请输入可用区名称',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="env"
        label="环境"
        rules={[
          {
            required: true,
            message: '请输入可用区码',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        <Button
          style={{
            marginLeft: 8,
          }}
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </Button>
      </Form.Item>
    </Form>
  );
}
