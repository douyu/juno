import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import {Checkbox, Empty, message, Select, Spin} from 'antd';
import {DatabaseOutlined} from '@ant-design/icons';
import OptionButton, {ButtonType} from '@/pages/app/components/Config/components/OptionButton';
import InstanceDetail from '@/pages/app/components/Config/components/LeftSide/components/Publish/InstanceDetail';
import ScrollArea from 'react-scrollbar';
import {ReloadOutlined, StopOutlined, BorderOutlined, CheckSquareOutlined} from '@ant-design/icons/lib';
import ModalPublish from '@/pages/app/components/Config/components/LeftSide/components/Publish/ModalPublish';
import {CheckboxChangeEvent} from "antd/es/checkbox";
import styles from './index.less';

function Publish(props: any) {
  const {
    loadConfigInstances,
    configList,
    configInstanceListLoading,
    configInstanceList,
    configPublish,
    showEditorMaskLayer,
    setCurrentInstance,
    currentConfig,
  } = props;

  const [visibleModalPublish, setVisibleModalPublish] = useState(false);
  const [configFile, setConfigFile] = useState<{
    aid: number;
    env: string;
    zone: string;
    id: number;
  }>();
  const [checkedInstances, setCheckedInstances] = useState<string[]>([])

  useEffect(() => {
    if (!configFile) {
      if (currentConfig) {
        setConfigFile(currentConfig);
        loadConfigInstances(
          currentConfig.aid,
          currentConfig.env,
          currentConfig.zone,
          currentConfig.id,
        );
        return;
      }

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
  }, [configFile]);

  let publishStart = () => {
    if (!configFile) {
      message.error('请选择配置文件再进行发布');
    }

    setVisibleModalPublish(true);
    // loadConfigHistory(configFile?.id);
  };

  let handlePublishConfig = (version: string) => {
    configPublish(configFile?.id, version, checkedInstances);
    loadConfigInstances(configFile?.aid, configFile?.env, configFile?.zone, configFile?.id);
    setVisibleModalPublish(false);
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

  const isCheckedInstance = (hostName: string) : boolean => {
    return checkedInstances.findIndex(item => item === hostName) > -1
  }

  const onToggleInstanceCheck = (ev: CheckboxChangeEvent) => {
    let checked = checkedInstances.filter(hostName => hostName != ev.target.name)

    if (ev.target.checked) {
      checked = [...checked, ev.target.name || '']
    }

    setCheckedInstances(checked)
  }

  return (
    <div className={styles.publish}>
      <div className={styles.optionBlock}>
        <Select
          placeholder={'选择配置文件'}
          style={{width: '100%'}}
          loading={configInstanceListLoading}
          onChange={selectConfigFile}
          value={configFile && configFile.id}
          dropdownClassName={'publishConfigSelectDropDown'}
          className={'publishConfigSelect'}
        >
          {configList.map((item: any, index: any) => {
            return (
              <Select.Option value={item.id} config={item} key={index}>
                {item.name}.{item.format}
              </Select.Option>
            );
          })}
        </Select>

        <div style={{marginTop: '10px'}}>
          {checkedInstances.length === 0 && <OptionButton style={{width: '100%'}} disabled>
            请先选择发布的实例
          </OptionButton>}
          {checkedInstances.length > 0 && <OptionButton style={{width: '100%'}} onClick={publishStart}>
            发布
          </OptionButton>}
        </div>
      </div>

      {!configFile && (
        <div className={styles.tipConfigNotSelect}>
          <StopOutlined/>
          请先选择配置文件
        </div>
      )}

      {configInstanceListLoading && (
        <div className={styles.instanceListLoading}>
          <Spin tip={'实例加载中'}/>
        </div>
      )}

      {!configInstanceListLoading && !configList && (
        <div>
          <Empty description={'暂无实例'}/>
        </div>
      )}

      {configFile && !configInstanceListLoading && configInstanceList && (
        <ScrollArea className={styles.instanceListScroll} smoothScrolling={true}>
          <ul className={styles.instanceList}>
            <div className={styles.instanceListOpt}>
              <div className={styles.instanceListTitle}>实例列表</div>
              <div style={{textAlign: 'right'}}>
                {configInstanceList.length === checkedInstances.length && <OptionButton
                  type={ButtonType.Text}
                  title={"取消选中所有实例"}
                  onClick={() => {
                    setCheckedInstances([])
                  }}
                >
                  <CheckSquareOutlined/>
                </OptionButton>}
                {configInstanceList.length !== checkedInstances.length && <OptionButton
                  type={ButtonType.Text}
                  title={"选中所有实例"}
                  onClick={() => {
                    setCheckedInstances(configInstanceList.map((item: any) => item.host_name))
                  }}
                >
                  <BorderOutlined/>
                </OptionButton>}
                <OptionButton
                  onClick={() => {
                    loadConfigInstances(
                      configFile?.aid,
                      configFile?.env,
                      configFile?.zone,
                      configFile?.id,
                    );
                  }}
                  type={ButtonType.Text}
                  title={'刷新实例列表'}
                >
                  <ReloadOutlined/>
                </OptionButton>
              </div>
            </div>

            {configInstanceList.map((item: any, index: any) => {
              let shortVersion = '';
              if (item.version != '') {
                shortVersion = item.version.substring(0, 7);
              }
              return (
                <li
                  className={styles.instanceListItem}
                  key={index}
                  onClick={() => {
                    setCurrentInstance(item);
                    showEditorMaskLayer(true, <InstanceDetail config={configFile}/>);
                  }}
                >
                  <div className={styles.instanceInfo}>
                    <div className={styles.icon}>
                      <DatabaseOutlined/>
                    </div>
                    <div>
                      <div className={styles.instanceName}>{item.host_name}</div>
                      <div className={styles.version}>版本: {shortVersion || '---'}</div>
                    </div>
                    <div className={styles.instanceCheckBox}>
                      <Checkbox onChange={onToggleInstanceCheck} name={item.host_name} checked={isCheckedInstance(item.host_name)}/>
                    </div>
                  </div>

                  <div className={styles.instanceStatus}>
                    <div
                      className={
                        item.config_file_used ? styles.statusSynced : styles.statusNotSynced
                      }
                    >
                      {item.config_file_used ? '已接入' : '未接入'}
                    </div>
                    <div
                      className={
                        item.config_file_synced ? styles.statusSynced : styles.statusNotSynced
                      }
                    >
                      {item.config_file_synced ? '已发布' : '未发布'}
                    </div>
                    {item.config_file_take_effect < 2 && <div
                      className={
                        item.config_file_take_effect ? styles.statusSynced : styles.statusNotSynced
                      }
                    >
                      {item.config_file_take_effect ? '已生效' : '未生效'}
                    </div>}
                  </div>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      )}

      <ModalPublish
        visible={visibleModalPublish}
        onCancel={() => setVisibleModalPublish(false)}
        configID={configFile && configFile.id}
        onSubmit={(version: string) => handlePublishConfig(version)}
      />
    </div>
  );
}

const mapStateToProps = ({config}: any) => {
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

    configPublish: (id: number, version: string, instances: string[]) =>
      dispatch({
        type: 'config/configPublish',
        payload: {
          id,
          version,
          host_name: instances
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

