import React from 'react';
import { PluginProps } from '../type';
import { connect } from 'dva';
import Etcd from '@/pages/etcd/etcd';

export function EtcdPlugin(props: PluginProps) {
  return <Etcd {...props} />;
}
export default connect(({}) => {
  return {};
})(EtcdPlugin);
