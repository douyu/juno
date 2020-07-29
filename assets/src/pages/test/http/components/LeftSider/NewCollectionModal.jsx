import React from 'react';
import {Form, Input, Modal} from "antd";
import {connect} from "dva";

function NewCollectionModal(props) {
  const {visible, dispatch, currentAppName, confirmLoading, currentRequest} = props;
  const [form] = Form.useForm()
  const onOk = () => {
    form.validateFields().then((fields) => {
      dispatch({
        type: 'HttpDebug/createCollection',
        payload: {
          ...fields,
          appName: currentAppName
        }
      }).then(r => {
        dispatch({
          type: 'HttpDebug/fetchCollections',
          payload: {
            appName: currentAppName
          }
        })
      })
    })
  };

  return <Modal
    visible={visible}
    title={"新建 Collection"}
    onOk={onOk}
    confirmLoading={confirmLoading}
    onCancel={() => {
      dispatch({
        type: 'HttpDebug/showModalNewCollection',
        payload: false
      })
    }}
  >
    <Form form={form}>
      <Form.Item label={"Name"} name={"name"} rules={[{required: true, message: 'Collection name is required'}]}>
        <Input/>
      </Form.Item>
    </Form>
  </Modal>
}

const mapStateToProps = ({HttpDebug}) => {
  return {
    visible: HttpDebug.visibleModalNewCollection,
    currentAppName: HttpDebug.currentAppName,
    confirmLoading: HttpDebug.confirmNewCollectionLoading,
    currentRequest: HttpDebug.currentRequest
  }
}

export default connect(
  mapStateToProps,
)(NewCollectionModal)
