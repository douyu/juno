import React from 'react';
import { Table, Modal, Row, Col } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import 'react-gh-like-diff/dist/css/diff2html.min.css';
import styles from '../style/code.less';

//publishChangeData
@connect(({ confuNew }) => ({
  publishChangeData: confuNew.publishChangeData,
}))
export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history_id: 0,
    };
  }

  componentWillMount() {}

  getChangeData = () => {
    const { history_id } = this.state;
    this.props.dispatch({
      type: 'confuNew/queryPublishChange',
      payload: { id: history_id * 1 },
    });
  };

  render() {
    const that = this;
    const { list = [], show, publishChangeData = {} } = this.props;

    const { pre_content = '', content = '', diff_list = [] } = publishChangeData;

    const cols = [
      {
        key: 'message',
        dataIndex: 'message',
        title: '提交记录',
      },
      {
        key: 'create_time',
        dataIndex: 'create_time',
        title: '提交时间',
        render(t) {
          return moment(t * 1000).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        key: 'op_name',
        dataIndex: 'op_name',
        title: '操作人',
      },
      {
        key: 'op',
        dataIndex: 'op',
        title: '操作',
        render(t, r) {
          return (
            <div
              onClick={() => {
                that.setState(
                  {
                    history_id: r.id,
                  },
                  () => {
                    that.getChangeData();
                  },
                );
              }}
            >
              <a>版本详情</a>
            </div>
          );
        },
      },
    ];

    return (
      <Modal
        title="发布历史"
        visible={show}
        maskClosable
        onCancel={this.props.cancel}
        footer={null}
        destroyOnClose
        width={1200}
      >
        <div>
          <Table columns={cols} dataSource={list} />
          {this.state.history_id !== 0 && (
            <div style={{ overflow: 'auto' }}>
              <Row>
                <Col span={12}>上个版本的配置</Col>
                <Col span={12}>选中的配置</Col>
              </Row>
              <ReactGhLikeDiff
                options={{
                  originalFileName: '原始内容',
                  updatedFileName: '更新内容',
                }}
                past={pre_content}
                current={content}
                splitView={true}
              />
            </div>
          )}
        </div>
      </Modal>
    );
  }
}
