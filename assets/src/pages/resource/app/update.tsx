import {Form, Input, Button, Select, Card, message} from 'antd';
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import React from "react";
import {reqInfo,reqUpdate} from "@/pages/resource/app/service";
import CommonForm from "./form"
import {stringify} from "qs";

export default class Base extends React.Component {
  state = {
    data: null,
  };

  async componentDidMount() {
    const { location: { query: { aid } } } = this.props;
    reqInfo({aid}).then(res => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }
      this.setState({
        data: res.data,
        aid: aid,
      });
      return true;
    });

  }

  render() {
    const { data,aid } = this.state;
    return (
      <PageHeaderWrapper>
        <Card>
          { data && <CommonForm  initialValues={data} request={reqUpdate} aid={aid} />}
        </Card>
      </PageHeaderWrapper>
    );
  }
}
