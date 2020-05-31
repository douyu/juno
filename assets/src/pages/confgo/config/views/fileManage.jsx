import { Table, Modal, message, Popconfirm, Tag } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { delConfigFile } from '../service';

@connect(({ confuNew }) => ({
  appConfigList: confuNew.appConfigList,
}))
export default class NormalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleFileDel = (item) => {
    const { id, aid, file_name, zone_code, app_name } = item;

    delConfigFile({ id, aid, zone_code, app_name, file_name }).then((rs) => {
      if (rs.code === 0) {
        message.success('删除文件', file_name, '成功');
        this.updateConfigList();
      } else {
        message.error(rs.msg);
      }
    });
  };

  updateConfigList = () => {
    const { app_id: aid, app_name: app_name, env, zone_code } = this.props;
    return this.props.dispatch({
      type: 'confuNew/queryAppConfigs',
      payload: { aid, app_name, env },
    });
  };

  render() {
    const that = this;
    const { show, appConfigList = [] } = this.props;
    const appInfo = appConfigList[0] || {};
    const { configs = [] } = appInfo;
    const {} = this.state;
    const cols = [
      {
        key: 'file_name',
        dataIndex: 'file_name',
        title: '文件名',
      },
      {
        key: 'env',
        dataIndex: 'env',
        title: '环境',
      },
      {
        key: 'zone_code',
        dataIndex: 'zone_code',
        title: '机房',
      },
      {
        key: 'op',
        dataIndex: 'op',
        title: '操作',
        render(t, r) {
          return (
            <div>
              <Popconfirm
                title="确定删除吗？"
                onConfirm={() => {
                  that.handleFileDel(r);
                }}
              >
                <Tag color={'red'}>删除</Tag>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return (
      <Modal
        title="文件列表"
        visible={show}
        maskClosable
        onCancel={this.props.cancel}
        footer={null}
        destroyOnClose
      >
        <Table dataSource={configs} columns={cols} />
      </Modal>
    );
  }
}
