import React, {useEffect} from "react";
import {connect} from "dva";
import styles from './index.less'
import {Select} from "antd";
import {DatabaseOutlined} from '@ant-design/icons'
import OptionButton from "@/pages/app/components/Config/components/OptionButton";

const MockInstanceList = [
  {
    host: '10.12.3.1',
    version: '17e2a5d'
  },
  {
    host: '10.12.3.2',
    version: '17e2a5d'
  }
]

function Publish(props) {
  const {aid, env, loadConfigInfo, configList, configListLoading} = props

  useEffect(() => {
    loadConfigInfo(aid, env)
  }, [aid, env])

  return <div className={styles.publish}>
    <Select style={{width: '100%'}} loading={configListLoading}>
      {configList.map((item, index) => {
        return <Select.Option value={item.id} key={index}>
          {item.name}.{item.format}
        </Select.Option>
      })}
    </Select>

    <div style={{marginTop: '10px'}}>
      <OptionButton>发布</OptionButton>
    </div>

    <ul className={styles.instanceList}>
      {MockInstanceList.map((item, index) => {
        return <li key={index}>
          <div className={styles.icon}>
            <DatabaseOutlined/>
          </div>
          <div className={styles.instanceInfo}>
            <p>
            <span className={styles.infoTitle}>
              Host:
            </span>
              <span>
              {item.host}
            </span>
            </p>
            <p>
            <span className={styles.infoTitle}>
              Version:
            </span>
              <span>
              {item.version}
            </span>
            </p>
          </div>
        </li>
      })}
    </ul>
  </div>
}

const mapStateToProps = ({config}) => {
  return {
    configList: config.configList,
    configListLoading: config.configListLoading,
    aid: config.aid,
    env: config.env,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadConfigInfo: (aid, env) => dispatch({
      type: 'config/loadConfigInfo',
      payload: {
        aid,
        env
      }
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Publish)
