import React from "react";
import Monaco from 'react-monaco-editor'
import {Modal} from "antd";
import {connect} from "dva";

const DefaultScript = `// Http 测试脚本
// 工具函数:
//    - test.setHeader("header name", "header value")   // 设置 Header 参数
//    - test.setQueryParam("query name", "query value") // 设置 Query 参数
//    - test.setData("key", "value")                    // 设置全局数据，用于在同一个 collection 下共享数据
//    - test.getData("key")                             // 获取全局数据
//    - test.log("key", "val")                          // 记录测试日志，便于测试后对故障运行过程进行跟踪

// 在请求之前被调用，用于设置请求参数
test.preRequest = function() {
  // your code here
}

// 在请求之后被调用，用于测试响应是否正确
test.onResponse = function() {
  // your code here
}
`

function ModalScriptEditor(props) {
  const {visible, currentRequest, updateCurrentRequest} = props

  let script = currentRequest?.script || DefaultScript

  return <Modal
    onCancel={() => {
      props.show(false)
    }}
    footer={null}
    title={"Test Script"} visible={visible} width={"95%"} style={{maxWidth: '1900px'}}
  >
    <Monaco
      width={"100%"}
      height={"800px"}
      language={"javascript"}
      theme={"vs"}
      value={script}
      onChange={(val) => {
        updateCurrentRequest({
          script: val
        })
      }}
    />
  </Modal>
}

export default connect(
  ({HttpDebug}) => {
    return {
      visible: HttpDebug.visibleModalScriptEditor,
      currentRequest: HttpDebug.currentRequest,
    }
  },
  (dispatch) => {
    return {
      show: visible => {
        dispatch({
          type: 'HttpDebug/showModalScriptEditor',
          payload: visible
        })
      },
      updateCurrentRequest: payload => {
        dispatch({
          type: 'HttpDebug/updateCurrentRequest',
          payload,
        })
      }
    }
  }
)(ModalScriptEditor)
