import React from "react";
import {connect} from "dva";
import {Form, Input, Modal} from "antd";

function ModalSave(props) {
  const [form] = Form.useForm();
  const {currentConfig, currentContent, visible, showSaveModal, saveConfig} = props

  return <Modal
    visible={visible}
    title={"保存配置文件"}
    onOk={() => {
      form.submit()
    }}
    onCancel={() => {
      showSaveModal(false)
    }}
  >
    <Form
      form={form}
      onFinish={(fields) => {
        let data = {
          id: currentConfig.id,
          content: currentContent,
          ...fields,
        }
        console.log(data)
        saveConfig(data).then(r => {
          if (r && r.code === 0) {
            // success
            showSaveModal(false)
          }
        })
      }}
    >
      <Form.Item label={"Message"} name={"message"} required>
        <Input.TextArea placeholder={"简单描述一下本次修改发生的改变"}/>
      </Form.Item>
    </Form>
  </Modal>
}

const mapStateToProps = ({config}) => {
  return {
    currentContent: config.currentContent,
    currentConfig: config.currentConfig,
    visible: config.visibleModalSave
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showSaveModal: visible => dispatch({
      type: 'config/showSaveModal',
      payload: visible
    }),
    saveConfig: data => dispatch({
      type: 'config/saveConfigFile',
      payload: data
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSave)
