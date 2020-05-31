import {Form, Input, Button, Select, Card, message} from 'antd';
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import React from "react";
import {reqCreate} from "@/pages/resource/app/service";
import CommonForm from "./form"

export default class Base extends React.Component {
  render() {
    return (
      <PageHeaderWrapper>
        <Card>
          <CommonForm request={reqCreate} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
