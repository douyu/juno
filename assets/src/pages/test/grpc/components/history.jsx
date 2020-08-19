import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import styles from './history.less';
import {Empty, message, Pagination, Spin} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {loadHistoryList} from "@/services/grpctest";

function History(props) {
  const {current, activeId, onChange, selectedService} = props;
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 8,
    total: 0
  })
  const [historyList, setHistoryList] = useState([])
  const [loading, setLoading] = useState(false)

  const loadHistory = page => {
    setLoading(true)
    loadHistoryList({
      page: page,
      page_size: 8,
      service_id: selectedService[1]
    }).then(r => {
      setLoading(false)

      if (r.code === 14000) {
        return
      }
      if (r.code !== 0) {
        message.error(r.msg)
        return;
      }

      setHistoryList(r.data.list)
      setPagination(r.data.pagination)
    })
  }

  useEffect(() => {
    if (selectedService && selectedService[1]) {
      // load history
      loadHistory(current)
    }

  }, [selectedService]);

  if (!historyList) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;

  return <Spin spinning={loading}>
    <ul className={styles.list}>
      {historyList.map((item, idx) => {
        return <li
          onClick={() => {
            onChange(item.id)
          }}
          className={styles.listItem + (activeId === item.id ? ' ' + styles.activeItem : '')}
          key={idx}
        >
          <div className={styles.listItemBox}>
            <div className={styles.statusIcon}>
              {item.test_passed ?
                <CheckCircleOutlined style={{color: 'green'}}/>
                : <CloseCircleOutlined style={{color: 'red'}}/>
              }
            </div>
            <div className={styles.info}>
              <div className={styles.methodName}>
                {item.method_name}
              </div>
              <div>
                Time: {item.time_cost} ms
              </div>
              <div>
                {item.created_at}
              </div>
            </div>
          </div>
        </li>
      })}
    </ul>

    <Pagination
      simple
      onChange={(page, pageSize) => {
        loadHistory(page - 1)
      }}
      current={pagination.current + 1} pageSize={pagination.pageSize} total={pagination.total}/>
  </Spin>
}

export default connect(({grpcDebugHistory}) => ({
  ...grpcDebugHistory
}))(History);
