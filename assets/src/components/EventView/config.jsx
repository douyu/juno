import React from 'react';
import { Tag } from 'antd';

export default class ConfgoEventView extends React.Component {
  render() {
    const { source, operation, metadata, operation_name, user_name, app_name, env, zone_code } =
      this.props.data;
    const { name, format } = JSON.parse(metadata);

    return (
      <div style={{ lineHeight: '30px' }}>
        对应用 <span style={{ fontWeight: 'bold' }}>{app_name}</span> 进行了{' '}
        <span style={{ fontWeight: 'bold' }}>{operation_name}</span>
        {name && (
          <>
            , 文件名为{' '}
            <Tag>
              {name}.{format}
            </Tag>
          </>
        )}
      </div>
    );
  }
}
