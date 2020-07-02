import React from "react";
import {connect} from "dva";
import {Modal} from "antd";

function ModalRestartInstance(props) {
  const {} = props
  return <Modal {...props} title={"确认重启"}>
    点击确认后会关闭并重新启动该应用，是否确认?
  </Modal>
}

const mapStateToProps = ({config}) => {
  return {

  }
}

export default connect(
  mapStateToProps
)(ModalRestartInstance)
