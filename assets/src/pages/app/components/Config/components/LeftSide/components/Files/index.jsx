import React, { useEffect } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { DeleteOutlined, FileOutlined, HistoryOutlined, StopOutlined } from '@ant-design/icons';
import OptionButton from '@/pages/app/components/Config/components/OptionButton';
import { Popconfirm, Spin, Tag } from 'antd';
import confirm from 'antd/es/modal/confirm';
import ScrollArea from 'react-scrollbar';

function Files(props) {
  const {
    currentConfig,
    configList,
    configListLoading,
    currentContent,
    deleteConfig,
    aid,
    env,
    loadConfigList,
    appName,
    k8sClusters,
  } = props;
  let { zoneList } = props;
  const fileChanged = currentConfig && currentConfig.content !== currentContent;
  useEffect(() => {
    if (props.appName && props.env) {
      loadConfigList(props.appName, props.env);
    }
  }, []);

  k8sClusters.forEach((cluster) => {
    if (
      cluster.env.indexOf(env) > -1 &&
      zoneList.findIndex((zone) => zone.zone_code === cluster.zone_code) < 0
    ) {
      zoneList.push({
        zone_code: cluster.zone_code,
        zone_name: cluster.zone_name,
      });
    }
  });

  const renderConfigListByZone = (zone) => {
    let configs = (configList || []).filter((item) => item.zone === zone);
    if (configs.length === 0) {
      return (
        <div className={styles.noConfigTip}>
          <StopOutlined />
          该Zone暂无配置
        </div>
      );
    }

    return configs.map((cfg, index) => {
      const active = cfg.id === currentConfig?.id;
      return (
        <li
          key={index}
          className={[styles.configItem, active && styles.configItemActive].join(' ')}
          onClick={() => {
            if (fileChanged) {
              confirm({
                title: '当前配置未保存',
                content: '当前文件修改未保存，切换配置后当前的修改将丢失。是否切换文件?',
                cancelText: '我点错了',
                okText: '确认',
                onOk: () => {
                  props.loadConfigDetail(cfg.id);
                },
              });
            } else {
              props.loadConfigDetail(cfg.id);
            }
          }}
        >
          <div className={styles.configListTextItem}>
            <div>
              {cfg.config_status === 1 ? (
                <Tag color="green">已发布</Tag>
              ) : cfg.config_status === 2 ? (
                <Tag color="yellow">未发布</Tag>
              ) : (
                ''
              )}
              {cfg.name}.{cfg.format}
            </div>
            <div>
              {currentConfig &&
                currentConfig.content !== currentContent &&
                cfg.id === currentConfig.id && <span className={styles.notSavedTip}>未保存</span>}
            </div>
          </div>
          <div>
            <div onClick={(ev) => ev.stopPropagation()}>
              <Popconfirm
                title={'谨慎操作，删除后无法找回.确定删除?'}
                onConfirm={(ev) => {
                  deleteConfig(cfg.id).then((r) => {
                    loadConfigList(props.appName, props.env);
                  });
                }}
              >
                <OptionButton type={'text'}>
                  <DeleteOutlined />
                </OptionButton>
              </Popconfirm>
            </div>
          </div>
        </li>
      );
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className={styles.options}>
        <OptionButton onClick={() => props.showCreateModal(true)} title={'新增配置'}>
          <FileOutlined />
        </OptionButton>
        {currentConfig && (
          <OptionButton title={'历史变更'} onClick={() => props.showHistoryModal(true)}>
            <HistoryOutlined />
          </OptionButton>
        )}
      </div>

      <ul className={styles.zoneList}>
        <ScrollArea style={{ height: '100%' }}>
          {configListLoading && (
            <div style={{ textAlign: 'center', paddingTop: '30px' }}>
              <Spin />
              <div>加载中</div>
            </div>
          )}

          {!configListLoading &&
            zoneList &&
            zoneList.map((zone, index) => {
              return (
                <li key={index}>
                  <div className={styles.zoneTitle}>{zone.zone_name}</div>
                  <ul className={styles.configList}>{renderConfigListByZone(zone.zone_code)}</ul>
                </li>
              );
            })}

          {!configListLoading && (!zoneList || !zoneList.length) && (
            <div className={styles.noConfigTip}>
              <StopOutlined />
              当前应用环境无机房
            </div>
          )}
        </ScrollArea>
      </ul>
    </div>
  );
}

const mapState = ({ config, setting }) => {
  return {
    zoneList: config.zoneList,
    configList: config.configList,
    configListLoading: config.configListLoading,
    currentConfig: config.currentConfig,
    currentContent: config.currentContent,
    aid: config.aid,
    appName: config.appName,
    env: config.env,
    k8sClusters: setting.settings?.k8s_cluster?.list || [],
  };
};

const mapDispatch = (dispatch) => {
  return {
    showCreateModal: (visible) => dispatch({ type: 'config/showCreateModal', payload: visible }),
    showSaveModal: (visible) => dispatch({ type: 'config/showSaveModal', payload: visible }),
    showHistoryModal: (visible) => dispatch({ type: 'config/showHistoryModal', payload: visible }),
    loadConfigDetail: (id) =>
      dispatch({
        type: 'config/loadConfigDetail',
        payload: { id },
      }),
    deleteConfig: (id) =>
      dispatch({
        type: 'config/deleteConfig',
        payload: id,
      }),
    loadConfigList: (appName, env) =>
      dispatch({
        type: 'config/loadConfigInfo',
        payload: {
          appName,
          env,
        },
      }),
    dispatch: dispatch,
  };
};

export default connect(mapState, mapDispatch)(Files);
