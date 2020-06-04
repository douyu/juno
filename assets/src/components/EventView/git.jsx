import { Component } from 'react';
import { Icon, Popover, Tag } from 'antd';
import UserInfo from './userinfo';
import styles from './style.css';

const CommitMessageLen = 32;

export default class GitEventView extends Component {
  render() {
    const { source, metadata = '', operation } = this.props.data;
    let commitData = JSON.parse(metadata);
    switch (operation) {
      case 'git push':
        return this.renderPush();
      case 'git_pipeline':
        return this.renderPipeline();
      case 'git_job':
        return this.renderJob();
    }
    return <></>;
  }

  renderPush() {
    let { source, metadata = '', operation, user_name } = this.props.data;
    let commitData = JSON.parse(metadata);
    let { user_avatar, commits = [], ref, project } = commitData;

    let commit = null;
    if (ref) {
      let refSplices = ref.split('/');
      ref = refSplices[refSplices.length - 1];
    }
    if (commits.length > 0) commit = commits[0];

    return (
      <span>
        <UserInfo avatar={user_avatar} name={user_name ? user_name : user_name} /> 退送到仓库{' '}
        <a href={project.git_http_url}>{project.name}</a>
        <Tag color="blue" style={{ marginLeft: '10px' }}>
          <Icon type="branches" />
          {ref}
        </Tag>
        <div className={styles.cmLine}>
          {commit ? (
            <Popover content={commit.message}>
              <a target="_blank" href={commit.url}>
                {commit.id.substr(0, 8)}
              </a>{' '}
              {commit.message.substr(0, CommitMessageLen)}
              {commit.message.length > CommitMessageLen ? '...' : ''}
            </Popover>
          ) : (
            '...'
          )}
        </div>
      </span>
    );
  }

  renderPipeline() {
    const { metadata, app_name } = this.props.data;
    let data = JSON.parse(metadata);
    if (!data) return '';
    const {
      user = { name, avatar_url },
      commit = { id, messag, url },
      object_attributes = { status, duration, created_at, finished_at },
      project,
    } = data;

    return (
      <span>
        <UserInfo avatar={user.avatar_url} name={user.name} /> 的提交{' '}
        <a href={commit.url} target="_blank">
          <Icon type="number" />
          {commit.id.substr(0, 8)}
        </a>{' '}
        触发了 Git Pipeline{' '}
        {object_attributes.status ? (
          <Popover
            content={`耗时: ${object_attributes.duration}s | 开始: ${object_attributes.created_at} | 结束: ${object_attributes.finished_at}`}
          >
            {object_attributes.status === 'success' ? (
              <Tag color="green">success</Tag>
            ) : (
              <Tag color="red">{object_attributes.status}</Tag>
            )}
          </Popover>
        ) : (
          ''
        )}
        <div className={styles.cmLine}>
          <span>
            <Popover content={commit.message}>
              {commit.message.substr(0, CommitMessageLen)}
              {commit.message.length > CommitMessageLen ? '...' : ''}
            </Popover>
          </span>
        </div>
      </span>
    );
  }

  renderJob() {
    const { metadata } = this.props.data;
    let data = JSON.parse(metadata);
    if (!data) return '---';
    const { user = { name, email }, commit = { sha, message }, repository } = data;
    return (
      <span>
        <UserInfo name={user.name} /> 的提交{' '}
        <Tag>
          <Icon type="number" />
          {commit.sha.substr(0, 8)}
        </Tag>{' '}
        在 <a href={repository.homepage}>{repository.name}</a> 触发了 Git Job
        <div className={styles.cmLine}>
          <Popover content={commit.message}>
            {commit.message.substr(0, CommitMessageLen)}
            {commit.message.length > CommitMessageLen ? '...' : ''}
          </Popover>
        </div>
      </span>
    );
  }
}
