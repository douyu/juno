import React from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {DeleteOutlined, FileOutlined, HistoryOutlined, SaveOutlined, StopOutlined} from '@ant-design/icons'
import OptionButton from "@/pages/app/components/Config/components/OptionButton";
import {Popconfirm, Spin} from 'antd'
import {useKeyPress} from "ahooks";

function Files(props) {
  const {
    currentConfig, configList, configListLoading, currentContent,
    deleteConfig, aid, env, loadConfigList, appName, k8sClusters
  } = props
  let {zoneList} = props

  useKeyPress("ctrl.s", ev => {
    currentConfig && currentConfig.content !== currentContent && props.showSaveModal(true)
    ev.preventDefault()
  })

  k8sClusters.forEach(cluster => {
    if (cluster.env.indexOf(env) > -1 && zoneList.findIndex(zone => zone.zone_code === cluster.zone_code) < 0) {
      zoneList.push({
        zone_code: cluster.zone_code,
        zone_name: cluster.zone_name
      })
    }
  })

  const renderConfigListByZone = (zone) => {
    let configs = (configList || []).filter(item => item.zone === zone)
    if (configs.length === 0) {
      return <div
        className={styles.noConfigTip}
      >
        <StopOutlined/>
        该Zone暂无配置
      </div>
    }

    return configs.map((cfg, index) => {
      const active = cfg.id === currentConfig?.id
      return <li
        key={index}
        className={[styles.configItem, active && styles.configItemActive].join(' ')}
        onClick={() => props.loadConfigDetail(cfg.id)}
      >
        <div>{cfg.name}.{cfg.format}</div>
        <div>
          {currentConfig && currentConfig.content !== currentContent && cfg.id === currentConfig.id &&
          <span className={styles.notSavedTip}>
            未保存
          </span>}
        </div>
        <div>
          <div onClick={ev => ev.stopPropagation()}>
            <Popconfirm
              title={"谨慎操作，删除后无法找回.确定删除?"}
              onConfirm={ev => {
                deleteConfig(cfg.id).then(r => {
                  loadConfigList(props.appName, props.env)
                })
              }}
            >
              <OptionButton
                type={"text"}>
                <DeleteOutlined/>
              </OptionButton>
            </Popconfirm>
          </div>
        </div>
      </li>;
    })
  }

  return <div>
    <div className={styles.options}>
      <OptionButton
        onClick={() => props.showCreateModal(true)}
        title={"新增配置"}>
        <FileOutlined/>
      </OptionButton>
      {currentConfig && currentConfig.content !== currentContent && <OptionButton
        onClick={() => props.showSaveModal(true)}
        title={"保存配置"}>
        <SaveOutlined/>
      </OptionButton>}
      {currentConfig && <OptionButton
        title={"历史变更"}
        onClick={() => props.showHistoryModal(true)}
      >
        <HistoryOutlined/>
      </OptionButton>}
    </div>

    <ul className={styles.zoneList}>
      {configListLoading && <div style={{textAlign: 'center', paddingTop: '30px'}}>
        <Spin/>
        <div>加载中</div>
      </div>}

      {!configListLoading && zoneList && zoneList.map((zone, index) => {
        return <li
          key={index}
        >
          <div className={styles.zoneTitle}>{zone.zone_name}</div>
          <ul className={styles.configList}>
            {renderConfigListByZone(zone.zone_code)}
          </ul>
        </li>
      })}

      {!configListLoading && (!zoneList || !zoneList.length) && <div
        className={styles.noConfigTip}
      >
        <StopOutlined/>
        当前应用环境无机房
      </div>}
    </ul>
  </div>
}

const mapState = ({config, setting}) => {
  return {
    zoneList: config.zoneList,
    configList: config.configList,
    configListLoading: config.configListLoading,
    currentConfig: config.currentConfig,
    currentContent: config.currentContent,
    aid: config.aid,
    appName: config.appName,
    env: config.env,
    k8sClusters: setting.settings?.k8s_cluster?.list || []
  }
}

const mapDispatch = (dispatch) => {
  return {
    showCreateModal: visible => dispatch({type: 'config/showCreateModal', payload: visible}),
    showSaveModal: visible => dispatch({type: 'config/showSaveModal', payload: visible}),
    showHistoryModal: visible => dispatch({type: 'config/showHistoryModal', payload: visible}),
    loadConfigDetail: id => dispatch({
      type: 'config/loadConfigDetail',
      payload: {id}
    }),
    deleteConfig: id => dispatch({
      type: 'config/deleteConfig',
      payload: id
    }),
    loadConfigList: (appName, env) => dispatch({
      type: 'config/loadConfigInfo',
      payload: {
        appName,
        env
      }
    }),
    dispatch: dispatch
  }
}

export default connect(mapState, mapDispatch)(Files)
