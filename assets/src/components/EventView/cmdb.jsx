import React from 'react';
import { Divider, Tag } from 'antd';

export default class CMDBEventView extends React.Component {
  render() {
    const { source, operation, metadata, app_name } = this.props.data;
    let appCNName = null,
      appManagers = [],
      nodeIp = '',
      regionCNName = '';
    try {
      const { users = [], ip, region_name } = JSON.parse(metadata);
      appCNName = app_name;
      appManagers = users;
      nodeIp = ip;
      regionCNName = region_name;
    } catch (e) {
      console.log('invalid json data:', metadata);
    }

    if (operation === 'cmdb_app_node_create') {
      return this.renderAppNodeCreateEvent();
    }

    if (operation === 'cmdb_app_node_delete') {
      return this.renderAppNodeDeleteEvent();
    }

    if (operation === 'cmdb_app_create') {
      return this.renderAppCreateEvent();
    }

    if (operation === 'cmdb_app_delete') {
      return this.renderAppDeleteEvent();
    }

    if (operation === 'cmdb_app_update') {
      return this.renderAppUpdateEvent();
    }

    if (operation === 'cmdb_node_create') {
      return this.renderNodeCreateEvent();
    }

    if (operation === 'cmdb_node_update') {
      return this.renderNodeUpdateEvent();
    }

    if (operation === 'cmdb_node_delete') {
      return this.renderNodeDeleteEvent();
    }

    if (operation === 'cmdb_user_create') {
      return this.renderUserCreateEvent();
    }

    if (operation === 'cmdb_user_update') {
      return this.renderUserUpdateEvent();
    }

    if (operation === 'cmdb_user_delete') {
      return this.renderUserDeleteEvent();
    }
    return (
      <>
        <span>
          <b>IP:</b>
          {nodeIp}
        </span>

        {appCNName ? (
          <span>
            <Divider type="vertical" />
            <b>应用名:</b>
            {appCNName}
          </span>
        ) : (
          ''
        )}

        {appManagers && appManagers.length > 0 ? (
          <span style={{ paddingLeft: '10px' }}>
            <Divider type="vertical" />
            <b>负责人:</b>
            {appManagers.join(',')}
          </span>
        ) : (
          ''
        )}

        {regionCNName ? (
          <>
            <Tag style={{ marginLeft: '10px' }} color="blue">
              {regionCNName}
            </Tag>
          </>
        ) : (
          ''
        )}
      </>
    );
  }

  renderUserCreateEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);

    return (
      <div style={{ lineHeight: '30px' }}>
        <Tag>{user_name}</Tag> 创建用户 <Tag>{data.username}</Tag> 权限为 <Tag>{data.access}</Tag>
      </div>
    );
  }

  renderUserUpdateEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);

    return (
      <div style={{ lineHeight: '30px' }}>
        <Tag>{user_name}</Tag> 将用户 <Tag>{data.username}</Tag> 权限更新为 <Tag>{data.access}</Tag>
      </div>
    );
  }

  renderUserDeleteEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);

    return (
      <div style={{ lineHeight: '30px' }}>
        <Tag>{user_name}</Tag> 删除用户 <Tag>{data.username}</Tag>
      </div>
    );
  }

  renderNodeCreateEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);

    return (
      <div style={{ lineHeight: '30px' }}>
        在 <Tag>{data.region_name}</Tag>区域 <Tag>{zone_code}</Tag> 机房的节点 <Tag>{data.ip}</Tag>{' '}
        被创建了
      </div>
    );
  }

  renderNodeDeleteEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    const { region_name, ip } = data;

    return (
      <div style={{ lineHeight: '30px' }}>
        <Tag>{region_name}</Tag> 区域 <Tag>{zone_code}</Tag> 机房 的节点 <Tag>{ip}</Tag> 被删除了
      </div>
    );
  }

  renderNodeUpdateEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    const { region_name, ip } = data;

    return (
      <div style={{ lineHeight: '30px' }}>
        <Tag>{region_name}</Tag> 区域 <Tag>{zone_code}</Tag> 机房 的节点 <Tag>{ip}</Tag> 被更新了
      </div>
    );
  }

  renderAppNodeCreateEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);

    return (
      <div style={{ lineHeight: '30px' }}>
        应用 <Tag>{app_name}</Tag> 在 <Tag>{data.region_name}</Tag>区域 <Tag>{zone_code}</Tag>{' '}
        机房的节点 <Tag>{data.ip}</Tag> 被创建了
      </div>
    );
  }

  renderAppNodeDeleteEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    const { region_name, ip } = data;

    return (
      <div style={{ lineHeight: '30px' }}>
        应用 <Tag>{app_name}</Tag>在 <Tag>{region_name}</Tag> 区域 <Tag>{zone_code}</Tag> 机房
        的节点 <Tag>{ip}</Tag> 被删除了
      </div>
    );
  }

  renderAppCreateEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    const { region_name, ip, users } = data;

    return (
      <div style={{ lineHeight: '30px' }}>
        新增了应用 <Tag>{app_name}</Tag>
        {users && users.length ? (
          <>
            <Divider type={'vertical'} />
            负责人: {users.join(',')}
          </>
        ) : (
          ''
        )}
      </div>
    );
  }

  renderAppDeleteEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    const { region_name, ip, users } = data;

    return (
      <div>
        应用 <Tag>{app_name}</Tag> 被删除
      </div>
    );
  }

  renderAppUpdateEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    const { region_name, ip, users } = data;

    return (
      <div>
        应用 <Tag>{app_name}</Tag> 发生了变更
      </div>
    );
  }
}
