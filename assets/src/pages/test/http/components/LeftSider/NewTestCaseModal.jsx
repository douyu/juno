import React, {useEffect} from 'react';
import {Form, Input, Modal, Select, TreeSelect} from "antd";
import {connect} from "dva";

function NewTestCaseModal(props) {
  const {visible, confirmLoading, dispatch, currentAppName, collections, selectedCollection, currentRequest} = props;
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        collection_id: selectedCollection ? parseInt(selectedCollection): null
      })
    }
  }, [visible])

  return <Modal
    visible={visible}
    confirmLoading={confirmLoading}
    title={"新建用例"}
    onOk={() => form.submit()}
    onCancel={() => {
      dispatch({
        type: 'HttpDebug/showModalNewTestCase',
        payload: {
          visible: false
        }
      })
    }}
  >
    <Form
      form={form}
      onFinish={(fields) => {
        let payload = {
          ...fields,
        }

        if (!currentRequest.id) {
          payload = {...currentRequest, ...payload}
        }

        dispatch({
          type: 'HttpDebug/createTestCase',
          payload: payload
        }).then(r => {
          dispatch({
            type: 'HttpDebug/fetchCollections',
            payload: {
              appName: currentAppName
            }
          })
        })
      }}
    >
      <Form.Item label={"Collection"} name={"collection_id"} rules={[{required: true, message: "请选择 Collection"}]}>
        <Select disabled={selectedCollection && true}>
          {(collections||[]).map(item => {
            return <Select.Option value={item.id} key={item.id}>
              {item.name}
            </Select.Option>
          })}
        </Select>
      </Form.Item>

      <Form.Item label={"用例名称"} name={"name"} rules={[{required: true, message: "请输入请求名称"}]}>
        <Input/>
      </Form.Item>
    </Form>
  </Modal>
}

export default connect(({HttpDebug}) => {
  return {
    visible: HttpDebug.visibleModalNewTestCase,
    confirmLoading: HttpDebug.confirmNewTestCaseLoading,
    currentAppName: HttpDebug.currentAppName,
    collections: HttpDebug.collections,
    selectedCollection: HttpDebug.selectedCollection,
    currentRequest: HttpDebug.currentRequest
  }
})(NewTestCaseModal)
