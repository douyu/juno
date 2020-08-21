import React, {useEffect} from 'react';
import SettingBlock from "@/pages/manage/SettingBlock";
import {connect} from 'dva';
import {Button, Form, Input, InputNumber, Modal, Popconfirm, Radio, Table, message} from 'antd';
import {DeleteFilled, EditFilled, FileAddFilled} from '@ant-design/icons';
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

function ModalAddGateway(props) {
  let [form] = Form.useForm();

  let onFinish = (vals) => {
    props.onSubmit && props.onSubmit(vals)
  }

  return <Modal
    title={"新增网关代理"} {...props} width={600}
    onOk={() => form.submit()}
  >
    <Form form={form} labelCol={{span: 5}} onFinish={onFinish}>
      <Form.Item
        label={"名称"} name={"name"}
        rules={[
          {required: true, message: '请输入名称'}
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label={"访问域名"} name={"domain"}
        rules={[
          {required: true, message: '请输入访问域名'}
        ]}
      >
        <Input placeholder={"该域名指向Juno网关"}/>
      </Form.Item>
      <Form.Item
        label={"服务地址"} name={"host"}
        rules={[
          {required: true, message: '请输入服务地址'}
        ]}
      >
        <Input placeholder={"背代理的服务地址，示例: example.com"}/>
      </Form.Item>
      <Form.Item
        label={"服务协议"} name={"scheme"}
        rules={[
          {required: true, message: '请输入服务协议'}
        ]}
      >
        <Radio.Group>
          <Radio.Button value={"http"}>HTTP</Radio.Button>
          <Radio.Button value={"https"}>HTTPS</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label={"服务超时(秒)"} name={"timeout"}
        rules={[
          {required: true, message: '请输入服务超时'}
        ]}
      >
        <InputNumber/>
      </Form.Item>

      <Form.List name={"headers"}>
        {(fields, {add, remove}) => {
          return (<div>
            <Form.Item label={"Headers"}>
              {fields.map((field, index) => {
                return <div
                  style={{
                    marginBottom: '10px',
                    display: 'grid',
                    gridTemplateColumns: '100px auto 50px',
                    gridColumnGap: '10px'
                  }}
                  key={field.key}
                >
                  <Form.Item {...field} name={[field.name, 'name']} key={[field.fieldKey, 'name']} noStyle>
                    <Input placeholder={"Header名称"}/>
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'value']} key={[field.fieldKey, 'value']} noStyle>
                    <Input placeholder={"Header值"}/>
                  </Form.Item>
                  <Button onClick={() => remove(index)}>
                    <DeleteFilled/>
                  </Button>
                </div>

              })}
              <div style={{marginTop: '10px'}}>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                >
                  <PlusOutlined/> 新增Header
                </Button>
              </div>
            </Form.Item>
          </div>)
        }}
      </Form.List>
    </Form>
  </Modal>
}

function ModalEditGateway(props) {
  let [form] = Form.useForm();

  let onFinish = (vals) => {
    props.onSubmit && props.onSubmit(vals)
  }

  useEffect(() => {
    props.visible && form.setFieldsValue({
      ...props.fields,
      headers: props.fields.headers || []
    })
  }, [props.visible])

  return <Modal
    title={"修改网关代理设置"} {...props} width={600}
    onOk={() => form.submit()}
  >
    <Form form={form} labelCol={{span: 5}} onFinish={onFinish}>
      <Form.Item
        label={"名称"} name={"name"}
        rules={[
          {required: true, message: '请输入名称'}
        ]}
        initialValue={props.fields.name}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label={"访问域名"} name={"domain"}
        rules={[
          {required: true, message: '请输入访问域名'}
        ]}
        initialValue={props.fields.domain}
      >
        <Input placeholder={"该域名指向Juno网关"}/>
      </Form.Item>
      <Form.Item
        label={"服务地址"} name={"host"}
        rules={[
          {required: true, message: '请输入服务地址'}
        ]}
        initialValue={props.fields.host}
      >
        <Input placeholder={"背代理的服务地址，示例: example.com"}/>
      </Form.Item>
      <Form.Item
        label={"服务协议"} name={"scheme"}
        rules={[
          {required: true, message: '请输入服务协议'}
        ]}
        initialValue={props.fields.scheme}
      >
        <Radio.Group>
          <Radio.Button value={"http"}>HTTP</Radio.Button>
          <Radio.Button value={"https"}>HTTPS</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label={"服务超时(秒)"} name={"timeout"}
        rules={[
          {required: true, message: '请输入服务超时'}
        ]}
        initialValue={props.fields.timeout}
      >
        <InputNumber/>
      </Form.Item>

      <Form.List
        name={"headers"}
        initialValue={props.fields.headers}
      >
        {(fields, {add, remove}) => {
          return (<div>
            <Form.Item label={"Headers"}>
              {fields.map((field, index) => {
                return <div
                  style={{
                    marginBottom: '10px',
                    display: 'grid',
                    gridTemplateColumns: '100px auto 50px',
                    gridColumnGap: '10px'
                  }}
                  key={field.key}
                >
                  <Form.Item {...field} name={[field.name, 'name']} key={[field.fieldKey, 'name']} noStyle>
                    <Input placeholder={"Header名称"}/>
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'value']} key={[field.fieldKey, 'value']} noStyle>
                    <Input placeholder={"Header值"}/>
                  </Form.Item>
                  <Button onClick={() => remove(index)}>
                    <DeleteFilled/>
                  </Button>
                </div>

              })}
              <div style={{marginTop: '10px'}}>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                >
                  <PlusOutlined/> 新增Header
                </Button>
              </div>
            </Form.Item>
          </div>)
        }}
      </Form.List>
    </Form>
  </Modal>
}

const GatewayConfigColumns = [
  {
    dataIndex: 'name',
    title: '名称',
    key: 'name'
  },
  {
    dataIndex: 'domain',
    title: '访问域名',
    key: 'domain'
  },
  {
    dataIndex: 'host',
    title: '服务地址',
    key: 'host'
  },
  {
    dataIndex: 'scheme',
    title: '服务协议',
    key: 'scheme'
  },
];

@connect(({setting}) => ({
  settings: setting.settings
}))
class GatewaySetting extends React.Component {

  state = {
    modalAddGateway: false,
    currentEditIndex: 0,
    modalEditGateway: false,
    currentEditFields: {}
  }

  onAddConfig = () => {
    this.setState({
      modalAddGateway: true
    })
  }

  onAddGateway = (fields) => {
    console.log(fields)

    let gatewayValue = this.props.settings.gateway || [];
    gatewayValue = [...gatewayValue, fields]

    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'gateway',
        content: JSON.stringify(gatewayValue)
      }
    }).then(() => {
      this.props.dispatch({
        type: 'setting/loadSettings'
      })
      this.setState({
        modalAddGateway: false
      })
    })
  }

  onDelete = (index) => {
    console.log(index)
    let gatewayValue = this.props.settings.gateway || [];
    gatewayValue.splice(index, 1)
    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'gateway',
        content: JSON.stringify(gatewayValue)
      }
    }).then(() => {
      this.props.dispatch({
        type: 'setting/loadSettings'
      })
    })
  }

  /**
   * 点击编辑按钮触发
   * @param index
   */
  onEdit = (index) => {
    let fields = this.props.settings.gateway[index]
    this.setState({
      currentEditIndex: index,
      modalEditGateway: true,
      currentEditFields: fields
    })
  }

  /**
   * 编辑Gateway窗口提交时触发
   */
  onUpdateGateway = (fields) => {
    console.log("updateGateway", fields)
    let index = this.state.currentEditIndex
    let settingValue = this.props.settings.gateway || []
    if (index >= settingValue.length) {
      message.error("保存出错，请刷新界面重试")
      return
    }

    settingValue[index] = fields
    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'gateway',
        content: JSON.stringify(settingValue)
      }
    }).then(r => {
      if (r.code === 0) {
        this.setState({
          modalEditGateway: false
        })
      }
      this.props.dispatch({
        type: 'setting/loadSettings'
      })
    })
  }

  render() {
    const {gateway} = this.props.settings

    return <SettingBlock title={"网关设置"}>
      <Table
        size={"small"}
        pagination={false}
        columns={[
          ...GatewayConfigColumns,
          {
            title: '操作',
            render: (_, record, index) => {
              return <>
                <Popconfirm
                  title={"确定删除吗?"}
                  onConfirm={() => this.onDelete(index)}
                >
                  <Button shape={"circle"}>
                    <DeleteFilled/>
                  </Button>
                </Popconfirm>
                <Button shape={"circle"} onClick={() => this.onEdit(index)} style={{marginLeft: '10px'}}>
                  <EditFilled/>
                </Button>
              </>
            }
          }
        ]}
        dataSource={gateway}
        footer={() => <div style={{textAlign: 'center'}}>
          <Button onClick={this.onAddConfig}>
            <FileAddFilled/>
            新增
          </Button>
        </div>}
      />

      <ModalAddGateway
        visible={this.state.modalAddGateway}
        onCancel={() => this.setState({modalAddGateway: false})}
        onSubmit={this.onAddGateway}
      />

      <ModalEditGateway
        visible={this.state.modalEditGateway}
        onCancel={() => this.setState({modalEditGateway: false})}
        onSubmit={this.onUpdateGateway}
        fields={this.state.currentEditFields}
      />
    </SettingBlock>
  }
}

export default GatewaySetting
