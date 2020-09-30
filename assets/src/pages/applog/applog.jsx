import React from 'react';
import { connect } from 'dva';
import {
  Alert,
  Card,
  Col,
  message,
  Radio,
  Row,
  Form,
  Input,
  Button,
  Table,
  Select,
  Empty,
  Spin,
} from 'antd';
import { getLogUrl } from './services';

const RadioGroup = Radio.Group;

@connect(({ setting }) => ({
  setting,
}))
export default class Applog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appName: props.appName,
      env: props.env,
      records: [],
      typ: '',
      query: '*',
      url: '',
      loading: false,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps, nextContext) {
    // 说明已经传了数据
    if (nextProps.zoneCode === '' || nextProps.appName === '' || nextProps.mode === '') {
      return;
    }
    const { zoneCode, appName, mode, env } = this.state;

    // 内容一样就不在渲染
    if (nextProps.appName === appName && nextProps.env === env) {
      return;
    }

    // 一定要同步
    this.setState(
      {
        appName: nextProps.appName,
        env: nextProps.env,
      },
      () => {
        const { typ } = this.state;
        if (typ && typ !== '') {
          this.getList();
        }
      },
    );
  }

  getList = () => {
    this.setState({
      loading: true,
    });
    const { appName, query, env, typ } = this.state;
    if (!typ) {
      message.error('必须选择查询日志类型');
      return;
    }
    getLogUrl({ query, env, app_name: appName, typ }).then((res) => {
      const { code, msg, data } = res;
      if (code !== 0) {
        message.error(msg);
        this.setState({
          url: '',
        });
        return;
      }
      this.setState({
        url: data,
        loading: false,
      });
      message.success(res.msg);
      return;
    });
  };

  onSelectLogTyp = (e) => {
    this.setState({
      typ: e,
    });
  };

  render() {
    const { zoneCode, appName, env, url, loading, typ } = this.state;
    const colSpan = {
      xxl: 6,
      xl: 6,
      lg: 6,
      md: 6,
      xs: 6,
    };

    if (!env) {
      return (
        <div style={{ marginTop: 10 }}>
          <Empty description={'请选择环境和可用区'} style={{ padding: '100px' }} />
        </div>
      );
    }

    return (
      <div style={{ backgroundColor: '#f7f8fa' }}>
        <div
          style={{
            marginLeft: 10,
            marginTop: 10,
            marginRight: 10,
            marginBottom: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <Card
            title={
              <Row>
                <Col {...colSpan}>
                  <Select
                    showSearch
                    style={{ width: '90%' }}
                    placeholder="选择查询日志类型"
                    optionFilterProp="children"
                    value={typ}
                    onSelect={this.onSelectLogTyp}
                  >
                    <Select.Option key="console" value="console">
                      启动日志
                    </Select.Option>
                    <Select.Option key="biz" value="biz">
                      业务日志
                    </Select.Option>
                    <Select.Option key="jupiter" value="jupiter">
                      框架日志
                    </Select.Option>
                  </Select>
                </Col>

                <Button
                  type="primary"
                  onClick={this.getList}
                  style={{ marginRight: `16px` }}
                  htmlType={`button`}
                >
                  查询
                </Button>
              </Row>
            }
          >
            <div>
              <Row>
                <Col span={24}>
                <Spin spinning={loading}>

                  {url && (
                    <iframe
                      src={url}
                      width="100%"
                      height={'780px'}
                      frameBorder="0"
                      onLoad={() => {
                        this.setState({
                          loading: false,
                        });
                      }}
                    />
                  )}
                </Spin>
                </Col>
              </Row>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
