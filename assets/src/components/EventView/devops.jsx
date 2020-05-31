import { Component } from 'react';
import { Divider, Icon, Tag } from 'antd';
import UserInfo from './userinfo';
import styles from './style.css';
import user from '../../../mock/user';

export default class GitEventView extends Component {
  render() {
    const { source, operation, metadata, user_name } = this.props.data;
    let data = JSON.parse(metadata);
    if (!data) return '---';
    if (operation === 'devops_register' || operation === 'devops_unregister') {
      return this.renderRegisterEvent();
    }
    if (operation === 'devops_update') {
      return this.renderUpdateEvent();
    }
    if (operation === 'devops_deploy') {
      return this.renderDeployEvent();
    }
    if (operation === 'devops_rollback') {
      return this.renderRollbackEvent();
    }
    return (
      <span>
        <UserInfo name={user_name} />
        <span className={styles.eventInfo}>
          {data.commit_id ? (
            <Tag color="orange">
              <Icon type="number" /> {data.commit_id}
            </Tag>
          ) : (
            ''
          )}
        </span>
      </span>
    );
  }

  renderRegisterEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    return (
      <span>
        应用 <Tag>{app_name}</Tag>在机房 {zone_code}{' '}
        {operation === 'devops_register' ? '注册了节点' : '注销了节点'}
        <div style={{ marginTop: '10px' }}>
          <b>地址:</b> {data.address}
          <Divider type="vertical" />
          <b>协议:</b> {data.schema}
        </div>
      </span>
    );
  }

  renderUpdateEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    return (
      <span>
        <UserInfo name={user_name} /> 更新了节点 <Tag color="orange">{data.regKey}</Tag>
        <div style={{ marginTop: '10px' }}>
          <b>分组:</b> {data.labels.group}
          <Divider type="vertical" />
          <b>权重:</b> {data.labels.weight}
          <Divider type="vertical" />
          <b>状态:</b> {data.labels.enable}
        </div>
      </span>
    );
  }

  renderDeployEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    return (
      <span style={{ lineHeight: '30px' }}>
        <UserInfo name={user_name} /> 的提交{' '}
        <Tag color="orange">
          <Icon type="number" /> {data.commit_id}
        </Tag>{' '}
        触发了应用 <Tag>{app_name}</Tag> 在 {data.host_name} ({data.ip}) 上的自动部署
      </span>
    );
  }

  renderRollbackEvent() {
    const { source, operation, metadata, user_name, app_name, zone_code } = this.props.data;
    let data = JSON.parse(metadata);
    return (
      <span style={{ lineHeight: '30px' }}>
        <UserInfo name={user_name} /> 回滚了应用 <Tag>{app_name}</Tag> 在 {data.host_name} (
        {data.ip}) 上的发布{' '}
        <Tag color="orange">
          <Icon type="number" /> {data.commit_id}
        </Tag>
      </span>
    );
  }
}
