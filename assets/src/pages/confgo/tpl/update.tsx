import {Form, Input, Button, Select, Card, message} from 'antd';
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import React from "react";
import {reqInfo,reqUpdate} from "./service";
import CommonForm from "./form"

export default class Base extends React.Component {
  state = {
    data: null,
  };

  async componentDidMount() {
    const { location: { query: { id } } } = this.props;
    reqInfo({id}).then(res => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }
      this.setState({
        data: res.data,
        id: id,
      });
      return true;
    });

  }
  render() {
    const { data, id } = this.state;
    return (
      <PageHeaderWrapper>
        <Card>
          { data && <CommonForm  initialValues={data} request={reqUpdate} id={id} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}
