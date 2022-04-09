import { ComponentType } from 'react';

export interface PluginProps {}

export interface PluginMeta {
  key: string;
  type: string;
  name: string;
  meta?: any;
  body?: ComponentType<PluginProps>;
}
