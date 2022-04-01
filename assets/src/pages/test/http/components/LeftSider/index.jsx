import React from 'react';
import { Tabs } from 'antd';
import RequestItem from './RequestItem';
import CollectionsTab from './CollectionsTab';
import styles from './index.less';
import { connect } from 'dva';
import HistoryTab from '@/pages/test/http/components/LeftSider/HistoryTab';

function LeftSider(props) {
  return (
    <div>
      <Tabs
        defaultActiveKey={'collections'}
        type={'card'}
        destroyInactiveTabPane
        renderTabBar={(props, DefaultTabBar) => {
          return (
            <DefaultTabBar
              {...props}
              style={{
                backgroundColor: 'rgb(250,250,250)',
                padding: '10px 0 0 10px',
              }}
            />
          );
        }}
      >
        <Tabs.TabPane key={'history'} tab={'History'}>
          <HistoryTab />
        </Tabs.TabPane>
        <Tabs.TabPane key={'collections'} tab={'Collections'}>
          <CollectionsTab {...props} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default connect()(LeftSider);
