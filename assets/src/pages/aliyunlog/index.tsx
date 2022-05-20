import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Tabs, Select, Cascader } from 'antd';
import WelcomeView from './Welcome';
import ProxyView from './proxyView';
import styles from './index.less';

const TabPane = Tabs.TabPane;
const { Option, OptGroup } = Select;
const defaultPanes = [
  {
    title: 'Welcome',
    panelType: 'welcome',
    key: 'welcome',
    config: {
      mode: 1,
      title: 'JUNO',
    },
  },
];
//renderPanel 渲染panel
const renderPanel = (config) => {
  switch (config.panelType) {
    case 'welcome':
      return <WelcomeView {...config.config} />;
    default:
      return <ProxyView {...config.config} />;
  }
};

//renderSelect 渲染panel
const renderSelect = (config, idx) => {
  switch (config.type) {
    case 'group':
      return (
        <OptGroup label={config.title} key={idx}>
          {config.list.map((selectItem) => {
            return (
              <Option key={selectItem.key} value={selectItem.key}>
                {selectItem.title}
              </Option>
            );
          })}
        </OptGroup>
      );
    default:
      return (
        <Option key={config.key} value={config.key}>
          {`${config.panelType}-${config.title}`}
        </Option>
      );
  }
};

const Proxy = (props) => {
  const { aliyunlog, dispatch } = props;
  let selectList = aliyunlog.selectList || [];
  let [panels, updatePanels] = useState([]);
  const [activeKey, updateActiveKey] = useState('welcome');
  let displayPanels = panels.length > 0 ? panels : defaultPanes;
  //remove pannel from target
  let remove = (panels, targetKey) => {
    let activeKey = activeKey;
    let lastIndex;
    panels.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    let tmppanels = panels.filter((pane) => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = tmppanels[lastIndex].key;
    }
    updatePanels(tmppanels);
    updateActiveKey(activeKey);
  };
  //获取UI菜单
  useEffect(() => {
    dispatch({
      type: 'aliyunlog/uilist',
      payload: {},
    });
  }, []);
  return (
    <div
      style={{
        paddingTop: '12px',
        paddingLeft: '12px',
        background: '#fff',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Row style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 12 }}>请选择日志页面:</span>
        <Cascader
          options={selectList}
          showSearch={(inputValue, path) => {
            return path.some(
              (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
            );
          }}
          onChange={(val, option) => {
            let tmplist = panels.filter((item) => {
              return item.key === val.join('_');
            });
            if (tmplist.length > 0) {
              updateActiveKey(activeKey);
            } else {
              let tmpItem = {
                title: val.join('/'),
                key: val.join('_'),
                config: { region: val[0], project: val[1], logstore: val[2], remark: val[2] },
              };
              if (tmpItem) {
                let tmpPanels = [...panels, tmpItem];
                updatePanels(tmpPanels);
                updateActiveKey(val.join('_'));
              }
            }
          }}
          placeholder="请选择日志"
        />
      </Row>
      <div className={styles.cardContainer}>
        <Tabs
          hideAdd
          onChange={(activeKey) => {
            updateActiveKey(activeKey);
          }}
          activeKey={activeKey}
          type="editable-card"
          onEdit={(targetKey, action) => {
            if (action === 'remove') {
              remove(panels, targetKey);
            }
          }}
          tabPosition="top"
        >
          {displayPanels.map((panel, index) => (
            <TabPane style={{ position: 'relative' }} tab={panel.title} key={panel.key}>
              {renderPanel(panel)}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
export default connect(({ aliyunlog, loading }) => ({
  aliyunlog,
  loading: loading.models.aliyunlog,
}))(Proxy);
