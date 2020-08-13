import React from 'react';
import {connect} from 'dva';
import {Alert, Card, Col, message, Radio, Row, Form, Input, Button, Table, Select, Empty} from 'antd';
import {etcdList} from './services';


const RadioGroup = Radio.Group;

@connect(({setting}) => ({
  setting,
}))

export default class Etcd extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appName: props.appName,
      mode: props.mode,
      zoneCode: props.zoneCode,
      env: props.env,
      records: [],
      prefix: '',
      suffix: '',
      serviceName: '',
      showService: false,
    };
  }

  componentDidMount() {
    console.log('>>>>> props', this.props);
    const {prefix} = this.state;
    if (prefix&&prefix!==""){
      this.getList();
    }
    // 加载设置
    this.props.dispatch({
      type: 'setting/loadSettings',
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    console.log('Monitor -> componentWillReceiveProps -> nextProps', nextProps);
    // 说明已经传了数据
    if (nextProps.zoneCode === '' || nextProps.appName === '' || nextProps.mode === '') {
      return;
    }
    const {zoneCode, appName, mode, env} = this.state;

    // 内容一样就不在渲染
    if (
      nextProps.zoneCode === zoneCode &&
      nextProps.appName === appName &&
      nextProps.mode === mode &&
      nextProps.env === env
    ) {
      return;
    }

    // 一定要同步
    this.setState(
      {
        zoneCode: nextProps.zoneCode,
        appName: nextProps.appName,
        env: nextProps.env,
        mode: nextProps.mode,
      },
      () => {
        const {prefix} = this.state;
        if (prefix&&prefix!==""){
          this.getList();
        }
      },
    );
  }

  getList = () => {
    const {appName, zoneCode, env, prefix, suffix} = this.state;
    if (!prefix){
      message.error("必须选择查询前缀");
      return;
    }
    const app = prefix === '/dubbo/' ? '' : appName;
    etcdList({appName: app, zoneCode, env, prefix, suffix}).then((res) => {
      const {code, msg, data} = res;
      if (code !== 0) {
        message.error(msg);
        this.setState({
          records: [],
        });
        return;
      }
      this.setState({
        records: data,
      });
      message.success(res.msg);
      return;
    });
  };

  reset = () => {
    // const {appName, prefix, suffix,showService} = this.state;
    this.setState({
      prefix: '',
      suffix: '',
      showService: false,
    });
  };

  onChangeSuffix = (e) => {
    console.log("----- onChangeSuffix", e.target.value)
    this.setState({
      suffix: e.target.value,
    });
  }

  onSelectPrefix = (e) => {
    console.log("----- onSelectPrefix", e)
    if (e === '/dubbo/') {
      console.log('选中了dubbo');
      this.setState({
        showService: true,
        prefix: e,
      });
      return;
    }
    this.setState({
      prefix: e,
      showService: false,
    });
  }

  columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      width: 600,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 600,
    },
    /*
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 40,
      render: (text) => {
        return text ? <Popover content={text}>
          <div style={{ textAlign: 'left', width: `30%` }}>
            <Button style={{ width: '100%' }} type="link"  size={`small`}
                    onClick={e => {
                      this.showEtcdValue(text);
                    }}>查看详情</Button>
          </div>
        </Popover> : '暂无';
      },
    },
       {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          width: 250,
          render: (text) => {
            return text ? <Popover content={text}>
              <div style={{ textAlign: 'left', margin: '0 auto', width: `100%` }}>
                <span style={{ cursor: 'pointer' }}>{this.showJson(text)}</span>
              </div>
            </Popover> : '暂无';
          },
        },*/
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: 50,
    },
    {
      title: 'ModRevision',
      dataIndex: 'mod_revision',
      key: 'mod_revision',
      width: 70,
    },
    {
      title: 'CreateRevision',
      dataIndex: 'create_revision',
      key: 'create_revision',
      width: 80,
    },
    {
      title: 'Lease',
      dataIndex: 'lease',
      key: 'lease',
      width: 80,
    }
  ];

  render() {
    const {
      zoneCode,
      appName,
      env, records, showService,
      prefix, suffix
    } = this.state;

    const {etcd} = this.props.setting.settings;
    console.log(" --- etcd", etcd);
    let etcdList = [];
    etcd && etcd.map((item) => {
      if (item.prefix) {
        etcdList.push(item.prefix);
      }
    })
    console.log("etcd --- etcdList", etcdList);
    const colSpan = {
      xxl: 6,
      xl: 6,
      lg: 6,
      md: 6,
      xs: 6,
    };

    if (!env || !zoneCode) {
      return (
        <div style={{marginTop: 10}}>
          <Empty description={"请选择环境和可用区"} style={{padding: '100px'}}/>
        </div>
      );
    }
    if (zoneCode === 'all') {
      return (
        <div style={{marginTop: 10}}>
          <Empty description={"请选择可用区"} style={{padding: '100px'}}/>
        </div>
      );
    }

    return (
      <div style={{backgroundColor: '#f7f8fa'}}>
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
            title={<Row>
              <Col {...colSpan}>
                <Select
                  showSearch
                  //mode="tags"
                  //size={`small`}
                  style={{width: '90%'}}
                  placeholder="选择查询前缀"
                  optionFilterProp="children"
                  //defaultValue={appName}
                  value={prefix}
                  onSelect={this.onSelectPrefix}
                  // disabled={true}
                >
                  {etcdList.map((v) => {
                    return (
                      <Select.Option key={v} value={v}>
                        {v}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col>

              {!showService &&
              <Col {...colSpan}>
                <Input style={{width: '90%'}} disabled={true} value={appName}
                       placeholder="应用名"/>
              </Col>}
              <Col {...colSpan}>
                <Input style={{width: '90%'}} value={suffix} onChange={this.onChangeSuffix}
                       placeholder="输入查询后缀"/>
              </Col>
              <Button type="primary" onClick={this.getList} style={{marginRight: `16px`}}
                      htmlType={`button`}>
                查询
              </Button>
              <Button onClick={this.reset}>
                清空条件
              </Button>
            </Row>}
          >
            <div>
              <Row>
                <Table
                  rowKey="id"
                  dataSource={records}
                  columns={this.columns}
                />
              </Row>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}
