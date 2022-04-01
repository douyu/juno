import React from 'react';
import { PluginProps } from '../type';
import { connect } from 'dva';
import Grpcadmin from '@/pages/grpcadmin/index';

export function GrpcPlugin(props: PluginProps) {
  return <Grpcadmin {...props} />;
}
export default connect(({}) => {
  return {};
})(GrpcPlugin);
