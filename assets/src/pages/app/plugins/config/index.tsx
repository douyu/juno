import React from 'react';
import { PluginProps } from '../type';
import { connect } from 'dva';
import Etcd from '@/pages/etcd/etcd';
import Config from '../../components/Config';

export function ConfigPlugin(props: PluginProps) {
  return <Config {...props} />;
}
export default connect(({}) => {
  return {};
})(ConfigPlugin);
