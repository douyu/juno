import React, { useEffect } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Select } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import OptionButton from '@/pages/app/components/Config/components/OptionButton';

function Publish(props: any) {
  const {
    aid,
    env,
    zoneCode,
    loadConfigInstances,
    configList,
    configInstanceListLoading,
    configInstanceList,
    configPublish,
  } = props;

  useEffect(() => {
    loadConfigInstances(aid, env, zoneCode);
  }, [aid, env, zoneCode]);

  let publish = () => {
    configPublish(id, version)
  };

  return (
    <div className={styles.publish}>
      <Select style={{ width: '100%' }} loading={configInstanceListLoading}>
        {configList.map((item: any, index: any) => {
          return (
            <Select.Option value={item.id} key={index}>
              {item.name}.{item.format}
            </Select.Option>
          );
        })}
      </Select>

      <div style={{ marginTop: '10px' }}>
        <OptionButton>
          <a onclick={publish}>发布</a>
        </OptionButton>
      </div>

      <ul className={styles.instanceList}>
        {configInstanceList != undefined &&
          configInstanceList.map((item: any, index: any) => {
            return (
              <li key={index}>
                <div className={styles.icon}>
                  <DatabaseOutlined />
                </div>
                <div className={styles.instanceInfo}>
                  <p>
                    <span className={styles.infoTitle}>Host:</span>
                    <span>{item.host_name}</span>
                  </p>
                  <p>
                    <span className={styles.infoTitle}>Version:</span>
                    <span>{item.version}</span>
                  </p>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

const mapStateToProps = ({ config }: any) => {
  console.log('mapStateToProps -> config', config);
  return {
    aid: config.aid,
    env: config.env,
    configList: config.configList,
    configInstanceList: config.configInstanceList,
    zoneCode: config.zoneCode,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadConfigInstances: (aid: any, env: any, zoneCode: any) =>
      dispatch({
        type: 'config/loadConfigInstances',
        payload: {
          aid,
          env,
          zoneCode,
        },
      }),

    configPublish: (aid: any, env: any, zoneCode: any) =>
      dispatch({
        type: 'config/publish',
        payload: {
          aid,
          env,
          zoneCode,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Publish);
