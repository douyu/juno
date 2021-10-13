import React, { useEffect, useRef } from "react";
import { connect } from "dva";
import { Badge, Col, Form, Input, Modal, Row, Table } from "antd";
import { unLock } from '@/services/config';
import { createDiffEditor } from "../Editor/editor";

let editor = null

function ModalSave(props) {
  const loadConfig = (id) => {
    props.dispatch({
      type: 'config/loadConfigDetail',
      payload: { id },
    });
  };

  const editorRef = useRef(null)

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

      setTimeout(() => {
        if (editor) {
          editor.dispose()
        }

        editor = createDiffEditor(
          editorRef,
          currentConfig.content,
          currentContent
        )
      }, 100)
    }

  }, [visible, currentConfig])

  const resourceCheckColumns = [
    { title: '资源名称', key: 'name', dataIndex: 'name' },
    { title: '资源值', key: 'value', dataIndex: 'value' },
    { title: '当前版本', key: 'version', dataIndex: 'version' },
    {
      title: '最新版本', key: 'latest_version', dataIndex: 'latest_version',
      render: (val, row) => {
        if (val === row.version) {

        }
        return <>
          {val === row.version ?
            <Badge status={"success"} />
            : <Badge status={"warning"} />}
          {val}
        </>
      }
    },
  ]


  return <Modal
    visible={visible}
    width={"95vw"}
    style={{
      maxWidth: '1900px'
    }}
    title={"保存配置文件"}
    onOk={() => {
      form.submit()
      // setTimeout(()=>{
      //   unLock(currentConfig.id).then((r) => {
      //     loadConfig(currentConfig.id);
      //   });
      // },100)
    }}
    onCancel={() => {
      showSaveModal(false)
    }}
  >
    <Row gutter={16}>
      <Col flex={"500px"}>
        <Form
          form={form}
          onFinish={(fields) => {
            let data = {
              id: currentConfig.id,
              content: currentContent,
              ...fields,
            }
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
              { required: true, message: '请填写Message' }
            ]}
          >
            <Input.TextArea placeholder={"简单描述一下本次修改发生的改变"} />
          </Form.Item>

          <Form.Item>
            <Table
              bordered
              dataSource={resourceCheckResult}
              loading={resourceCheckLoading}
              columns={resourceCheckColumns}
            />
          </Form.Item>
        </Form>
      </Col>
      <Col flex={"auto"}>
        <div ref={editorRef} style={{
          height: '500px'
        }} />
      </Col>
    </Row>
  </Modal>
}

const mapStateToProps = ({ config }) => {
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
    }),
    dispatch: dispatch,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSave)
