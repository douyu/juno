import styles from "./index.less";
import {AutoComplete, Button, Icon, Input, Select, Spin, Tabs, Tag, message} from "antd";
import KeyValueEditor from "@/pages/test/http/components/KeyValueEditor";
import BodyTabPane from "@/pages/test/http/components/BodyTabPane";
import React, {useState} from "react";
import {connect} from "dva";
import {UnControlled as CodeMirror} from "react-codemirror2";
import {EditOutlined} from "@ant-design/icons";
import {useBoolean} from "ahooks";
import ReactScroll from 'react-scrollbar'

function Editor(props) {
  const {request, dispatch, httpPort, addrList, currentAppName} = props

  const [nameEditing, nameEditAction] = useBoolean(false)

  const onFieldChange = (fields) => {
    dispatch({
      type: 'HttpDebug/updateCurrentRequest',
      payload: {
        ...fields
      }
    })
  };

  const onSave = () => {
    if (request.id) {
      dispatch({
        type: 'HttpDebug/saveTestCase',
        payload: request
      }).then(r => {
        dispatch({
          type: 'HttpDebug/fetchCollections',
          payload: {
            appName: currentAppName
          }
        })
      })
    } else {
      dispatch({
        type: 'HttpDebug/showModalNewTestCase',
        payload: {
          visible: true
        }
      })
    }
  };

  const onSend = () => {
    if (!request.method || !request.url) {
      return message.error("请输入Method和 url")
    }

    dispatch({
      type: 'HttpDebug/sendRequest',
      payload: request
    })
  }

  const isSuccessCode = (code) => {
    return code >= 200 && code < 300;
  }

  const renderRequestResult = () => {
    const {response, sendStatus, responseStatus, responseError} = props;
    if (sendStatus === 'done') {
      if (responseStatus === 'success') {
        let success = isSuccessCode(response.code)
        return <div>
          <div
            className={styles.responseStatusBar + (success ? '' : ' ' + styles.responseStatusBarFail)}>
                <span className={styles.statusBlock}>
                  <span>Status: </span>
                  <span>
                    {success ? <span className={styles.statusSuccess}>{response.code}</span>
                      : <span className={styles.statusFail}>{response.code}</span>}
                  </span>
                </span>
            <span className={styles.statusBlock}>
                  <span>Time: </span>
                  <span className={styles.statusSuccess}>
                    {response.time_cost}ms
                  </span>
                </span>
          </div>
          <div className={styles.responseSuccess}>
            <CodeMirror
              value={response.body}
              className={"responseCM"}
              options={{
                readOnly: true,
                mode: 'javascript',
                theme: 'duotone-light',
                lineNumbers: false
              }}/>
          </div>
        </div>
      } else {
        // 失败
        return <div className={styles.responseFail}>
          <Tag color={"red"}>
            {responseStatus}
          </Tag>
          {responseError}
        </div>
      }
    }
    if (sendStatus === 'not_start') {
      return <div style={{textAlign: 'center', padding: '40px', color: '#c3c3c3'}}>
        <Icon style={{fontSize: "48px"}} type="rocket"/>
        <p style={{marginTop: '20px'}}>发起请求获取响应</p>
      </div>
    }
    if (sendStatus === 'sending') {
      return <div style={{textAlign: 'center', padding: '40px'}}>
        <Spin tip={"请求中..."}/>
      </div>
    }
  };

  return <div className={styles.httpDebugContainer}>
    <div className={styles.nameBar}>
      {!nameEditing ? <>
          {request?.name || "Untitled"}
          <span>
                <Button type={"link"} onClick={() => {
                  nameEditAction.setTrue()
                }}>
                  <EditOutlined/>
                </Button>
              </span>
        </>
        :
        <Input
          onChange={(ev) => {
            onFieldChange({name: ev.target.value});
          }}
          onBlur={() => {
            onSave();
            nameEditAction.setFalse();
          }}
          style={{maxWidth: 200}}
          defaultValue={request.name}
        />
      }
    </div>
    <div className={styles.methodUrlLine}>
      <Select defaultValue={"GET"} value={request.method} onChange={(val) => {
        onFieldChange({method: val})
      }}>
        {["GET", "POST", "PUT", "PATCH"].map((item, idx) =>
          <Select.Option value={item} key={idx}>{item}</Select.Option>)}
      </Select>
      <AutoComplete
        value={request.url}
        onChange={(val) => {
          onFieldChange({url: val})
        }}
      >
        {addrList.map(item => {
          return <AutoComplete.Option value={`http://${item.addr}:${httpPort}`}>
            <Tag>{item.env}</Tag> {`http://${item.addr}:${httpPort}`}
          </AutoComplete.Option>
        })}
      </AutoComplete>
      <Button type={"primary"} onClick={() => {
        onSend()
      }}>Send</Button>
      <Button onClick={() => {
        onSave()
      }}>Save</Button>
    </div>
    <div className={styles.requestParamEditBox}>
      <Tabs
        size={"small"}
        renderTabBar={(props, DefaultTabBar) => {
          return <DefaultTabBar {...props} style={{
            backgroundColor: 'rgb(250,250,250)',
            padding: '10px 0 0 10px'
          }}/>
        }}
      >
        <Tabs.TabPane tab={"Params"} key={"params"}>
          <ReactScroll horizontal={true} style={{height: '200px', width: '100%'}}>
            <KeyValueEditor
              onChange={(data) => {
                onFieldChange({query: data})
              }}
              data={request.query}
            />
          </ReactScroll>
        </Tabs.TabPane>
        <Tabs.TabPane tab={"Headers"} key={"headers"}>
          <ReactScroll style={{height: '200px', width: '100%'}}>
            <KeyValueEditor
              onChange={(data) => {
                onFieldChange({headers: data})
              }}
              data={request.headers}
            />
          </ReactScroll>
        </Tabs.TabPane>
        <Tabs.TabPane tab={"Body"} key={"body"}>
          <ReactScroll style={{height: '200px', width: '100%'}}>
            <BodyTabPane/>
          </ReactScroll>
        </Tabs.TabPane>
      </Tabs>
    </div>
    <div className={styles.responseTitleBar}>
      Response
    </div>
    <div>
      {renderRequestResult()}
    </div>
  </div>
}

export default connect(
  ({HttpDebug}) => {
    return {
      request: HttpDebug.currentRequest,
      httpPort: HttpDebug.httpPort,
      addrList: HttpDebug.addrList,
      response: HttpDebug.response,
      sendStatus: HttpDebug.sendStatus,
      responseStatus: HttpDebug.responseStatus,
      responseError: HttpDebug.responseError,
      currentAppName: HttpDebug.currentAppName
    }
  }
)(Editor)
