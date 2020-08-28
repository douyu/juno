import React, {useState} from "react";
import {ModalProps} from "antd/es/modal";
import {Form, message, Modal} from "antd";
import JobFormFields from "@/pages/cronjob/JobFormFields";
import {connect} from "dva";
import {ConnectState} from "@/models/connect";

interface ModalNewJobProps extends ModalProps {
}

function ModalNewJOb (props: ModalNewJobProps) {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  return <Modal
    {...props}
    title={"新建 Job"}
    width={1000}
    confirmLoading={confirmLoading}
    onOk={(ev) => {
      setConfirmLoading(true)
      form.validateFields().then(fields => {
        setTimeout(() => {
          setConfirmLoading(false)
          console.log(fields)
          message.success("创建成功")
          props.onOk && props.onOk(ev)
        }, 2000)
      }).catch(e => {
        setConfirmLoading(false)
      })
    }}
  >
    <Form
      form={form}
    >
      <JobFormFields form={form}/>
    </Form>
  </Modal>
}

export default connect(
  ({app}: ConnectState) => {
    return {
      appList: app.list,
    }
  }
)(ModalNewJOb)
