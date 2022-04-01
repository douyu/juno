import { PluginMeta, PluginProps } from './plugins/type';
import { Tabs } from 'antd';
import GrpcPlugin from './plugins/grpc';
import EventPlugin from './plugins/event';
import EtcdPlugin from './plugins/etcd';

const { TabPane } = Tabs;

export function renderplugin(list: PluginMeta[], props: PluginProps) {
  return list.map((item: PluginMeta) => {
    switch (item.key) {
      case 'grpc':
        return (
          <TabPane tab={item.name} key={item.key}>
            <GrpcPlugin {...props} meta={item.meta} />
          </TabPane>
        );
      case 'event':
        return (
          <TabPane tab={item.name} key={item.key}>
            <EventPlugin {...props} meta={item.meta} />
          </TabPane>
        );
      case 'etcd':
        return (
          <TabPane tab={item.name} key={item.key}>
            <EtcdPlugin {...props} meta={item.meta} />
          </TabPane>
        );
      default:
        return;
    }
  });
}
