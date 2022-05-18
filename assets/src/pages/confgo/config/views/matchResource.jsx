import React from 'react';
import { Table, Modal, Row, Col, Button, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { resourceAutoReplace } from '../service';

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history_id: 0,
    };
  }

  componentWillMount() {}

  //同步更新 最新的资源
  syncResource = () => {
    const { caid } = this.props;
    resourceAutoReplace({ caid })
      .then((rs) => {
        if (rs.code === 0) {
          message.success('同步配置成功');
          this.props.cancel();
          this.props.reload();
        } else {
          message.success('同步配置失败');
        }
      })
      .catch((err) => {
        message.success('同步配置失败');
      });
  };

  render() {
    const that = this;
    const { list = [], show } = this.props;

    const cols = [
      {
        key: 'key',
        dataIndex: 'key',
        title: 'Key',
      },
      {
        key: 'resource_name',
        dataIndex: 'resource_name',
        title: '资源名',
      },
      {
        key: 'config_value',
        dataIndex: 'config_value',
        title: '配置中的值',
      },
      {
        key: 'resource_value',
        dataIndex: 'resource_value',
        title: '最新的资源值',
      },
    ];

    return (
      <Modal
        title="资源检查"
        visible={show}
        maskClosable
        onCancel={this.props.cancel}
        footer={null}
        destroyOnClose
        width={1200}
      >
        <div>
          <Table columns={cols} dataSource={list} />
          <Button type={'primary'} onClick={this.syncResource} disabled={list.length === 0}>
            一键同步
          </Button>
        </div>
      </Modal>
    );
  }
}
