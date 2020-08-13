import React, {useState} from 'react';
import {Button, Col, message, Modal, Row, Table, Transfer} from 'antd';
import {ServiceAppNodeTransferList, ServiceAppNodeTransferPut,} from '@/services/app';
import moment from 'moment';
import styles from './style.less';

export interface DetailProps {
  aid: number
  env: string
  appNodeList: any[]
  onEditAppNode: () => void
}

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const Detail = (props: DetailProps) => {
  const {aid, appNodeList} = props;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [nodeArr, setNodeArr] = useState<any[]>([]);
  const [visible, setVisible] = useState(Boolean);
  const [dataQuery, setDataQuery] = useState(true);

  if (dataQuery) {
    setDataQuery(false);
  }

  let initTransfer = () => {
    ServiceAppNodeTransferList({aid}).then((res: any) => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }

      let nodeArr: any[] = [];
      let dataSource: { key: any; title: string }[] = [];
      res.data.source_list.forEach((element: any) => {
        dataSource.push({
          key: element.host_name,
          title: `${element.host_name}(${element.ip})`,
        });

        nodeArr[element.host_name] = element.id;
      });

      setDataSource(dataSource);
      setTargetKeys(res.data.target_list);
      setNodeArr(nodeArr);
      return true;
    });
  };

  let handleOk = () => {
    setVisible(false);
    let target: { host_name: any; id: any }[] = [];
    targetKeys.forEach((element: any) => {
      target.push({
        host_name: element,
        id: nodeArr[element],
      });
    });

    ServiceAppNodeTransferPut({
      target: target,
      aid: aid,
    }).then((res: any) => {
      if (res.code !== 0) {
        message.error(res.msg);
      } else {
        message.success(res.msg);
      }

      props.onEditAppNode()
    });

  };

  let handleCancel = () => {
    setVisible(false);
  };

  let handleChange = (targetKeys: any) => {
    setTargetKeys(targetKeys);
  };

  const columns = [
    {
      title: '节点名称',
      dataIndex: 'host_name',
      key: 'host_name',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '地区',
      key: 'region_code',
      render: (record: any) => (
        <span>
          {record.region_code}({record.region_name})
        </span>
      ),
    },
    {
      title: '可用区',
      key: 'zone_code',
      render: (record: any) => (
        <span>
          {record.zone_code}({record.zone_name})
        </span>
      ),
    },
    {
      title: '环境',
      key: 'env',
      dataIndex: 'env',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      render: (update_time: any) => moment(update_time, 'X').format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  let onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div style={{marginTop: '5px'}}>
      <Row>
        <Col span={23}>
          <div style={{float: 'right'}}>
            <Button
              type="primary"
              className={styles.lay}
              onClick={() => {
                initTransfer();
                setVisible(true);
              }}
            >
              编辑节点
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Table
          className={styles.lay_width_full}
          columns={columns}
          dataSource={appNodeList}
          onChange={onChange}
        />
      </Row>
      <Modal
        title={'选择节点'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <Transfer
          dataSource={dataSource}
          showSearch
          listStyle={{
            width: 450,
            height: 400,
          }}
          titles={['未关联', '已关联']}
          targetKeys={targetKeys}
          onChange={handleChange}
          render={(item) => `${item.title}`}
        />
      </Modal>
    </div>
  );
};

export default Detail;
