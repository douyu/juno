import React from 'react';
import { Tabs } from 'antd';
import ProxyMenu from './proxymenu';
import ProxyManage from './proxymanage';
import styles from './index.less';
const TabPane = Tabs.TabPane;
export default class ProxyAdmin extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'proxymenu',
    };
  }
  render() {
    const { activeKey } = this.state;
    return (
      <div className={styles.proxyAdmin}>
        <Tabs
          hideAdd
          onChange={(activeKey) => {
            this.setState({
              activeKey,
            });
          }}
          activeKey={activeKey}
          tabPosition="top"
        >
          <TabPane style={{ position: 'relative' }} tab={'代理菜单管理'} key={'proxymenu'}>
            <ProxyMenu {...this.props}></ProxyMenu>
          </TabPane>
          <TabPane style={{ position: 'relative' }} tab={'代理转发管理'} key={'proxymanage'}>
            <ProxyManage {...this.props}></ProxyManage>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
