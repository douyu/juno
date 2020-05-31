import {
  Table, Icon, Input, Button, Checkbox,Modal,Switch
} from 'antd';
import React from 'react'

export default class NormalLoginForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      list:[]
    };
  }

  componentDidMount() {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.submit(values)
      }
    });
  };

  render() {
    const {show,list=[]} = this.props;

    const cols = [{
      key:'app_name',
      dataIndex:'app_name',
      title:'应用名',
    },{
      key:'file_name',
      dataIndex:'file_name',
      title:'配置文件',
    },{
      key:'op',
      dataIndex:'op',
      title:'操作',
      render(t,r){
        const {app_name} = r;
        return <a href={`/together/configserver/${app_name}`} target={'_blank'}>跳转</a>
      }
    }];

    return (
      <Modal
        title="应用列表"
        visible={show}
        maskClosable
        onCancel={this.props.cancel}
        footer={null}
        destroyOnClose
      >
        <Table dataSource={list} columns={cols}/>
      </Modal>
    );
  }
}