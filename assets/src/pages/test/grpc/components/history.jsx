import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import styles from './history.less';
import {Icon, Empty, message} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {loadHistoryList} from "@/services/grpctest";

function History(props) {
  const {dispatch, pageSize, current, activeId, onChange, selectedService} = props;
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0
  })
  const [historyList, setHistoryList] = useState([])

  useEffect(() => {
    if (selectedService && selectedService[1]) {
      // load history
      loadHistoryList({
        page: current,
        page_size: pageSize,
        service_id: selectedService[1]
      }).then(r => {
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

  }, [selectedService]);

  if (!historyList) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;

  return <ul className={styles.list}>
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
            {item.status === 'success' ?
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
}

export default connect(({grpcDebugHistory}) => ({
  ...grpcDebugHistory
}))(History);
