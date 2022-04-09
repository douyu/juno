import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons/lib';
import React from 'react';

// pending
// running
// failed
// success
export default function RunStatus(props: { status: string; className: string }) {
  const render = () => {
    switch (props.status) {
      case 'running':
      case 'run':
        return (
          <>
            <div style={{ color: '#0094b5' }}>
              <SyncOutlined spin />
            </div>
            <div>运行中</div>
          </>
        );
      case 'pending':
        return (
          <>
            <div style={{ color: 'orange' }}>
              <SyncOutlined spin />
            </div>
            <div>Pending</div>
          </>
        );
      case 'failed':
      case 'fail':
        return (
          <>
            <div style={{ color: 'red' }}>
              <CloseCircleOutlined />
            </div>
            <div>失败</div>
          </>
        );
      case 'success':
      case 'pass':
        return (
          <>
            <div style={{ color: 'green' }}>
              <CheckCircleOutlined />
            </div>
            <div>成功</div>
          </>
        );
      default:
        return (
          <>
            <div style={{ color: 'gray' }}>
              <InfoCircleOutlined />
            </div>
            <div>未执行</div>
          </>
        );
    }
  };

  return <div className={props.className}>{render()}</div>;
}
