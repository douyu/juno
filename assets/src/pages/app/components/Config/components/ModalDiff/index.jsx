import React, {useEffect, useRef, useState} from "react";
import {Modal} from "antd";
import {connect} from "dva";
import {createDiffEditor} from "@/pages/app/components/Config/components/Editor/editor";

function ModalDiff(props) {
  const {visible, diffOriginConfig, diffModifiedConfig, loading} = props
  const editorRef = useRef()
  const [editor, setEditor] = useState(null)

  useEffect(() => {
    if (visible && !editor) {
      setTimeout(() => {
        let editorInstance = createDiffEditor(
          editorRef,
          "",
          ""
        )

        setEditor(editorInstance)
      }, 100)
    }
  }, [visible]);

  useEffect(() => {
    if (!loading && editor && visible) {
      let model = editor.getModel()
      let [origin, modified] = [diffOriginConfig?.content || "", diffModifiedConfig?.content || ""]
      model.original.setValue(origin)
      model.modified.setValue(modified)
    }
  }, [diffModifiedConfig, diffOriginConfig, editor, loading, visible])

  return <Modal
    title={"配置版本对比"}
    loading={loading}
    visible={visible}
    width={"95vw"}
    style={{maxWidth: '1900px'}}
    footer={null}
    onCancel={() => {
      props.dispatch({
        type: 'config/closeModalDiff'
      })
    }}
  >
    <div ref={editorRef} style={{height: '700px'}}/>
  </Modal>
}

const mapStateToProps = ({config}) => {
  return {
    visible: config.visibleModalDiff,
    loading: config.diffContentLoading,
    diffOriginConfig: config.diffOriginConfig,
    diffModifiedConfig: config.diffModifiedConfig,
  }
}

export default connect(
  mapStateToProps
)(ModalDiff)
