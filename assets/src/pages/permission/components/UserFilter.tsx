import React from "react";
import {Col, Input, Row} from "antd";
import {connect} from "umi";
import {ConnectState} from "@/models/connect";
import {Dispatch} from "@@/plugin-dva/connect";

export interface UserFilterProps {
  dispatch: Dispatch
}

const UserFilter = (props: UserFilterProps) => {
  return <Row style={{textAlign: 'right'}}>
    <Col offset={20} span={4}>
      <Input.Search onSearch={(val) => {
        props.dispatch({
          type: 'userGroup/fetchUserList',
          payload: {
            search: val
          }
        })
      }}/>
    </Col>
  </Row>
}

const mapStateToProps = ({userGroup}: ConnectState) => {
  return {
    loading: userGroup.usersLoading
  }
}

export default connect(mapStateToProps)(UserFilter)
