import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { message, Modal, Select, Spin } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import OptionButton from '@/pages/app/components/Config/components/OptionButton';
import { StopOutlined } from '@ant-design/icons/lib';
import InstanceDetail from '@/pages/app/components/Config/components/LeftSide/components/Publish/InstanceDetail';

function Publish(props: any) {
  const {
    loadConfigInstances,
    configList,
    configInstanceListLoading,
    configInstanceList,
    configPublish,
    loadConfigHistory,
    historyList,
    historyListLoading,
    showEditorMaskLayer,
    setCurrentInstance,
  } = props;

  const [visible, setVisible] = useState(false);
  const [version, setVersion] = useState('');
  const [configFile, setConfigFile] = useState<{
    aid: number;
    env: string;
    zone: string;
    id: number;
  }>();

  useEffect(() => {
    if (!configFile) {
      if (configList && configList.length > 0) {
        setConfigFile(configList[0]);
        loadConfigInstances(
          configList[0].aid,
          configList[0].env,
          configList[0].zone,
          configList[0].id,
        );
      }
      return;
    }
    if (historyList && historyList.length > 0) {
      setVersion(historyList[0].version);
    }
  }, [configFile]);

  let publishStart = () => {
    if (!configFile) {
      message.error('请选择配置文件再进行发布');
    }

    setVisible(true);
    loadConfigHistory(configFile?.id);
  };

  let selectVersion = (val: string) => {
    setVersion(val);
  };

  let handleCancel = () => {
    setVisible(false);
  };

  let handleOk = () => {
    configPublish(configFile?.id, version);
    loadConfigInstances(configFile?.aid, configFile?.env, configFile?.zone, configFile?.id);
    setVisible(false);
  };

  let selectConfigFile = (val: any, target: any) => {
    setConfigFile(target.props.config);
    loadConfigInstances(
      target.props.config.aid,
      target.props.config.env,
      target.props.config.zone,
      target.props.config.id,
    );
  };

  return (
    <div className={styles.publish}>
      <Select
        style={{ width: '100%' }}
        loading={configInstanceListLoading}
        onChange={selectConfigFile}
        value={configFile && configFile.id}
      >
        {configList.map((item: any, index: any) => {
          return (
            <Select.Option value={item.id} config={item} key={index}>
              {item.name}.{item.format}
            </Select.Option>
          );
        })}
      </Select>

      <div style={{ marginTop: '10px' }}>
        <OptionButton style={{ width: '100%' }} onClick={publishStart}>
          发布
        </OptionButton>
      </div>

      {!configFile && (
        <div className={styles.tipConfigNotSelect}>
          <StopOutlined />
          请先选择配置文件
        </div>
      )}

      {configInstanceListLoading && (
        <div className={styles.instanceListLoading}>
          <Spin tip={'实例加载中'} />
        </div>
      )}

      {configFile && !configInstanceListLoading && (
        <ul className={styles.instanceList}>
          {configInstanceList != undefined &&
            configInstanceList.map((item: any, index: any) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    setCurrentInstance(item);
                    showEditorMaskLayer(true, <InstanceDetail />);
                  }}
                >
                  <div className={styles.instanceName}>
                    <div className={styles.icon}>
                      <DatabaseOutlined />
                    </div>
                    <div>{item.host_name}</div>
                  </div>

                  <div className={styles.instanceStatus}>
                    <div
                      className={
                        item.config_file_used ? styles.statusSynced : styles.statusNotSynced
                      }
                    >
                      接入状态
                    </div>
                    <div
                      className={
                        item.config_file_synced ? styles.statusSynced : styles.statusNotSynced
                      }
                    >
                      发布状态
                    </div>
                    <div
                      className={
                        item.config_file_take_effect ? styles.statusSynced : styles.statusNotSynced
                      }
                    >
                      生效状态
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      )}

      <Modal title="配置发布" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Select
          style={{ width: '100%' }}
          loading={historyListLoading}
          onSelect={selectVersion}
          value={version}
        >
          {historyList != undefined &&
            historyList.map((item: any, index: any) => {
              return (
                <Select.Option value={item.version} key={index}>
                  {item.version}.{item.change_log}
                </Select.Option>
              );
            })}
        </Select>
      </Modal>
    </div>
  );
}

const mapStateToProps = ({ config }: any) => {
  console.log('mapStateToProps -> config', config);
  return {
    aid: config.aid,
    env: config.env,
    configList: config.configList,
    configInstanceList: config.configInstanceList,
    zoneCode: config.zoneCode,
    historyList: config.historyList,
    historyListLoading: config.historyListLoading,
    configInstanceListLoading: config.configInstanceListLoading,
    currentConfig: config.currentConfig,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadConfigInstances: (aid: any, env: any, zoneCode: any, configurationID: number) =>
      dispatch({
        type: 'config/loadConfigInstances',
        payload: {
          aid,
          env,
          zoneCode,
          configurationID,
        },
      }),

    loadConfigHistory: (id: number) =>
      dispatch({
        type: 'config/loadHistory',
        payload: {
          id,
          page: 0,
          size: 10000,
        },
      }),

    configPublish: (id: number, version: string) =>
      dispatch({
        type: 'config/configPublish',
        payload: {
          id,
          version,
        },
      }),
    showEditorMaskLayer: (visible: boolean, child?: Element) =>
      dispatch({
        type: 'config/showEditorMaskLayer',
        payload: {
          visible,
          child,
        },
      }),
    setCurrentInstance: (instance: any) =>
      dispatch({
        type: 'config/setCurrentInstance',
        payload: instance,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Publish);
