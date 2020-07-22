import React from 'react';
import { Divider, Tag } from 'antd';

export default class ConfgoEventView extends React.Component {
  render() {
    const { source, operation, metadata, user_name, app_name, env, zone_code } = this.props.data;
    const { users = [], file_name } = JSON.parse(metadata);
    let doSome = '';
    if (operation === 'confgo_file_create') {
      doSome = '配置文件新增';
    }

    if (operation === 'confgo_file_update') {
      doSome = '配置文件更新';
    }

    if (operation === 'confgo_file_delete') {
      doSome = '配置文件删除';
    }

    if (operation === 'confgo_file_publish') {
      doSome = '配置发布';
    }

    if (operation === 'confgo_file_rollback') {
      doSome = '配置文件回滚';
    }

    if (operation === 'confgo_item_create') {
      doSome = '配置项新增';
    }

    if (operation === 'confgo_item_update') {
      doSome = '配置项更新';
    }

    if (operation === 'confgo_item_delete') {
      doSome = '配置项删除';
    }

    if (operation === 'confgo_watch_http_push') {
      doSome = '配置文件HTTP长轮询推送成功';
    }

    if (operation === 'confgo_watch_file_sync') {
      doSome = '配置文件于服务器文件系统同步成功';
    }

    return (
      <div style={{ lineHeight: '30px' }}>
        <Tag>{user_name}</Tag>对应用 <Tag>{app_name}</Tag> 在 <Tag>{env}</Tag>{' '}
        <Tag>{zone_code}</Tag>进行了 <Tag color="blue">{doSome}</Tag>
      </div>
    );
  }

  renderNodeCreateEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);

    return (
      <div style={{ lineHeight: '30px' }}>
        应用 <Tag>{app_name}</Tag> 在 <Tag>{data.region_name}</Tag>区域 <Tag>{zone_code}</Tag>
        机房的节点 <Tag>{data.ip}</Tag> 被创建了
      </div>
    );
  }

  renderNodeDeleteEvent() {
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
