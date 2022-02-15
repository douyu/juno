import React, { useEffect } from "react";
import { Form, Input, Modal, Radio, Select, message, Switch } from "antd";
import { connect } from "dva";
import { createItem } from '../../../services/proxymanage';
function ModalEdit(props) {
  const { visible, onOk } = props
  const { id, sub_path, title, is_rewrite, proxy_addr } = props.resource
  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) {
      return
    }
    form.resetFields()
  }, [visible])

  return <Modal
    width={700}
    visible={props.visible} title={"编辑"}
    onOk={() => {
      form.submit()
    }}
    onCancel={() => props.showModalEdit({ visible: false })}
  >

    <Form
      form={form} labelCol={{ span: 3 }}
      onFinish={(fields) => {
        createItem({
          id: id,
          ...fields,
          is_rewrite: fields.is_rewrite ? 1 : 0,
        }).then((r) => {
          if (r.code !== 0) {
            message.error('更新失败:' + r.msg);
            return;
          }
          if (props.onOk) props.onOk();
          message.success("更新成功");
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
        label={'子路径'}
        name={'sub_path'}
        rules={[{ required: true, message: '请输入子路径' }]}
        initialValue={sub_path}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={'代理路径'}
        name={'proxy_addr'}
        rules={[{ required: true, message: '请输入代理路径' }]}
        initialValue={proxy_addr}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={'是否重写'}
        name={'is_rewrite'}
        valuePropName="checked"
        rules={[{ required: true, message: '选择是否重写' }]}
        initialValue={is_rewrite === 1}
      >
        <Switch checkedChildren="开启" unCheckedChildren="关闭" />
      </Form.Item>

    </Form>
  </Modal>;
}

const mapStateToProps = ({ proxymanage }) => {
  return {
    resource: proxymanage.currentEditResource,
    visible: proxymanage.modalConfigEditVisible,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showModalEdit: (payload) => dispatch({
      type: 'proxymanage/showModalEdit',
      payload,
    }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalEdit)
