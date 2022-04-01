import React from 'react';
import { PluginProps } from '../type';
import { connect } from 'dva';
import Event from '@/pages/app/components/Event';

export function EvenPlugin(props: PluginProps) {
  return <Event {...props} />;
}
export default connect(({}) => {
  return {};
})(EvenPlugin);
