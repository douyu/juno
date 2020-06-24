import React, {useEffect, useRef, useState} from 'react';
import * as monaco from 'monaco-editor';
import styles from './index.less';
import {connect} from 'dva'
import {Spin} from "antd";
import {EditOutlined} from '@ant-design/icons'

import initLanguage from './language';

function Editor(props) {
  const {
    currentConfig, mode, configFileLoading, currentContent,
    diffOriginConfig, diffModifiedConfig,
  } = props

  const [editor, setEditor] = useState(null)
  const [diffEditor, setDiffEditor] = useState(null)
  const editorRef = useRef(null)
  const diffEditorRef = useRef(null)

  const createEditor = () => {
    if (editor) return

    let editorInstance = monaco.editor.create(
      editorRef.current,
      {
        theme: 'vs-dark',
        language: 'dy/conf',
        value: "[app]\n\tname = juno\n\taid = 12345",
        automaticLayout: true
      }
    )
    initLanguage(editorInstance)

    props.dispatch({
      type: 'config/setEditor',
      payload: editorInstance
    })

    editorInstance.onDidChangeModelContent(ev => {
      props.dispatch({
        type: 'config/setCurrentContent',
        payload: editorInstance.getValue()
      })
    })

    editorInstance.setValue(currentContent)

    setEditor(editorInstance)
  }

  const createDiffEditor = () => {
    let editorInstance = monaco.editor.createDiffEditor(
      diffEditorRef.current,
      {
        theme: 'vs-dark',
        language: 'dy/conf',
        automaticLayout: true,
        enableSplitViewResizing: false
      }
    )

    const originModel = monaco.editor.createModel(diffOriginConfig ? diffOriginConfig.content : '')
    const modifiedModel = monaco.editor.createModel(diffModifiedConfig.content)

    editorInstance.setModel({
      original: originModel,
      modified: modifiedModel
    })

    setDiffEditor(editorInstance)
  }

  useEffect(() => {
    if (mode === 'code') {
      createEditor()
    } else if (mode === 'diff') {
      createDiffEditor()
    }
  }, [mode])

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

