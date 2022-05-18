import React, { useEffect, useState } from 'react';
import { Form, message, Modal, Select } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { Job } from '@/models/cronjob/types';
import { ServiceAppNodeList } from '@/services/app';
import { dispatchJob } from '@/services/taskplatform';

interface ModalTriggerJobProps extends ModalProps {
  job: Job;
}

function ModalTriggerJob(props: ModalTriggerJobProps) {
  const { app_name, env, zone, id } = props.job;
  const [form] = Form.useForm();
  const [nodeList, setNodeList] = useState<any[]>([]);

  useEffect(() => {
    form.setFieldsValue({ id });

    if (app_name && env && zone) {
      ServiceAppNodeList({ app_name: app_name, env: env, zone_code: zone, pageSize: 10000 }).then(
        (r) => {
          setNodeList(r.data.list);
        },
      );
    }
  }, [app_name, env, zone]);

  return (
    <Modal
      {...props}
      title={
        <>
          触发任务 [<b>{props.job.name}</b>]
        </>
      }
      onOk={(ev) => {
        form
          .validateFields()
          .then((fields) => {
            dispatchJob(fields.id, fields.node)
              .then((r) => {
                if (r.code === 14000) {
                  return;
                }
                if (r.code !== 0) {
                  message.error('触发失败 ' + r.msg);
                  return;
                }

                message.success('触发成功');
                props.onOk && props.onOk(ev);
              })
              .catch((e) => {
                message.error('触发失败');
              });
          })
          .catch((e) => {});
      }}
    >
      <Form form={form}>
        <Form.Item hidden name={'id'} />

        <Form.Item name={'node'} label={'Node'} rules={[{ required: true, message: '请选择节点' }]}>
          <Select>
            {nodeList &&
              nodeList.map((node: any, index) => (
                <Select.Option key={index} value={node.host_name}>
                  {node.host_name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalTriggerJob;
