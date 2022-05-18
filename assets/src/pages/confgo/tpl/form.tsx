import { Form, Input, Button, Select, Card, message } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/duotone-light.css';

const formItemLayout = {
  // labelCol: {
  //   xs: { span: 18 },
  //   sm: { span: 8 },
  // },
  // wrapperCol: {
  //   xs: { span: 18 },
  //   sm: { span: 16 },
  // },
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
  const [content, setContent] = useState<string>('');
  const [initContent, setInitContent] = useState<string>('');
  let initialValues = props.initialValues;
  let request = props.request;
  let id = props.id;
  // 创建的时候初始化会为undefined
  if (props.initialValues !== undefined && props.initialValues.content !== initContent) {
    setInitContent(initialValues.content);
  }

  const onFinish = (values) => {
    request({
      ...values,
      content,
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

  const onInputChange = (e, d, val) => {
    setContent(val);
    console.log('val', val);
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
        name="tpl_type"
        label="配置类型"
        rules={[
          {
            required: true,
            message: '请输入配置类型',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <div>
        <span>模板内容：</span>
        <CodeMirror
          value={initContent}
          onChange={onInputChange}
          options={{
            mode: 'javascript',
            theme: 'duotone-light',
            lineNumbers: true,
          }}
        />
      </div>

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
