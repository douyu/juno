import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { message, Spin, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { createEditor } from '@/pages/app/components/Config/components/Editor/editor';
import ModalInsertResource from '@/pages/app/components/Config/components/ModalInsertResource';
import { loadResourceByNameVersion, loadResourceDetail } from '@/services/config_resource';
import { fetchLock, unLock } from '@/services/config';
import OptionButton from '@/pages/app/components/Config/components/OptionButton';
import confirm from 'antd/es/modal/confirm';
import { useKeyPress, useSize } from 'ahooks';
import ModalPublish from '@/pages/app/components/Config/components/LeftSide/components/Publish/ModalPublish';

let editor = null;
let configLockIntervalId = null;
let lockConfigId = null;

function Editor(props) {
  const { currentConfig, mode, configFileLoading, currentContent, currentUser, historyList } =
    props;
  const currentEditUser = currentConfig?.current_edit_user;
  const [insertModalCB, setInsertModalCB] = useState(null);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const fileChanged = currentConfig && currentConfig.content !== currentContent;
  const containerSize = useSize(containerRef);
  const showModalInsertResource = (visible) =>
    props.dispatch({
      type: 'config/showModalInsertResource',
      payload: visible,
    });

  const onInsertResource = (callback) => {
    showModalInsertResource(true);
    setInsertModalCB({ callback });
  };

  const loadConfig = (id) => {
    props.dispatch({
      type: 'config/loadConfigDetail',
      payload: { id },
    });
  };

  const onLoadResourceDetail = (resource) => {
    return new Promise((resolve, reject) => {
      if (!currentConfig) {
        console.log('currentConfig', currentConfig);
        reject();
        return;
      }

      if (!resource || !resource.length) {
        reject();
        return;
      }

      const name = resource.split('@')[0];
      loadResourceByNameVersion(currentConfig.env, currentConfig.zone, name).then((r) => {
        if (r.code !== 0) {
          console.error('loadResourceByNameVersion failed:', r);
          reject();
          return;
        }

        resolve(r.data);
      });
    });
  };

  const tryLock = () => {
    fetchLock(currentConfig.id).then((r) => {
      lockConfigId = currentConfig.id;

      if (r.code === 14000) return;
      if (r.code !== 0) {
        message.error('获取编辑锁失败:' + r.msg);
        return;
      }

      loadConfig(currentConfig.id);
    });
  };

  const showSaveModal = (visible) =>
    props.dispatch({ type: 'config/showSaveModal', payload: visible });

  useEffect(() => {
    if (currentEditUser && currentEditUser.uid === currentUser.uid) {
      if (configLockIntervalId) {
        clearInterval(configLockIntervalId);
      }

      console.log('start interval');
      configLockIntervalId = setInterval(() => {
        if (currentEditUser && currentEditUser.uid === currentUser.uid) {
          fetchLock(currentConfig.id).then((r) => {
            if (r.code !== 0) {
              loadConfig(currentConfig.id);
            }
          });
        }
      }, 3000);
    }

    return () => {
      if (configLockIntervalId) {
        console.log('clear interval');
        clearInterval(configLockIntervalId);
      }
    };
  }, [currentEditUser]);

  useEffect(() => {
    if (!currentConfig) return;

    if (editor) {
      editor.dispose();
      let model = editor.getModel();
      if (model) model.dispose();
    }

    let editorInstance = createEditor(editorRef, {
      format: currentConfig?.format || 'toml',
      readOnly: !(currentEditUser && currentEditUser.uid === currentUser.uid),
      onInsertResource: onInsertResource,
      onLoadResourceDetail: onLoadResourceDetail,
    });

    editor = editorInstance;
    editorInstance.setValue(currentContent);
    editorInstance.onDidChangeModelContent((ev) => {
      props.dispatch({
        type: 'config/setCurrentContent',
        payload: editorInstance.getValue(),
      });
    });
  }, [mode, currentConfig]);

  useEffect(() => {
    if (currentConfig && mode === 'code' && editor) {
      editor.setValue(currentConfig.content);
      editor.focus();
    }
  }, [currentConfig]);

  useKeyPress('ctrl.s', (ev) => {
    fileChanged && showSaveModal(true);
    ev.preventDefault();
  });

  return (
    <div className={styles.editorContainer} ref={containerRef}>
      <div className={styles.editorTip}>
        {currentEditUser ? (
          <span>
            <span style={{ fontWeight: 'bold' }}>{currentEditUser.nickname}</span> 正在编辑
            {currentEditUser.uid === currentUser.uid && (
              <OptionButton
                type={'border'}
                style={{ fontSize: '12px', padding: '2px 10px', marginLeft: '10px' }}
                onClick={() => {
                  if (fileChanged) {
                    confirm({
                      title: '当前修改未保存',
                      content: '当前有修改未保存，请先保存。退出后将丢失本次修改，是否退出编辑？',
                      onOk: () => {
                        unLock(currentConfig.id).then((r) => {
                          loadConfig(currentConfig.id);
                        });
                      },
                    });
                  } else {
                    unLock(currentConfig.id).then((r) => {
                      loadConfig(currentConfig.id);
                    });
                  }
                }}
              >
                退出编辑
              </OptionButton>
            )}
            {fileChanged && (
              <OptionButton
                type={'border'}
                style={{ fontSize: '12px', padding: '2px 10px', marginLeft: '10px' }}
                onClick={() => showSaveModal(true)}
              >
                保存
              </OptionButton>
            )}
          </span>
        ) : (
          <span>
            <OptionButton
              type={'border'}
              style={{ fontSize: '12px', padding: '2px 10px', marginRight: 10 }}
              onClick={tryLock}
            >
              开始编辑
            </OptionButton>
            <OptionButton
              type={'border'}
              style={{ fontSize: '12px', padding: '2px 10px' }}
              onClick={() => {
                if (currentConfig?.id) {
                  props.dispatch({
                    type: 'config/loadHistory',
                    payload: {
                      id: currentConfig?.id,
                      page: 0,
                      size: 10000,
                    },
                    callback: () => {
                      setPublishModalVisible(true);
                    },
                  });
                } else {
                  message.error('非法配置');
                }
              }}
            >
              发布配置
              <ModalPublish
                visible={publishModalVisible}
                onCancel={() => setPublishModalVisible(false)}
                configID={currentConfig && currentConfig.id}
                onSubmit={(version) => {
                  if (currentConfig?.id) {
                    props.dispatch({
                      type: 'config/configPublish',
                      payload: {
                        id: currentConfig.id,
                        version,
                        host_name: [],
                        pub_k8s: false,
                        all: 1,
                      },
                      callback: () => {
                        setPublishModalVisible(false);
                      },
                    });
                  }
                }}
              />
            </OptionButton>
          </span>
        )}
      </div>

      <div ref={editorRef} className={styles.editor} />

      {/*配置文件加载提示*/}
      {configFileLoading && (
        <div
          className={styles.loadingMask}
          style={{ width: containerSize.width + 'px', height: containerSize.height + 'px' }}
        >
          <Spin />
          <div>加载配置中</div>
        </div>
      )}

      {/*未选择配置文件提示*/}
      {!currentConfig && (
        <div
          className={styles.fileUnSelectedMask}
          style={{ width: containerSize.width + 'px', height: containerSize.height + 'px' }}
        >
          <EditOutlined />
          <div>请先选择文件</div>
        </div>
      )}

      <ModalInsertResource
        onOk={({ resource }) => {
          insertModalCB &&
            loadResourceDetail(resource).then((r) => {
              insertModalCB.callback(r.data);
            });
        }}
      />
    </div>
  );
}

const mapStateToProps = ({ config, user }) => {
  return {
    historyList: config.historyList,
    currentConfig: config.currentConfig,
    configFileLoading: config.configFileLoading,
    editor: config.editorInstance,
    currentContent: config.currentContent,
    currentUser: user.currentUser,
  };
};

export default connect(mapStateToProps)(Editor);
