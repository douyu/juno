import { Form, Icon, Input, Button, Checkbox, Modal, Row, Col, message, Spin } from 'antd';
import React from 'react';
import moment from 'moment';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import 'react-gh-like-diff/dist/css/diff2html.min.css';
import { getOriginPublishChange, getAppNodes } from '../service';
import styles from '../style/code.less';

const TextArea = Input.TextArea;

export default class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.caid = 0;
    this.state = {
      showPreview: true,
      pre: '',
      now: '',
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps, nextContext) {
    const { item = {}, show } = nextProps;
    const { caid } = item;
    if (this.caid !== caid) {
      this.caid = caid;
    }
    if (show) {
      this.getOriginChange(caid);
    }
  }

  handleSubmit = (values) => {
    this.props.submit(values);
    this.setState({
      showPreview: true,
    });
  };

  getOriginChange = (caid) => {
    getOriginPublishChange({ caid })
      .then((rs) => {
        if (rs.code === 0) {
          const { pre = '', now = '' } = rs.data || {};
          this.setState({
            pre,
            now,
          });
        }
      })
      .catch((err) => {
        message.warn('查询异常' + err.message);
      });
  };

  render() {
    const { show, publish_loading, file_name } = this.props;

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const message = `${now}-release`;

    return (
      <div>
        <Modal
          title={
            <div>
              <span>发布</span>
              <span style={{ marginLeft: '8px', fontSize: '16px', fontWeight: 500 }}>
                {file_name}
              </span>
            </div>
          }
          visible={show}
          maskClosable
          onCancel={(e) => {
            this.props.cancel(e);
            this.setState({
              showPreview: true,
            });
          }}
          width={1200}
          footer={null}
          destroyOnClose
        >
          <Form
            onFinish={this.handleSubmit}
            className="login-form"
            initialValues={{ message: message }}
          >
            <Form.Item
              label={'message'}
              name="message"
              rules={[{ required: true, message: '填写提交记录' }]}
            >
              <TextArea placeholder="" />
            </Form.Item>
            <Form.Item>
              <div style={{ textAlign: 'center' }}>
                <Button.Group>
                  <Button
                    type={'primary'}
                    onClick={() => {
                      const { showPreview } = this.state;
                      this.setState({
                        showPreview: !showPreview,
                      });
                    }}
                  >
                    预览变更
                  </Button>
                  <Button
                    onClick={(e) => {
                      this.props.cancel(e);
                      this.setState({
                        showPreview: true,
                      });
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    type="success"
                    style={{ backgroundColor: '#87d068', color: 'white' }}
                    htmlType="submit"
                    className="login-form-button"
                    loading={publish_loading}
                  >
                    {publish_loading && '提交中'}
                    {!publish_loading && '提交'}
                  </Button>
                </Button.Group>
                <br />
                <span style={{ color: 'red' }}>*: 发布成功后需要手动重启应用生效</span>
              </div>
            </Form.Item>
          </Form>
          {this.state.showPreview && (
            <div style={{ overflow: 'auto' }}>
              <Row>
                <Col span={12}>已发布的配置 </Col>
                <Col span={12}>当前的配置</Col>
              </Row>
              <ReactGhLikeDiff
                options={{
                  originalFileName: '原始内容',
                  updatedFileName: '更新内容',
                }}
                past={this.state.pre}
                current={this.state.now}
              />
            </div>
          )}
        </Modal>
      </div>
    );
  }
}
