import React, {useEffect} from 'react'
import {connect} from "dva";
import styles from "@/pages/test/http/components/LeftSider/index.less";
import RequestItem from "@/pages/test/http/components/LeftSider/RequestItem";
import {Button, List, Empty} from "antd";
import ReactScrollBar from 'react-scrollbar'

function HistoryTab(props) {
  const {history, dispatch, currentAppName, historyLoading, historyPagination} = props
  let hasMore = false
  let blank = !(history && history.length)

  if (historyPagination) {
    const {current, total, pageSize} = historyPagination
    if ((current + 1) * pageSize < total) hasMore = true
  }

  const loadHistory = (page = 0, pageSize = 20) => {
    dispatch({
      type: 'HttpDebug/loadHistory',
      payload: {
        app_name: currentAppName,
        page_size: pageSize,
        page: page
      }
    })
  }

  useEffect(() => {
    loadHistory()
  }, [currentAppName])

  return <ReactScrollBar style={{height: '730px'}}>
    <List loading={historyLoading} split={false}>
      {(history || []).map((item, idx) => {
        return <List.Item className={styles.historyItem}>
          <RequestItem key={idx} id={item.id} method={item.method} title={item.url}/>
        </List.Item>
      })}
    </List>

    {blank && <Empty/>}

    {hasMore && <div style={{textAlign: 'center', padding: '10px'}}>
      <Button onClick={() => {
        loadHistory(historyPagination.current + 1)
      }}>加载更多</Button>
    </div>}
  </ReactScrollBar>
}

export default connect(
  ({HttpDebug}) => {
    return {
      history: HttpDebug.history,
      historyLoading: HttpDebug.historyLoading,
      currentAppName: HttpDebug.currentAppName,
      historyPagination: HttpDebug.historyPagination
    }
  }
)(HistoryTab)
