import {Form, message, Modal} from "antd";
import {ModalProps} from "antd/es/modal";
import React, {useEffect, useState} from "react";
import JobFormFields from "@/pages/cronjob/JobFormFields";
import {Job} from "@/models/cronjob/types";

interface ModalEditJobProps extends ModalProps {
  job?: Job
}

export default function ModalEditJob(props: ModalEditJobProps) {
  const {job} = props
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  useEffect(() => {
    props.visible && form.setFieldsValue({
      ...job
    })
  }, [job, props.visible])

  return <Modal
    {...props}
    title={"编辑Job"}
    width={1000}
    confirmLoading={confirmLoading}
    onOk={ev => {
      setConfirmLoading(true)
      setTimeout(() => {
        setConfirmLoading(false)
        message.success("保存成功")
      }, 1000)
    }}
  >
    <Form form={form}>
      <JobFormFields job={job} form={form}/>
    </Form>
  </Modal>
};
