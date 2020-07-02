import React from "react";
import {connect} from "dva";
import styles from './index.less'

function EditorMaskLayer(props) {
  const {visible, child} = props

  if (!visible) return null

  return <div className={styles.editorMaskLayer}>
    {child}
  </div>
}

const mapStateToProps = ({config}) => {
  return {
    visible: config.visibleEditorMaskLayer,
    child: config.editorMaskLayerChild
  }
}

export default connect(
  mapStateToProps
)(EditorMaskLayer)
