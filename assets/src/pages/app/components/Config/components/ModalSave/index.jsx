import React, {useEffect} from "react";
import {connect} from "dva";
import {Badge, Form, Input, Modal, Table} from "antd";

function ModalSave(props) {
  const [form] = Form.useForm();
  const {
    currentConfig, currentContent, visible, showSaveModal, saveConfig,
    resourceCheckResult, resourceCheckLoading
  } = props

  useEffect(() => {
    if (visible && currentConfig) {
      props.checkResource({
        env: currentConfig.env,
        zone: currentConfig.zone,
        content: currentContent
      })
    }

  }, [visible, currentConfig])

  const resourceCheckColumns = [
    {title: '资源名称', key: 'name', dataIndex: 'name'},
    {title: '资源值', key: 'value', dataIndex: 'value'},
    {title: '当前版本', key: 'version', dataIndex: 'version'},
    {
      title: '最新版本', key: 'latest_version', dataIndex: 'latest_version',
      render: (val, row) => {
        if (val === row.version) {

        }
        return <>
          {val === row.version ?
            <Badge status={"success"}/>
            : <Badge status={"warning"}/>}
          {val}
        </>
      }
    },
  ]

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
      <Form.Item
        label={"Message"} name={"message"}
        rules={[
          {required: true, message: '请填写Message'}
        ]}
      >
        <Input.TextArea placeholder={"简单描述一下本次修改发生的改变"}/>
      </Form.Item>

      <Form.Item>
        <Table
          dataSource={resourceCheckResult}
          loading={resourceCheckLoading}
          columns={resourceCheckColumns}
        />
      </Form.Item>
    </Form>
  </Modal>
}

const mapStateToProps = ({config}) => {
  return {
    currentContent: config.currentContent,
    currentConfig: config.currentConfig,
    visible: config.visibleModalSave,
    resourceCheckResult: config.resourceCheckResult,
    resourceCheckLoading: config.resourceCheckLoading,
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
    }),
    checkResource: payload => dispatch({
      type: 'config/checkResource',
      payload: {
        env: payload.env,
        zone: payload.zone,
        content: payload.content,
      }
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSave)
