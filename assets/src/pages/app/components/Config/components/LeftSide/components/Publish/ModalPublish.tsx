import React, {useEffect, useState} from "react";
import {message, Modal, Select, Tag} from "antd";
import {connect} from "dva";
import {ModalProps} from "antd/es/modal";
import styles from './ModalPublish.less'
import moment from "moment";

interface ModalPublishProps extends ModalProps {
  configID: number
  loadConfigHistory: (id: number) => void
  historyList: any[]
  historyLoading: boolean
  onSubmit: (version: string) => void
}

function ModalPublish(props: ModalPublishProps) {
  const {visible, configID, loadConfigHistory, historyList, historyLoading} = props
  const [selectedVersion, setSelectedVersion] = useState('')

  useEffect(() => {
    if (historyList) setSelectedVersion(historyList[0]?.version)
    else setSelectedVersion('')
  }, [historyList])

  useEffect(() => {
    if (visible && configID) {
      loadConfigHistory(configID)
    }
  }, [visible])

  return <Modal
    title={"配置发布"} {...props}
    onOk={() => {
      if (!selectedVersion) {
        message.error("请选择版本")
        return
      }
      props.onSubmit(selectedVersion)
    }}
  >
    <Select
      loading={historyLoading}
      style={{width: '100%'}}
      value={selectedVersion}
      onSelect={version => setSelectedVersion(version)}
    >
      {(historyList || []).map(item => {
        return <Select.Option value={item.version} key={item.id}>
          <div className={styles.versionSelectItem}>
            <div><Tag color={"success"}>{(item.version + '').substr(0, 7)}</Tag></div>
            <div className={styles.changeLog}>{item.change_log}</div>
            <div>{moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")}</div>
          </div>
        </Select.Option>
      })}
    </Select>
  </Modal>
}

const mapStateToProps = ({config}: any) => {
  return {
    aid: config.aid,
    appName: config.appName,
    env: config.env,
    configList: config.configList,
    configInstanceList: config.configInstanceList,
    zoneCode: config.zoneCode,
    historyList: config.historyList,
    historyListLoading: config.historyListLoading,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadConfigHistory: (id: number) =>
      dispatch({
        type: 'config/loadHistory',
        payload: {
          id,
          page: 0,
          size: 10000,
        },
      }),

    configPublish: (id: number, version: string) =>
      dispatch({
        type: 'config/configPublish',
        payload: {
          id,
          version,
        },
      }),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalPublish)
