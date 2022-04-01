import React, { useEffect } from 'react';
import { Form, Input, Modal, Radio, Select, message } from 'antd';
import { connect } from 'dva';
import { PanelTypes } from '../ModalCreate';
import { createItem } from '../../../services/proxymenu';
function ModalEdit(props) {
  const { visible, onOk } = props;
  const { id, panel_type, title, key, proxy_url } = props.resource;
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      return;
    }
    form.resetFields();
  }, [visible]);

  return (
    <Modal
      width={700}
      visible={props.visible}
      title={'编辑'}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => props.showModalEdit({ visible: false })}
    >
      <Form
        form={form}
        labelCol={{ span: 3 }}
        onFinish={(fields) => {
          createItem({
            id: id,
            ...fields,
          }).then((r) => {
            if (r.code !== 0) {
              message.error('更新失败:' + r.msg);
              return;
            }
            if (props.onOk) props.onOk();
            message.success('更新成功');
            props.showModalEdit(false);
            return;
          });
        }}
      >
        <Form.Item
          label={'名称'}
          name={'title'}
          rules={[{ required: true, message: '请输入名称' }]}
          initialValue={title}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'代理路劲'}
          name={'proxy_url'}
          rules={[{ required: true, message: '请输入代理路径' }]}
          initialValue={proxy_url}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'菜单标识key'}
          name={'key'}
          rules={[{ required: true, message: '请输入菜单标识key' }]}
          initialValue={key}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'菜单类型'}
          name={'panel_type'}
          rules={[{ required: true, message: '请选择菜单类型' }]}
          initialValue={panel_type}
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

const mapStateToProps = ({ proxymenu }) => {
  return {
    resource: proxymenu.currentEditResource,
    visible: proxymenu.modalConfigEditVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showModalEdit: (payload) =>
      dispatch({
        type: 'proxymenu/showModalEdit',
        payload,
      }),
    createResourceVersion: (payload) =>
      dispatch({
        type: 'proxymenu/createResourceVersion',
        payload,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEdit);
