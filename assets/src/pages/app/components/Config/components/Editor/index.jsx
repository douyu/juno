import React, {useEffect, useRef, useState} from 'react';
import * as monaco from 'monaco-editor';
import styles from './index.less';
import {connect} from 'dva'
import {Spin} from "antd";
import {EditOutlined} from '@ant-design/icons'
import {createDiffEditor, createEditor} from "@/pages/app/components/Config/components/Editor/editor";
import ModalInsertResource from "@/pages/app/components/Config/components/ModalInsertResource";
import {loadResourceByNameVersion, loadResourceDetail} from "@/services/config_resource";

let editor = null

function Editor(props) {
  const {
    currentConfig, mode, configFileLoading, currentContent,
    diffOriginConfig, diffModifiedConfig,
  } = props

  const [diffEditor, setDiffEditor] = useState(null)
  const [insertModalCB, setInsertModalCB] = useState(null)
  const editorRef = useRef(null)
  const diffEditorRef = useRef(null)

  const showModalInsertResource = visible => props.dispatch({
    type: 'config/showModalInsertResource',
    payload: visible
  })

  useEffect(() => {
    if (mode === 'code') {
      if (editor) {
        editor.dispose()
        let model = editor.getModel()
        if (model) model.dispose()
      }

      let editorInstance = createEditor(editorRef, {
        format: currentConfig?.format || "toml",
        onInsertResource: (callback) => {
          showModalInsertResource(true)
          setInsertModalCB({callback})
        },
        onLoadResourceDetail: (resource) => {
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
      })

      editor = editorInstance
      editorInstance.setValue(currentContent)
      editorInstance.onDidChangeModelContent(ev => {
        props.dispatch({
          type: 'config/setCurrentContent',
          payload: editorInstance.getValue()
        })
      })

    } else if (mode === 'diff') {
      // createDiffEditor()

      let editorInstance = createDiffEditor(diffEditorRef,
        diffOriginConfig ? diffOriginConfig.content : '', diffModifiedConfig.content)

      setDiffEditor(editorInstance)
    }

  }, [mode, currentConfig])

  useEffect(() => {
    console.log(currentConfig)
    if (currentConfig && mode === 'code' && editor) {
      editor.setValue(currentConfig.content)
      editor.focus()
    }
  }, [currentConfig])

  useEffect(() => {
    if (mode === 'diff' && diffEditor) {
      const originModel = monaco.editor.createModel(diffOriginConfig ? diffOriginConfig.content : '')
      const modifiedModel = monaco.editor.createModel(diffModifiedConfig.content)

      diffEditor.setModel({
        original: originModel,
        modified: modifiedModel
      })
    }
  }, [diffOriginConfig, diffModifiedConfig])

  return <div className={styles.editorContainer}>
    <div ref={editorRef} className={styles.editor}/>

    {mode === 'diff' && <div ref={diffEditorRef} className={styles.diffEditor}/>}

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

const mapStateToProps = ({config}) => {
  return {
    currentConfig: config.currentConfig,
    configFileLoading: config.configFileLoading,
    editor: config.editorInstance,
    mode: config.editorMode,
    currentContent: config.currentContent,
    diffOriginConfig: config.diffOriginConfig,
    diffModifiedConfig: config.diffModifiedConfig,
  }
}

export default connect(mapStateToProps)(Editor)

