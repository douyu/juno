import React from 'react';
import { PluginProps } from '../type';
import { connect } from 'dva';
import Etcd from '@/pages/etcd/etcd';
import PPofList from '../../../pprof/pprof';

export function PprofPlugin(props: PluginProps) {
  return <PPofList {...props} />;
}
export default connect(({}) => {
  return {};
})(PprofPlugin);
