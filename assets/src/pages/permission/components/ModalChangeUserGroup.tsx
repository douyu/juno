import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import { Dispatch, User, UserGroupItem } from '@@/plugin-dva/connect';
import { connect } from 'dva';
import { ConnectState, Pagination } from '@/models/connect';
import { changeUserGroup } from '@/services/permission';

interface ModalChangeUserGroupProps {
  visible: boolean;
  dispatch: Dispatch;
  currentEditUser?: User;
  userGroups: UserGroupItem[];
  usersPagination: Pagination;
  usersSearchText: string;
}

const ModalChangeUserGroup = (props: ModalChangeUserGroupProps) => {
  const { visible, dispatch, currentEditUser, usersPagination, userGroups, usersSearchText } =
    props;
  const [form] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = (visible: boolean) => {
    dispatch({
      type: 'userGroup/showModalChangeUserGroup',
      payload: {
        visible: visible,
      },
    });
  };

  useEffect(() => {
    if (!visible) return;

    dispatch({
      type: 'userGroup/fetch',
    });

    form.setFieldsValue({
      groups: currentEditUser?.groups,
    });
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={'修改用户组'}
      confirmLoading={confirmLoading}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => showModal(false)}
    >
      <Form
        form={form}
        onFinish={(fields) => {
          setConfirmLoading(true);
          changeUserGroup(currentEditUser?.uid || 0, fields.groups).then((res) => {
            setConfirmLoading(false);

            if (res.code !== 0) {
              message.error('保存失败');
              return;
            }

            showModal(false);

            message.success('修改成功');
            dispatch({
              type: 'userGroup/fetchUserList',
              payload: {
                page: usersPagination.current,
                pageSize: usersPagination.pageSize,
                search: usersSearchText,
              },
            });
          });
        }}
      >
        <Form.Item label={'用户名'}>
          <Input disabled={true} value={currentEditUser?.nick_name} />
        </Form.Item>
        <Form.Item label={'用户组'} name={'groups'} initialValue={currentEditUser?.groups}>
          <Select mode={'tags'}>
            {userGroups.map((item) => {
              return <Select.Option value={item.name}>{item.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = ({ userGroup }: ConnectState) => {
  return {
    visible: userGroup.visibleModalChangeUserGroup,
    currentEditUser: userGroup.currentEditUser,
    userGroups: userGroup.userGroups,
    usersPagination: userGroup.usersPagination,
    usersSearchText: userGroup.userSearchText,
  };
};

export default connect(mapStateToProps)(ModalChangeUserGroup);
