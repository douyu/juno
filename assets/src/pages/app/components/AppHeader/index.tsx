import React, {useState} from 'react';
import {Col, Descriptions, Drawer, Row, Select, Tag, Tooltip} from 'antd';
import {ConfgoBase} from '../../../confgo/config/view';
import styles from './style.less';
import {DesktopOutlined} from '@ant-design/icons';
import {connect} from "dva";
import {ConnectState} from "@/models/connect";

const {Option} = Select;

export interface AppHeaderInterface extends ConfgoBase {
  getAppInfoAction: (aid: number, appName: string) => void;
  setEnvAction: (values: any) => void;
  appInfo: any;
  appIdcList: any;
  idcList: any;
  initDisable: boolean;
  versionConfig: any
  changeVersion: any
  versionKey: any
  envZone: {
    env: string
    zone_list: {
      zone_code: string
      zone_name: string
    }[]
  }[]
  k8sClusters: {
    list: any[]
  },
  envList: string[]
}

function AppHeader(props: AppHeaderInterface) {
  const {
    appInfo,
    appList,
    getAppInfoAction,
    setEnvAction,
    env,
    initDisable,
    versionConfig,
    changeVersion,
    versionKey,
  } = props;

  const [disable, setDisable] = useState(initDisable);
  const [visible, setVisible] = useState(false);

  let showDrawer = () => {
    setVisible(true);
  };

  let onClose = () => {
    setVisible(false);
  };

  let appOption = [];
  appList.forEach((element: any) => {
    appOption.push(<Option value={element.app_name}>{element.app_name}</Option>);
  });

  const {name, biz_domain, http_port, rpc_port, govern_port, users, app_name} = appInfo || {};

  let userInfo: {} | any = [];
  if (users != undefined) {
    users.forEach((user: string) => {
      userInfo.push(
        <Tag color="green" key={user}>
          {user}
        </Tag>,
      );
    });
  }

  let dataSource: {} | any = [];
  appList.forEach((value: any, index: number) => {
    dataSource.push(
      <Option key={index} value={value.aid + '*' + value.app_name}>
        {value.app_name}
      </Option>,
    );
  });

  let appChange = (value: any) => {
    let appInfo = value.split('*');
    getAppInfoAction(appInfo[0], appInfo[1]);
    setDisable(false);
  };

  let versionOpt: {} | any = [];

  versionConfig instanceof Array &&
  versionConfig.map((item) => {
    if (item.name && item.versionKey) {
      versionOpt.push(
        <Option value={item.versionKey}>
          <Tag color="#87d068">{item.name}</Tag>
        </Option>,
      );
    }
  });

  const tagColor = {
    dev: '#87d068',
    live: '#2db7f5',
    pre: '#108ee9',
    stress: '#f50',
    gray: '#f50',
    pub: '#f50',
    prod: '#f50',
  }

  return (
    <>
      <Row gutter={24} style={{width: '100%'}}>
        <Col span={8}>
          <Select
            showSearch
            size="large"
            style={{width: '100%'}}
            placeholder="应用"
            optionFilterProp="children"
            onChange={appChange}
            value={app_name}
            filterOption={(input, option) =>
              option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {dataSource}
          </Select>
        </Col>
        <Col span={3}>
          <Select
            // showSearch
            size="large"
            style={{width: '100%'}}
            placeholder="环境"
            optionFilterProp="children"
            onChange={setEnvAction}
            value={env}
            disabled={disable}
            filterOption={(input, option) =>
              option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {props.envList.map(env => {
              return <Option value={env} key={env}>
                <Tag color={tagColor[env] || null}>{env}</Tag>
              </Option>
            })}
          </Select>
        </Col>
        <Col span={3}>
          <Select
            showSearch
            size="large"
            style={{width: '100%'}}
            placeholder="服务版本切换"
            optionFilterProp="children"
            onChange={changeVersion}
            value={versionKey}
            disabled={disable}
            filterOption={(input, option) =>
              option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {versionOpt}
          </Select>
        </Col>
        <Col>
          <div className={styles.cube}>
            <a type="primary" onClick={showDrawer}>
              <DesktopOutlined/>
            </a>
          </div>
        </Col>
      </Row>
      <Row>
        <Drawer
          title="详情"
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
          width="300px"
        >
          <Descriptions size="small" column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}>
            <Descriptions.Item label="应用">{name}</Descriptions.Item>
          </Descriptions>

          <Descriptions size="small" column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}>
            <Descriptions.Item label="项目域">{biz_domain}</Descriptions.Item>
          </Descriptions>

          <Descriptions size="small" column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}>
            <Descriptions.Item label="项目">
              <Tooltip title={name}>
                <span>{app_name}</span>
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions size="small" column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}>
            <Descriptions.Item label="负责人" span={2}>
              <span>{userInfo}</span>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions size="small" column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}>
            <Descriptions.Item label="HTTP">{http_port}</Descriptions.Item>
          </Descriptions>

          <Descriptions size="small" column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}>
            <Descriptions.Item label="gRPC">{rpc_port}</Descriptions.Item>
          </Descriptions>

          <Descriptions size="small" column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}>
            <Descriptions.Item label="Govern">{govern_port}</Descriptions.Item>
          </Descriptions>
        </Drawer>
      </Row>
    </>
  );
}


export default connect(({setting}: ConnectState) => {
  return {
    k8sClusters: setting.settings.k8s_cluster
  }
})(AppHeader)
