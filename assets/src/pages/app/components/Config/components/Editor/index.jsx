import React, {useEffect, useRef, useState} from 'react';
import styles from './index.less';
import {connect} from 'dva'
import {message, Spin} from "antd";
import {EditOutlined} from '@ant-design/icons'
import {createEditor} from "@/pages/app/components/Config/components/Editor/editor";
import ModalInsertResource from "@/pages/app/components/Config/components/ModalInsertResource";
import {loadResourceByNameVersion, loadResourceDetail} from "@/services/config_resource";
import {fetchLock, unLock} from "@/services/config";
import OptionButton from "@/pages/app/components/Config/components/OptionButton";

let editor = null
let configLockIntervalId = null
let lockConfigId = null

function Editor(props) {
  const {
    currentConfig, mode, configFileLoading, currentContent, currentUser
  } = props
  const currentEditUser = currentConfig?.current_edit_user
  const [insertModalCB, setInsertModalCB] = useState(null)
  const editorRef = useRef(null)

  const showModalInsertResource = visible => props.dispatch({
    type: 'config/showModalInsertResource',
    payload: visible
  })

  const onInsertResource = (callback) => {
    showModalInsertResource(true)
    setInsertModalCB({callback})
  }

  const loadConfig = (id) => {
    props.dispatch({
      type: 'config/loadConfigDetail',
      payload: {id}
    })
  }

  const onLoadResourceDetail = (resource) => {
    return new Promise((resolve, reject) => {
      if (!currentConfig) {
        console.log("currentConfig", currentConfig)
        reject()
        return
      }

      if (!resource || !resource.length) {
        reject()
        return
      }

      const name = resource.split('@')[0]
      loadResourceByNameVersion(currentConfig.env, currentConfig.zone, name).then(r => {
        if (r.code !== 0) {
          console.error("loadResourceByNameVersion failed:", r)
          reject()
          return
        }

        resolve(r.data)
      })
    })
  }

  const tryLock = () => {
    fetchLock(currentConfig.id).then(r => {
      lockConfigId = currentConfig.id

      if (r.code === 14000) return
      if (r.code !== 0) {
        message.error("获取编辑锁失败:" + r.msg)
        return
      }

      loadConfig(currentConfig.id)
    })
  }

  useEffect(() => {
    if (currentEditUser && currentEditUser.uid === currentUser.uid) {
      if (configLockIntervalId) {
        clearInterval(configLockIntervalId)
      }

      console.log("start interval")
      configLockIntervalId = setInterval(() => {
        if (currentEditUser && currentEditUser.uid === currentUser.uid) {
          fetchLock(currentConfig.id).then(r => {
            if (r.code !== 0) {
              loadConfig(currentConfig.id)
            }
          })
        }
      }, 3000)
    }

    return () => {
      if (configLockIntervalId) {
        console.log("clear interval")
        clearInterval(configLockIntervalId)
      }
    }
  }, [currentEditUser])

  useEffect(() => {
    if (!currentConfig) return

    if (editor) {
      editor.dispose()
      let model = editor.getModel()
      if (model) model.dispose()
    }

    let editorInstance = createEditor(editorRef, {
      format: currentConfig?.format || "toml",
      readOnly: !(currentEditUser && currentEditUser.uid === currentUser.uid),
      onInsertResource: onInsertResource,
      onLoadResourceDetail: onLoadResourceDetail
    })

    editor = editorInstance
    editorInstance.setValue(currentContent)
    editorInstance.onDidChangeModelContent(ev => {
      props.dispatch({
        type: 'config/setCurrentContent',
        payload: editorInstance.getValue()
      })
    })

  }, [mode, currentConfig])

  useEffect(() => {
    if (currentConfig && mode === 'code' && editor) {
      editor.setValue(currentConfig.content)
      editor.focus()
    }
  }, [currentConfig])

  return <div className={styles.editorContainer}>
    <div className={styles.editorTip}>
      {currentEditUser ? <span>
        <span style={{fontWeight: 'bold'}}>{currentEditUser.nickname}</span> 正在编辑
        {currentEditUser.uid === currentUser.uid && <OptionButton
          type={"border"}
          style={{fontSize: '12px', padding: '2px 10px', marginLeft: '10px'}}
          onClick={() => {
            unLock(currentConfig.id).then(r => {
              loadConfig(currentConfig.id)
            })
          }}
        >
          退出编辑
        </OptionButton>}
      </span> : <span>
        <OptionButton type={"border"} style={{fontSize: '12px', padding: '2px 10px'}} onClick={tryLock}>
          开始编辑
        </OptionButton>
      </span>}
    </div>

    <div ref={editorRef} className={styles.editor}/>

    {/*配置文件加载提示*/}
    {configFileLoading && <div className={styles.loadingMask}>
      <Spin/>
      <div>加载配置中</div>
    </div>}

    {/*未选择配置文件提示*/}
    {!currentConfig && <div className={styles.fileUnSelectedMask}>
      <EditOutlined/>
      <div>请先选择文件</div>
    </div>}

    <ModalInsertResource onOk={({resource}) => {
      insertModalCB && loadResourceDetail(resource).then(r => {
        insertModalCB.callback(r.data)
      })
    }}/>
  </div>;
}

const mapStateToProps = ({config, user}) => {
  return {
    currentConfig: config.currentConfig,
    configFileLoading: config.configFileLoading,
    editor: config.editorInstance,
    currentContent: config.currentContent,
    currentUser: user.currentUser
  }
}

export default connect(mapStateToProps)(Editor)

