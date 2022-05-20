import React from 'react';
import { PluginProps } from '../type';
import { connect } from 'dva';
import Etcd from '@/pages/etcd/etcd';
import Applog from '@/pages/aliyunlog';

export function AppLogPlugin(props: PluginProps) {
  return <Applog {...props} />;
}
export default connect(({}) => {
  return {};
})(AppLogPlugin);
