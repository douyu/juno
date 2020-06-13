import React from 'react';
import { Table, Modal, Row, Col, message, Button } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import 'react-gh-like-diff/dist/css/diff2html.min.css';
import { RollbackVersion } from '../service';
import styles from '../style/code.less';

//publishChangeData
@connect(({ confuNew }) => ({
  publishChangeData: confuNew.publishChangeData,
  configHistoryList: confuNew.configHistoryList,
}))
export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history_id: 0,
    };
  }

  componentWillMount() {
    // 查找上个版本
    this.getHistoryList().then((_) => {
      const { configHistoryList = [] } = this.props;
      if (configHistoryList[0] && configHistoryList[0].id) {
        this.getChangeData(configHistoryList[0].id);
      } else {
        //没有发布历史
        message.warn('没有发布历史');
      }
    });
  }

  //发布历史
  getHistoryList = () => {
    const { caid } = this.props;
    return this.props.dispatch({
      type: 'confuNew/queryHistoryList',
      payload: { caid },
    });
  };

  getChangeData = (history_id) => {
    this.props.dispatch({
      type: 'confuNew/queryPublishChange',
      payload: { id: history_id * 1 },
    });
  };

  // 执行回滚
  rollback = () => {
    const { caid } = this.props;
    RollbackVersion({ caid: caid * 1 }).then((res) => {
      if (res.code === 0) {
        message.success('回滚成功，请再发布一次');
        if (this.props.rollback) {
          this.props.rollback();
        }
      } else {
        message.error('回滚失败');
      }
    });
  };

  render() {
    const that = this;
    const { show, publishChangeData = {} } = this.props;

    const { pre_content = '', content = '', diff_list = [] } = publishChangeData;

    const opMap = {
      add: '删除',
      update: '更新',
      del: '新增',
    };

    return (
      <Modal
        title="回滚到上个版本"
        visible={show}
        maskClosable
        onCancel={this.props.cancel}
        footer={null}
        destroyOnClose
        width={1200}
      >
        <div>
          <Row>
            <Col span={12}>回滚前的配置</Col>
            <Col span={12}>回滚后的配置</Col>
          </Row>
          <div style={{ overflow: 'auto' }}>
            <ReactGhLikeDiff
              options={{
                originalFileName: '原始内容',
                updatedFileName: '更新内容',
              }}
              past={content}
              current={pre_content}
            />
          </div>
          <Row gutter={24}>
            <Col span={20}></Col>
            <Col span={4}>
              <Button.Group>
                <Button
                  style={{ paddingRight: '8px' }}
                  onClick={(e) => {
                    that.props.cancel();
                  }}
                >
                  取消
                </Button>
                <Button
                  type={'danger'}
                  onClick={(e) => {
                    this.rollback();
                    that.props.cancel();
                  }}
                >
                  确认回滚
                </Button>
              </Button.Group>
            </Col>
          </Row>
          <Row>
            <Col span={20}></Col>

            <Col>
              <div style={{ color: 'red' }}>
                <span>*回滚会丢弃当前未保存的配置</span>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}
