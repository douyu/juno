import { PluginMeta, PluginProps } from './plugins/type';
import { Tabs } from 'antd';
import GrpcPlugin from './plugins/grpc';
import EventPlugin from './plugins/event';
import EtcdPlugin from './plugins/etcd';
import WebEmbedPlugin from './plugins/webembed';
import PprofPlugin from './plugins/pprof';
import AppLogPlugin from './plugins/applog';
// import ConfigPlugin from './plugins/config';

const { TabPane } = Tabs;

export let commonPluginlist = [
  // {
  //   key: 'config',
  //   type: 'config',
  //   name: '配置',
  //   body: ConfigPlugin,
  // },
  {
    key: 'applog',
    type: 'applog',
    name: '日志',
    body: AppLogPlugin,
  },
  {
    key: 'pprof',
    type: 'pprof',
    name: 'Pprof',
    body: PprofPlugin,
  },
  {
    key: 'etcd',
    type: 'etcd',
    name: 'Etcd',
    body: EtcdPlugin,
  },
  {
    key: 'event',
    type: 'event',
    name: '事件',
    body: EventPlugin,
  },
  {
    key: 'grpc',
    type: 'grpc',
    name: 'grpc',
    body: GrpcPlugin,
  },
];

export function renderplugin(list: PluginMeta[], props: PluginProps) {
  return list.map((item: PluginMeta) => {
    let active = props.activeTab === item.key;
    if (item.body) {
      return (
        <TabPane tab={item.name} key={item.key}>
          <item.body {...props} meta={item.meta} active={active} />
        </TabPane>
      );
    }
    switch (item.type) {
      case 'webembed':
        return (
          <TabPane tab={item.name} key={item.key}>
            <WebEmbedPlugin {...props} meta={item.meta} active={active} />
          </TabPane>
        );
      default:
        return;
    }
  });
}
