import {Form, Input, Button, Select, Card, message, InputNumber} from 'antd';
import React from "react";
import {history} from "umi";

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

export default function CommonForm (props) {
  const [form] = Form.useForm();

  let initialValues = props.initialValues
  let request = props.request
  let aid = props.aid

  const onFinish = (values) => {
    request({
      ...values,
      aid:parseInt(aid),
    }).then(res => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }

      message.success(res.msg);
      history.goBack()
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
        name="app_name"
        label="应用名称"
        rules={[
          {
            required: true,
            message: "请输入应用名称",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gid"
        label="Gitlab Id"
        rules={[
          {required: true}
        ]}
        hasFeedback
      >
        <InputNumber style={{width: '100%'}}/>
      </Form.Item>
      <Form.Item
        name="lang"
        label="语言类型"
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="biz_domain"
        label="业务类型"
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="http_port"
        label="HTTP端口号"
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="rpc_port"
        label="RPC端口号"
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="govern_port"
        label="治理端口号"
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="git_url"
        label="GIT克隆地址"
        hasFeedback
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
          onClick={()=>{
            history.goBack()
          }}
        >
          返回
        </Button>
      </Form.Item>
    </Form>
  );
};
