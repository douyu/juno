import React, {useEffect} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {User} from "@/models/user_group";
import {Dispatch} from "@@/plugin-dva/connect";
import {ConnectState, Pagination} from "@/models/connect";
import {CurrentUser} from '@/models/user'
import {Button, Card, Space, Table, Tag} from "antd";
import {connect} from "umi";
import UserFilter from "@/pages/permission/components/UserFilter";
import ModalChangeUserGroup from "@/pages/permission/components/ModalChangeUserGroup";

interface UserGroupProps {
  users: User[]
  dispatch: Dispatch,
  pagination: Pagination
  usersLoading: boolean
  searchText: string
  currentUser: CurrentUser
}

function UserGroup(props: UserGroupProps) {
  const {
    dispatch,
    users,
    pagination,
    usersLoading,
    searchText,
    currentUser
  } = props

  const userListColumns = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid'
    },
    {
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Nick Name',
      dataIndex: 'nick_name',
      key: 'nick_name',
    },
    {
      title: 'Group',
      dataIndex: 'groups',
      key: 'groups',
      render: (val: string[], row: any) => {
        return (val || []).map(item => <Tag>{item}</Tag>)
      }
    },
    {
      title: 'Operation',
      render: (_: any, row: any) => {
        if (row.uid === currentUser.uid) {
          return `当前用户`
        }

        return <Button.Group size={"small"}>
          <Button onClick={() => {
            dispatch({
              type: 'userGroup/showModalChangeUserGroup',
              payload: {
                user: row,
                visible: true
              }
            })
          }} type={"link"}>修改用户组</Button>
        </Button.Group>
      }
    }
  ]

  const fetchUserList = (payload: any) => {
    dispatch({
      type: 'userGroup/fetchUserList',
      payload: payload
    })
  }

  useEffect(() => {
    fetchUserList({
      page: 0
    })
  }, [])

  return <PageHeaderWrapper>
    <Card>
      <Space direction={"vertical"} style={{width: '100%'}}>
        <UserFilter/>

        <Table
          dataSource={users}
          columns={userListColumns}
          pagination={{
            ...pagination,
            current: pagination.current + 1
          }}
          loading={usersLoading}
          onChange={(pagination) => {
            fetchUserList({
              page: (pagination.current || 1) - 1,
              pageSize: pagination.pageSize,
              search: searchText
            })
          }}
        />
      </Space>
    </Card>

    <ModalChangeUserGroup/>
  </PageHeaderWrapper>
}

const mapStateToProps = ({userGroup, user}: ConnectState) => {
  return {
    users: userGroup.users,
    pagination: userGroup.usersPagination,
    usersLoading: userGroup.usersLoading,
    searchText: userGroup.userSearchText,
    userGroups: userGroup.userGroups,
    currentUser: user.currentUser,
  }
}

export default connect(mapStateToProps)(UserGroup)

