import React, { useEffect, useState } from 'react';
import { ModalProps } from 'antd/es/modal';
import { Form, message, Modal } from 'antd';
import JobFormFields from '@/pages/cronjob/JobFormFields';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { createJob } from '@/services/taskplatform';
import { Job } from '@/models/cronjob/types';

interface ModalNewJobProps extends ModalProps {}

function ModalNewJOb(props: ModalNewJobProps) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { visible } = props;

  useEffect(() => form.resetFields(), [visible]);

  return (
    <Modal
      {...props}
      title={'新建 Job'}
      width={1000}
      confirmLoading={confirmLoading}
      onOk={(ev) => {
        setConfirmLoading(true);
        form
          .validateFields()
          .then((fields) => {
            createJob(fields as Job)
              .then((r) => {
                setConfirmLoading(false);

                if (r.code === 0) {
                  message.success('创建成功');
                  props.onOk && props.onOk(ev);
                } else {
                  message.error('创建失败: ' + r.msg);
                }
              })
              .catch((e) => {
                message.error('创建失败');
                setConfirmLoading(false);
              });
          })
          .catch((e) => {
            setConfirmLoading(false);
          });
      }}
    >
      <Form form={form}>
        <JobFormFields form={form} />
      </Form>
    </Modal>
  );
}

export default connect(({ app }: ConnectState) => {
  return {
    appList: app.list,
  };
})(ModalNewJOb);
