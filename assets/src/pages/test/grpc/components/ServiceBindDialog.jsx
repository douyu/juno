import React, { useEffect } from 'react';
import { Modal, Input, Select, Form } from 'antd';

function ServiceBindDialog(props) {
  const { protoList, appList, onSubmit, ...restProps } = props;
  const [form] = Form.useForm();

  return (
    <Modal
      title={'PB和应用绑定'}
      onOk={() => {
        form.submit();
      }}
      {...restProps}
    >
      <Form
        form={form}
        onFinish={(fields) => {
          onSubmit(fields);
        }}
      >
        <Form.Item label={'PB'} name={'proto_id'} rules={[{ required: true }]}>
          <Select
            showSearch
            optionLabelProp={'fileName'}
            filterOption={(val, opt) => {
              let fileName = opt.props.fileName.toLowerCase();
              let packageName = opt.props.packageName.toLowerCase();
              val = val.toLowerCase();

              return fileName.includes(val) || packageName.includes(val);
            }}
          >
            {(protoList || []).map((item, id) => {
              return (
                <Select.Option
                  key={id}
                  value={item.id}
                  fileName={item.file_name}
                  packageName={item.package_name}
                >
                  <div>
                    <div>
                      {item.file_name.replaceAll('\\', '/').split('/').slice(-1)[0]} (Package:{' '}
                      {item.package_name})
                    </div>
                    <div style={{ fontSize: 12, color: '#3c3c3c' }}>File: {item.file_name}</div>
                  </div>
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label={'应用'} name={'app_name'} rules={[{ required: true }]}>
          <Select showSearch>
            {appList?.map((item, idx) => {
              return (
                <Select.Option key={idx} value={item.app_name}>
                  {item.app_name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ServiceBindDialog;
