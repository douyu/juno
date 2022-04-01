import { connect } from 'dva';
import SettingBlock, { useSettingBlock } from '@/pages/manage/SettingBlock';
import React, { useEffect, useState } from 'react';
import { Form, Switch } from 'antd';

function TestPlatformSetting(props) {
  const [saveField, settingProps, form, editing] = useSettingBlock(
    'test_platform',
    props.dispatch,
    false,
  );
  const { setting } = props;

  useEffect(() => {
    form.setFieldsValue(setting);
  }, [setting]);

  return (
    <SettingBlock {...settingProps} title={'测试平台'}>
      <Form form={form}>
        <Form.Item label={'启用'} valuePropName={'checked'} name={'enable'}>
          <Switch disabled={!editing} onChange={(checked) => saveField({ enable: checked })} />
        </Form.Item>
      </Form>
    </SettingBlock>
  );
}

export default connect(({ setting }) => ({
  setting: setting.settings?.test_platform || {},
}))(TestPlatformSetting);
