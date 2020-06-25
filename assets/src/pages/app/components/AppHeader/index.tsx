import React, { useState } from 'react';
import { Tooltip, Descriptions, Row, Col, Select, Tag, Drawer, Button } from 'antd';
import { ConfgoBase } from '../../../confgo/config/view';
const { Option } = Select;
import styles from './style.less';
import { SearchOutlined } from '@ant-design/icons';

export interface AppHeaderInterface extends ConfgoBase {
  getAppInfoAction: (aid: number, appName: string) => void;
  setEnvAction: (values: any) => void;
  appInfo: any;
  appIdcList: any;
  idcList: any;
  initDisable: boolean;
}

export default function AppHeader(props: AppHeaderInterface) {
  const { appInfo, appList, getAppInfoAction, setEnvAction, env, idcList, initDisable } = props;

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

  let isRepeat = (m: [], env: string) => {
    let f = false;
    m.forEach((element) => {
      if (element === env) {
        f = true;
      }
    });
    return f;
  };

  const { name, biz_domain, http_port, rpc_port, govern_port, users, app_name } = appInfo || {};

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
  appList.forEach((value: any) => {
    dataSource.push(<Option value={value.aid + '*' + value.app_name}>{value.app_name}</Option>);
  });

  let appChange = (value: any) => {
    let appInfo = value.split('*');
    getAppInfoAction(appInfo[0], appInfo[1]);
    setDisable(false);
  };

  let envOpt: {} | any = [];
  let envRepeatMap: {} | any = [];
  idcList.forEach((value: any) => {
    if (!isRepeat(envRepeatMap, value.env)) {
      envRepeatMap.push(value.env);
      switch (value.env) {
        case 'dev':
          envOpt.push(
            <Option value={value.env}>
              <Tag color="#87d068">{value.env}</Tag>
            </Option>,
          );
          break;
        case 'live':
          envOpt.push(
            <Option value={value.env}>
              <Tag color="#2db7f5">{value.env}</Tag>
            </Option>,
          );
          break;
        case 'pre':
          envOpt.push(
            <Option value={value.env}>
              <Tag color="#108ee9">{value.env}</Tag>
            </Option>,
          );
          break;
        case 'stress':
          envOpt.push(
            <Option value={value.env}>
              <Tag color="#f50">{value.env}</Tag>
            </Option>,
          );
          break;
        case 'gray':
          envOpt.push(
            <Option value={value.env}>
              <Tag color="#f50">{value.env}</Tag>
            </Option>,
          );
          break;
        case 'pub':
          envOpt.push(
            <Option value={value.env}>
              <Tag color="#f50">{value.env}</Tag>
            </Option>,
          );
          break;
        case 'prod':
          envOpt.push(
            <Option value={value.env}>
              <Tag color="#f50">{value.env}</Tag>
            </Option>,
          );
          break;
        default:
          envOpt.push(<Option value={value.env}>{value.env}</Option>);
      }
    }
  });

  return (
    <>
      <Row gutter={24} style={{ width: '100%' }}>
        <Col span={6}>
          <Select
            showSearch
            size="large"
            style={{ width: '100%' }}
            placeholder="应用"
            optionFilterProp="children"
            onChange={appChange}
            value={app_name}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {dataSource}
          </Select>
        </Col>
        <Col span={3}>
          <Select
            showSearch
            size="large"
            style={{ width: '100%' }}
            placeholder="环境"
            optionFilterProp="children"
            onChange={setEnvAction}
            value={env}
            disabled={disable}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {envOpt}
          </Select>
        </Col>
        <Col>
          {/* <div className={styles.cube}>HTTP: {http_port}</div>
          <div className={styles.cube}>gRPC: {rpc_port}</div>
          <div className={styles.cube}>Govern: {govern_port}</div> */}
          <div className={styles.cube}>
            <a type="primary" onClick={showDrawer}>
              <SearchOutlined />
              详情
            </a>
          </div>
        </Col>
      </Row>
      <Row>
        <Drawer
          title="应用详情"
          placement="top"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <Descriptions size="small" column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label="应用">{name}</Descriptions.Item>
            <Descriptions.Item label="HTTP">{http_port}</Descriptions.Item>
            <Descriptions.Item label="gRPC">{rpc_port}</Descriptions.Item>
            <Descriptions.Item label="Govern">{govern_port}</Descriptions.Item>
            <Descriptions.Item label="项目域">{biz_domain}</Descriptions.Item>
            <Descriptions.Item label="项目">
              <Tooltip title={name}>
                <span>{app_name}</span>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="负责人" span={2}>
              <span>{userInfo}</span>
            </Descriptions.Item>
          </Descriptions>
        </Drawer>
      </Row>
    </>
  );
}
