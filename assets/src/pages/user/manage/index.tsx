import React, { FC, useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
} from 'antd';

import { findDOMNode } from 'react-dom';
import { connect, Dispatch } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import { StateType } from './model';
import { BasicListItemDataType } from './data.d';
import styles from './style.less';
import Item from 'antd/lib/list/Item';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

interface ManageProps {
  userAndmanage: StateType;
  dispatch: Dispatch<any>;
  loading: boolean;
}

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({ data: { access, update_time } }: { data: BasicListItemDataType }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>角色</span>
      <p>{access}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>更新时间</span>
      <p>{moment(update_time * 1000).format('YYYY-MM-DD HH:mm')}</p>
    </div>
  </div>
);

export const Manage: FC<ManageProps> = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    userAndmanage: { list, total },
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<BasicListItemDataType> | undefined>(undefined);

  useEffect(() => {
    dispatch({
      type: 'userAndmanage/fetch',
      payload: {},
    });
  }, [1]);

  const onChange = (pageNumber: any) => {
    dispatch({
      type: 'userAndmanage/fetch',
      payload: {
        currentPage: pageNumber,
      },
    });
  };

  const paginationProps = {
    showQuickJumper: true,
    pageSize: 5,
    total: total,
    onChange: onChange,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: BasicListItemDataType) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (uid: number) => {
    console.log('uid', uid);
    dispatch({
      type: 'userAndmanage/submit',
      payload: { uid: uid },
    });
  };

  const editAndDelete = (key: string, currentItem: BasicListItemDataType) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除任务',
        content: '确定删除该用户吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.uid),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="user">用户</RadioButton>
        <RadioButton value="admin">管理员</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
    </div>
  );

  const MoreBtn: React.FC<{
    item: BasicListItemDataType;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();

    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: BasicListItemDataType) => {
    setAddBtnblur();

    setDone(true);
    dispatch({
      type: 'userAndmanage/submit',
      payload: { ...values },
    });
  };

  return (
    <PageHeaderWrapper>
      <div>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="用户列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            // extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              添加
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatarUrl} shape="square" size="large" />}
                    title={<a href="">{item.username}</a>}
                    // description={item.nickname}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <OperationModal
          done={done}
          current={current}
          visible={visible}
          onDone={handleDone}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(
  ({
    userAndmanage,
    loading,
  }: {
    userAndmanage: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    userAndmanage,
    loading: loading.models.userAndmanage,
  }),
)(Manage);
