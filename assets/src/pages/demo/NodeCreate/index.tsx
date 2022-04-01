import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import { CommonProps } from '@/pages/confgo/config/common';

const styles = require('./index.less');

export interface CreateModalInterface extends CommonProps, ModalProps {
  onSubmit: (values: any) => void;
}

export default function CreateModalNode(props: CreateModalInterface) {
  const { onSubmit, ...restProps } = props;

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 1, span: 24 },
  };

  let onOK = (values: any) => {
    onSubmit(values);
  };

  return (
    <Modal {...restProps} maskClosable footer={null} destroyOnClose className={styles.CreateModal}>
      <Form name="basic" onFinish={onOK} {...layout}>
        <Row gutter={24}>
          <div style={{ display: 'flex' }}>
            <Col span={24}>
              <Form.Item
                {...tailLayout}
                label="节点名称"
                name="name"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                {...tailLayout}
                label="英文名称"
                name="app_name"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Col>
          </div>
        </Row>
      </Form>
    </Modal>
  );
}
