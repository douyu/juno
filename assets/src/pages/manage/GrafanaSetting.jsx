import React, { useState } from 'react';
import SettingBlock from '@/pages/manage/SettingBlock';
import { connect } from 'dva';
import { Form, Input } from 'antd';

function GrafanaSetting(props) {
  const { grafana } = props.settings;
  const [form] = Form.useForm();
  const [edit, setEdit] = useState(false);

  const onAddGrafana = (fields) => {
    let grafanaValue = grafana || [];
    grafanaValue = [...grafanaValue, fields];

    props
      .dispatch({
        type: 'setting/saveSetting',
        payload: {
          name: 'grafana',
          content: JSON.stringify(grafanaValue),
        },
      })
      .then(() => {
        props.dispatch({
          type: 'setting/loadSettings',
        });
      });
  };

  return (
    <SettingBlock
      editable
      edit={edit}
      onCancel={() => setEdit(false)}
      onEdit={() => setEdit(true)}
      onSave={() => {
        form.submit();
        setEdit(false);
      }}
      title={'Grafana设置'}
    >
      <Form form={form} onFinish={() => {}}>
        <Form.Item label={'Host'}>
          <Input disabled={!edit} />
        </Form.Item>
        <Form.Item label={'Label名称'}>
          <Input disabled={!edit} />
        </Form.Item>
      </Form>
    </SettingBlock>
  );
}

export default connect(({ setting }) => {
  return {
    settings: setting.settings,
  };
})(GrafanaSetting);
