import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Input, message, Modal, Select } from 'antd';
import { createItem } from '../../../services/proxymenu';

export interface ModalCreateResourceInterface {
  onOk?: () => void;

  // state
  zoneEnv: {};
  visible: boolean;
  tags: [];

  // dispatch functions
  showModalCreate: (visible: Boolean) => void;
  loadZoneEnvTree: () => void;
  loadTags: () => void;
}

export const PanelTypes = [
  { title: 'Grafana', val: 'grafana' },
  { title: 'Pyroscope', val: 'pyroscope' },
  { title: 'AliTrace', val: 'alitrace' },
  { title: 'Jaeger', val: 'jaeger' },
];

function ModalCreateResource(props: ModalCreateResourceInterface) {
  const { visible } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (!visible) {
      return;
    }
  }, [visible]);

  return (
    <Modal
      width={800}
      visible={props.visible}
      title={'创建菜单项'}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => props.showModalCreate(false)}
    >
      <Form
        form={form}
        labelCol={{ span: 3 }}
        onFinish={(fields) => {
          createItem(fields).then((r) => {
            if (r.code !== 0) {
              message.error('创建失败:' + r.msg);
              return;
            }
            if (props.onOk) props.onOk();
            message.success('创建成功');
            form.resetFields();
            props.showModalCreate(false);
            return;
          });
        }}
      >
        <Form.Item
          label={'名称'}
          name={'title'}
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'代理路径'}
          name={'proxy_url'}
          rules={[{ required: true, message: '请输入代理路径' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'菜单标识key'}
          name={'key'}
          rules={[{ required: true, message: '请输入菜单标识key' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'菜单类型'}
          name={'panel_type'}
          rules={[{ required: true, message: '请选择菜单类型' }]}
          initialValue={'grafana'}
        >
          <Select>
            {PanelTypes &&
              PanelTypes.map((t) => (
                <Select.Option key={t.val} value={t.val}>
                  {t.title}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

const mapStateToProps = ({ proxymenu }: any) => {
  return {
    visible: proxymenu.modalConfigVisible,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    showModalCreate: (visible: Boolean) =>
      dispatch({
        type: 'proxymenu/showModalCreate',
        payload: visible,
      }),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ModalCreateResource);
