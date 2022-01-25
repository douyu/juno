import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Input, message, Modal, Select, Switch } from 'antd';
import { createItem } from '../../../services/proxymanage';

export interface ModalCreateResourceInterface {
  onOk?: () => void;

  // state
  visible: boolean;

  // dispatch functions
  showModalCreate: (visible: Boolean) => void;
}

function ModalCreateResource(props: ModalCreateResourceInterface) {
  const { visible } = props;
  const [form] = Form.useForm();
  const [env, setEnv] = useState<string>();

  useEffect(() => {
    if (!visible) {
      return;
    }
    form.resetFields();
  }, [visible]);

  return (
    <Modal
      width={800}
      visible={props.visible}
      title={'创建'}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => props.showModalCreate(false)}
    >
      <Form
        form={form}
        labelCol={{ span: 3 }}
        onFinish={(fields) => {
          createItem({
            ...fields,
            is_rewrite: fields.is_rewrite ? 1 : 0,
          }).then((r) => {
            if (r.code !== 0) {
              message.error('创建失败:' + r.msg);
              return;
            }
            if (props.onOk) props.onOk();
            form.resetFields();
            message.success('创建成功');
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
          label={'代理子路径'}
          name={'sub_path'}
          rules={[{ required: true, message: '请输入代理子路径' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'代理地址'}
          name={'proxy_addr'}
          rules={[{ required: true, message: '请输入代理地址' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'是否重写'}
          name={'is_rewrite'}
          valuePropName="checked"
          rules={[{ required: true, message: '选择是否重写' }]}
          initialValue={true}
        >
          <Switch checkedChildren="开启" unCheckedChildren="关闭" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

const mapStateToProps = ({ proxymanage }: any) => {
  return {
    visible: proxymanage.modalConfigVisible,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    showModalCreate: (visible: Boolean) =>
      dispatch({
        type: 'proxymanage/showModalCreate',
        payload: visible,
      }),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ModalCreateResource);
