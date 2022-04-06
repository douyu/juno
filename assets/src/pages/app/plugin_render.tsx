import { PluginMeta, PluginProps } from './plugins/type';
import { Tabs } from 'antd';
import GrpcPlugin from './plugins/grpc';
import EventPlugin from './plugins/event';
import EtcdPlugin from './plugins/etcd';
import WebEmbedPlugin from './plugins/webembed';

const { TabPane } = Tabs;

export function renderplugin(list: PluginMeta[], props: PluginProps) {
  return list.map((item: PluginMeta) => {
    let active = props.activeTab === item.key;
    switch (item.type) {
      case 'grpc':
        return (
          <TabPane tab={item.name} key={item.key}>
            <GrpcPlugin {...props} meta={item.meta} active={active} />
          </TabPane>
        );
      case 'event':
        return (
          <TabPane tab={item.name} key={item.key}>
            <EventPlugin {...props} meta={item.meta} active={active} />
          </TabPane>
        );
      case 'etcd':
        return (
          <TabPane tab={item.name} key={item.key}>
            <EtcdPlugin {...props} meta={item.meta} active={active} />
          </TabPane>
        );
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
