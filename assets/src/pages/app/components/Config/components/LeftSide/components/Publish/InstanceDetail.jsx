import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './InstanceDetail.less';
import { DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Tag, Modal, Spin, message, Space } from 'antd';
import { ServiceAppAction } from '@/services/confgo';
import { EyeOutlined } from '@ant-design/icons';
import ModalRealtimeConfig from './ModalRealtimeConfig';

const { confirm } = Modal;

function InstanceDetail(props) {
  const { currentInstance, dispatch, config, appName, env } = props;
  const [visibleRestartModal, setVisibleRestartModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  if (!currentInstance) {
    return <div />;
  }

  const {
    config_file_used,
    config_file_synced,
    config_file_take_effect,
    config_file_path,
    sync_at,
    version,
    change_log,
    host_name,
  } = currentInstance;
  let cfpArr = config_file_path.split(';');
  let cfpShow = [];
  cfpArr.forEach((ele) => cfpShow.push(<Tag color="#108ee9">{ele}</Tag>));

  let info = [
    {
      title: '接入状态',
      help: '当前应用是否在该实例上接入配置中心',
      content: config_file_used ? '已接入' : '未接入',
    },
    {
      title: '发布状态',
      help: '配置是否下发到机器上',
      content: config_file_synced ? '已下发' : '未下发',
    },
    {
      title: '生效状态',
      help: '配置是否在应用上生效',
      content: config_file_take_effect ? '已生效' : '未生效',
    },
    {
      title: '文件路径',
      content: config_file_path ? <span>{cfpShow}</span> : '---',
    },
    {
      title: '配置版本',
      content: version ? (
        <span>
          <Tag>{version}</Tag> {change_log}
        </span>
      ) : (
        '---'
      ),
    },
    {
      title: '同步时间',
      content: sync_at,
    },
  ];

  let showConfirm = (action, zoneCode, hostname, usedTyp) => {
    const descMap = {
      start: {
        title: '确定启动应用进程吗？',
        content: `应用进程会被执行 start 命令`,
      },
      restart: {
        title: '确定重启应用进程吗？',
        content: '应用进程会被执行 restart 命令',
      },
      stop: {
        title: '确定停止应用进程吗？',
        content: '应用进程会被执行 stop 命令',
      },
    };

    const desc = descMap[action] || {};
    confirm({
      title: desc.title,
      content: (
        <div>
          <p>{desc.content}</p>
          <h4>操作实例：</h4>
          <p>{hostname}</p>
        </div>
      ),
      onOk() {
        setVisibleRestartModal(true);

        doAction(action, zoneCode, hostname, usedTyp);
      },
      onCancel() {},
      okText: '确定',
      cancelText: '取消',
    });
  };

  let doAction = (action, zoneCode, hostname, usedTyp) => {
    if (usedTyp == 0) {
      setContent('配置文件未接入，无法进行重启操作');
      setLoading(false);
      return;
    }

    if (usedTyp == 1) {
      setContent('暂时不支持supervisor类型重启');
      setLoading(false);
      return;
    }

    setLoading(true);
    ServiceAppAction({
      action: action,
      zone_code: zoneCode,
      node_name: hostname,
      typ: usedTyp,
      app_name: appName,
      env: env,
    }).then((res) => {
      if (res.code != 0) {
        setContent(res.data);
        setLoading(false);
      } else {
        let result = [];
        for (var itemListKey in res.data) {
          let itemList = res.data[itemListKey];
          if (itemList['code'] != 0) {
            result.push(<p>状态：重启失败</p>);
          } else {
            result.push(<p>状态：重启成功</p>);
          }
          for (var item in itemList) {
            result.push(<p>{item + ':' + itemList[item]}</p>);
          }
        }
        setContent(result);
        setLoading(false);
      }
    });
  };

  return (
    <div className={styles.instanceDetail}>
      <div className={styles.topHeader}>
        <div style={{ fontSize: '48px', textAlign: 'center', padding: '10px' }}>
          <DatabaseOutlined />
        </div>
        <div style={{ padding: '10px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{currentInstance.host_name}</div>
          <div>
            {currentInstance.region_name} {currentInstance.zone_name} {currentInstance.ip}
          </div>
          <div style={{ marginTop: '10px' }}>
            <Space>
              <Button
                size={'small'}
                type={'primary'}
                icon={<ReloadOutlined />}
                onClick={() => {
                  showConfirm(
                    'restart',
                    currentInstance.zone_code,
                    currentInstance.host_name,
                    currentInstance.config_file_used,
                  );
                }}
              >
                重启
              </Button>

              <Button
                size={'small'}
                icon={<EyeOutlined />}
                onClick={() => {
                  dispatch({
                    type: 'config/fetchInstanceConfig',
                    payload: {
                      id: config.id,
                      hostName: host_name,
                    },
                  });
                }}
              >
                实时配置
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <ul className={styles.instanceInfoList}>
        {info.map((item, index) => (
          <li key={index}>
            <div className={styles.instanceInfoName}>
              <div className={styles.instanceInfoTitle}>{item.title}</div>
              <div className={styles.instanceInfoHelp}>{item.help}</div>
            </div>
            <div className={styles.instanceInfoContent}>{item.content}</div>
          </li>
        ))}
      </ul>

      <Modal
        title="操作面板"
        visible={visibleRestartModal}
        onOk={() => setVisibleRestartModal(false)}
        onCancel={() => setVisibleRestartModal(false)}
      >
        <div>
          <Spin spinning={loading} />
        </div>
        <div style={{ backgroundColor: 'black', borderRadius: '5px' }}>
          <p style={{ color: 'green' }}>{content}</p>
        </div>
      </Modal>
      <ModalRealtimeConfig />
    </div>
  );
}

const mapStateToProps = ({ config }) => {
  return {
    currentInstance: config.currentInstance,
    appName: config.appName,
    env: config.env,
  };
};

export default connect(mapStateToProps)(InstanceDetail);
