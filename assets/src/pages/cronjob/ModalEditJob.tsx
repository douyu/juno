import { Form, message, Modal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import React, { useEffect, useState } from 'react';
import JobFormFields from '@/pages/cronjob/JobFormFields';
import { Job } from '@/models/cronjob/types';
import { updateJob } from '@/services/taskplatform';

interface ModalEditJobProps extends ModalProps {
  job?: Job;
}

export default function ModalEditJob(props: ModalEditJobProps) {
  const { job } = props;
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  useEffect(() => {
    props.visible &&
      form.setFieldsValue({
        ...job,
      });
  }, [job, props.visible]);

  return (
    <Modal
      {...props}
      title={'编辑Job'}
      width={1000}
      confirmLoading={confirmLoading}
      onOk={(ev) => {
        setConfirmLoading(true);
        form.validateFields().then((fields) => {
          updateJob(fields as Job)
            .then((r) => {
              setConfirmLoading(false);
              if (r.code === 14000) {
                return;
              }

              if (r.code !== 0) {
                message.error('保存失败 ' + r.msg);
                return;
              }

              props.onOk && props.onOk(ev);
              message.success('保存成功');
            })
            .catch((e) => {
              setConfirmLoading(false);
              message.error('保存失败');
            });
        });
      }}
    >
      <Form form={form}>
        <Form.Item hidden name={'id'} />

        <JobFormFields job={job} form={form} />
      </Form>
    </Modal>
  );
}
