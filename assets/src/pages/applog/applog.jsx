import React, { useRef } from 'react';
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
  Tabs,
} from 'antd';
import Pannel from './pannel';
import { getLogUrl } from './services';
import styles from './index.less';

const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

@connect(({ setting }) => ({
  setting,
}))
export default class Applog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      aid: props.aid,
      appName: props.appName,
      env: props.env,
      records: [],
      typ: 'biz',
      query: '',
      url: '',
      loading: false,
    };
  }

  componentDidMount() {
    const { typ } = this.state;
    if (typ && typ !== '') {
      this.getList();
    }
  }

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
        aid: nextProps.aid,
      },
      () => {
        const { typ } = this.state;
        if (typ && typ !== '') {
          this.getList();
        }
      },
    );
  }

  getList = (typT) => {
    this.setState({
      loading: true,
    });

    const { aid, appName, query, env, typ } = this.state;
    let typN = typ;
    if (typT) {
      typN = typT
    }
    if (!typ) {
      message.error('必须选择查询日志类型');
      return;
    }
    getLogUrl({ query, env, app_name: appName, typ: typN, aid }).then((res) => {
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
      <div className={styles.applog} style={{ backgroundColor: '#f7f8fa' }}>
        <div
          style={{
            marginTop: 5,
            height: '100%',
          }}
        >
          <Card
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
            title={
              <Row>
                <Tabs
                  hideAdd
                  onChange={(activeKey) => {
                    this.onSelectLogTyp(activeKey);
                    this.getList(activeKey);
                  }}
                  activeKey={typ}
                  tabPosition="top"
                >
                  <TabPane tab={"业务日志"} key={"biz"}>
                  </TabPane>
                  <TabPane tab={"框架日志"} key={"jupiter"}>

                  </TabPane>
                  <TabPane tab={"启动日志"} key={"console"}>

                  </TabPane>
                </Tabs>

              </Row>
            }
          >
            <Spin style={{ flex: 1 }} spinning={loading}>
              {url && <Pannel url={url} />}
            </Spin>
          </Card>
        </div>
      </div>
    );
  }
}
