import React, {useEffect} from "react";
import {connect} from "dva";
import {Button, Modal, Table} from "antd";

const historyTableColumns = [
  {
    key: 'user',
    // dataIndex: 'user_name',
    title: '操作用户',
    render(row) {
      return row.user_name || row.access_token_name || '---'
    }
  },
  {
    key: 'change_log',
    dataIndex: 'change_log',
    title: 'Change Log'
  },
  {
    key: 'created_at',
    dataIndex: 'created_at',
    title: '提交时间'
  },
]

function ModalHistory(props) {
  const {
    visible, currentConfig, historyList, historyListLoading,
    historyListPagination, loadHistory, showHistoryModal, showDiffEditor, serviceVersion, publishVersion,env,aid
  } = props
  useEffect(() => {
    if (serviceVersion != "" && serviceVersion != undefined) {
      let sd = serviceVersion+"-" + aid + "-"+ env
      showDiffEditor(sd, publishVersion)
    }

    if (!visible) return
    loadHistory({
      id: currentConfig.id,
      page: 0,
      size: 10
    })
  }, [visible, publishVersion, serviceVersion,env,aid])

  return <Modal
    visible={visible}
    title={"历史版本"}
    onCancel={() => showHistoryModal(false)}
    footer={null}
    width={800}
  >
    <Table
      dataSource={historyList}
      loading={historyListLoading}
      pagination={{
        ...historyListPagination,
        current: historyListPagination.current + 1,
        onChange: (page, size) => {
          loadHistory({
            id: currentConfig.id,
            page: page - 1,
            size: size
          })
        }
      }}
      columns={[
        ...historyTableColumns,
        {
          key: 'version',
          title: 'Version',
          render: row => {
            return <Button
              type={"link"}
              onClick={() => {
                showDiffEditor(row.configuration_id, row.id)
                showHistoryModal(false)
              }}
            >
              {row.version.substr(0, 7)}
            </Button>
          }
        }
      ]}
    >

    </Table>
  </Modal>
}

const mapStateToProps = ({config}) => {
  return {
    aid: config.aid,
    env: config.env,
    serviceVersion: config.serviceVersion,
    publishVersion: config.publishVersion,
    visible: config.visibleModalHistory,
    historyList: config.historyList,
    historyListPagination: config.historyListPagination,
    historyListLoading: config.historyListLoading,
    currentConfig: config.currentConfig,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showHistoryModal: visible => dispatch({
      type: 'config/showHistoryModal',
      payload: visible
    }),
    loadHistory: payload => dispatch({
      type: 'config/loadHistory',
      payload: payload
    }),
    showDiffEditor: (configID, historyID) => {
      dispatch({
        type: 'config/showDiffEditor',
        payload: {
          configID,
          historyID,
        }
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalHistory)
