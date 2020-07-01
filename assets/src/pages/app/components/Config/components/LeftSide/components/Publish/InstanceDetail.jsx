import React, {useState} from "react";
import {connect} from "dva";
import styles from './InstanceDetail.less'
import {DatabaseOutlined, ReloadOutlined} from '@ant-design/icons'
import {Button} from "antd";
import ModalRestartInstance
  from "@/pages/app/components/Config/components/LeftSide/components/Publish/ModalRestartInstance";

function InstanceDetail(props) {
  const {currentInstance} = props
  const [visibleRestartModal, setVisibleRestartModal] = useState(false)

  if (!currentInstance) {
    return <div/>
  }

  const {
    config_file_used,
    config_file_synced,
    config_file_take_effect,
    config_file_path,
    sync_at
  } = currentInstance

  let info = [
    {
      title: '接入状态',
      help: '当前应用是否在该实例上接入配置中心',
      content: config_file_used ? '已接入' : '未接入'
    },
    {
      title: '发布状态',
      help: '配置是否下发到机器上',
      content: config_file_synced ? '已下发' : '未下发'
    },
    {
      title: '生效状态',
      help: '配置是否在应用上生效',
      content: config_file_take_effect ? '已生效' : '未生效'
    },
    {
      title: '文件路径',
      content: config_file_path
    },
    {
      title: '同步时间',
      content: sync_at
    },
  ]

  return <div className={styles.instanceDetail}>
    <div className={styles.topHeader}>
      <div style={{fontSize: "48px", textAlign: 'center', padding: '10px'}}>
        <DatabaseOutlined/>
      </div>
      <div style={{padding: '10px'}}>
        <div style={{fontSize: '24px', fontWeight: 'bold'}}>
          {currentInstance.host_name}
        </div>
        <div>
          {currentInstance.region_name} {currentInstance.zone_name} {currentInstance.ip}
        </div>
        <div style={{marginTop: '10px'}}>
          <Button.Group>
            <Button
              size={"small"} type={"primary"} icon={<ReloadOutlined/>}
              onClick={() => {
                setVisibleRestartModal(true)
              }}
            >
              重启
            </Button>
          </Button.Group>
        </div>
      </div>
    </div>

    <ul className={styles.instanceInfoList}>
      {info.map((item, index) => <li key={index}>
        <div className={styles.instanceInfoName}>
          <div className={styles.instanceInfoTitle}>{item.title}</div>
          <div className={styles.instanceInfoHelp}>{item.help}</div>
        </div>
        <div className={styles.instanceInfoContent}>
          {item.content}
        </div>
      </li>)}
    </ul>

    <ModalRestartInstance
      visible={visibleRestartModal}
      onCancel={() => setVisibleRestartModal(false)}
      onOk={() => setVisibleRestartModal(false)}
    />
  </div>
}

const mapStateToProps = ({config}) => {
  return {
    currentInstance: config.currentInstance
  }
}

export default connect(
  mapStateToProps
)(InstanceDetail)
