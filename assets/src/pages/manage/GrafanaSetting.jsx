import React, {useEffect} from 'react';
import SettingBlock from "@/pages/manage/SettingBlock";
import {connect} from 'dva';
import {Button, Form, Input, InputNumber, Modal, Popconfirm, Radio, Table} from 'antd';
import {DeleteFilled, EditFilled, FileAddFilled} from '@ant-design/icons';
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

function ModalAddGrafana(props) {
  let [form] = Form.useForm();

  let onFinish = (vals) => {
    props.onSubmit && props.onSubmit(vals)
  }

  return <Modal
    title={"新增Grafana代理"} {...props} width={600}
    onOk={() => form.submit()}
  >
    <Form form={form} labelCol={{span: 5}} onFinish={onFinish}>

      <Form.Item
        label={"监控版本"}
        name={"version"}
        rules={[
          {required: true, message: "请填写版本名称"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: 监控1.0"}
        />
      </Form.Item>

      <Form.Item
        label={"Grafana地址"}
        name={"host"}
        rules={[
          {required: true, message: "请填写Grafana地址"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: http://1.2.3.4:3000"}
        />
      </Form.Item>
      <Form.Item
        label={"Header名称"} name={"header_name"}
        rules={[
          {required: true, message: "请填写Header名称"},
        ]}
      >
        <Input
          placeholder={"用于Grafana授权的Header名称，可在Grafana配置文件中查看"}/>
      </Form.Item>

      <Form.List name={"dashboards"}>
        {(fields, {add, remove}) => {
          return (<div>
            <Form.Item label={"Dashboard配置"}>
              {fields.map((field, index) => {
                return <div
                  style={{
                    marginBottom: '10px',
                    display: 'grid',
                    gridTemplateColumns: '150px auto 50px',
                    gridColumnGap: '10px'
                  }}
                  key={field.key}
                >
                  <Form.Item {...field} name={[field.name, 'name']} key={[field.fieldKey, 'name']} noStyle>
                    <Input placeholder={"Dashboard名称"}/>
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'value']} key={[field.fieldKey, 'value']}
                             noStyle>
                    <Input placeholder={"Dashboard地址"}/>
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
                  <PlusOutlined/> 新增Dashboard配置
                </Button>
              </div>
            </Form.Item>
          </div>)
        }}
      </Form.List>
    </Form>
  </Modal>
}

function ModalEditGrafana(props) {
  let [form] = Form.useForm();

  let onFinish = (vals) => {
    props.onSubmit && props.onSubmit(vals)
  }

  useEffect(() => {
    props.visible && form.setFieldsValue({
      ...props.fields,
      dashboards: props.fields.dashboards || []
    })
  }, [props.visible])


  return <Modal
    title={"修改Grafana设置"} {...props} width={600}
    onOk={() => form.submit()}
  >
    <Form form={form} labelCol={{span: 5}} onFinish={onFinish}>

      <Form.Item
        label={"监控版本"}
        name={"version"}
        initialValue={props.fields.version}
        rules={[
          {required: true, message: "请填写版本名称"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: 监控1.0"}
        />
      </Form.Item>

      <Form.Item
        label={"Grafana地址"}
        name={"host"}
        initialValue={props.fields.host}
        rules={[
          {required: true, message: "请填写Grafana地址"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: http://1.2.3.4:3000"}
        />
      </Form.Item>
      <Form.Item
        label={"Header名称"} name={"header_name"} initialValue={props.fields.header_name}
        rules={[
          {required: true, message: "请填写Header名称"},
        ]}
      >
        <Input
          placeholder={"用于Grafana授权的Header名称，可在Grafana配置文件中查看"}/>
      </Form.Item>

      <Form.List
        name={"dashboards"} initialValue={props.fields.dashboards}
      >
        {(fields, {add, remove}) => {
          return (<div>
            <Form.Item label={"Dashboard配置"}>
              {fields.map((field, index) => {
                return <div
                  style={{
                    marginBottom: '10px',
                    display: 'grid',
                    gridTemplateColumns: '150px auto 50px',
                    gridColumnGap: '10px'
                  }}
                  key={field.key}
                >
                  <Form.Item {...field} name={[field.name, 'name']} key={[field.fieldKey, 'name']} noStyle>
                    <Input placeholder={"Dashboard名称"}/>
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'value']} key={[field.fieldKey, 'value']}
                             noStyle>
                    <Input placeholder={"Dashboard地址"}/>
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
                  <PlusOutlined/> Dashboard配置
                </Button>
              </div>
            </Form.Item>
          </div>)
        }}
      </Form.List>
    </Form>
  </Modal>
}

const GrafanaConfigColumns = [
  {
    dataIndex: 'version',
    title: '版本',
    key: 'version'
  },
  {
    dataIndex: 'host',
    title: 'Grafana地址',
    key: 'host'
  },
  {
    dataIndex: 'header_name',
    title: 'Header名称',
    key: 'header_name'
  }
];

@connect(({setting}) => ({
  settings: setting.settings
}))
class GrafanaSetting extends React.Component {

  state = {
    modalAddGrafana: false,
    currentEditIndex: 0,
    modalEditGrafana: false,
    currentEditFields: {}
  }

  onAddConfig = () => {
    this.setState({
      modalAddGrafana: true,
      currentEditFields: {},
    })
  }

  onAddGrafana = (fields) => {
    console.log(fields)

    console.log("## onAddGrafana this.props.setting", this.props.settings);

    let grafanaValue = this.props.settings.grafana || [];
    grafanaValue = [...grafanaValue, fields]

    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'grafana',
        content: JSON.stringify(grafanaValue)
      }
    }).then(() => {
      this.props.dispatch({
        type: 'setting/loadSettings'
      })
      this.setState({
        modalAddGrafana: false
      })
    })
  }

  onDelete = (index) => {
    console.log(index)
    let grafanaValue = this.props.settings.grafana || [];
    grafanaValue.splice(index, 1);
    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'grafana',
        content: JSON.stringify(grafanaValue)
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
    let fields = this.props.settings.grafana[index]
    this.setState({
      currentEditIndex: index,
      modalEditGrafana: true,
      currentEditFields: fields
    })
  }

  /**
   * 编辑Grafana窗口提交时触发
   */
  onUpdateGrafana = (fields) => {
    console.log("updateGrafana", fields);
    // console.log("## this.props.settings", this.props.settings);
    let index = this.state.currentEditIndex
    let settingValue = this.props.settings.grafana || []
    if (index >= settingValue.length) {
      message.error("保存出错，请刷新界面重试")
    }

    settingValue[index] = fields;
    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'grafana',
        content: JSON.stringify(settingValue)
      }
    }).then(r => {
      if (r.code === 0) {
        this.setState({
          modalEditGrafana: false
        })
      }
      this.props.dispatch({
        type: 'setting/loadSettings'
      })
    })
  }

  render() {
    const {grafana} = this.props.settings;
    // const grafanaConf = grafana instanceof Array ? grafana : [];
    // console.log(">> grafana", grafana)

    return <SettingBlock title={"Grafana设置"}>
      <Table
        pagination={false}
        columns={[
          ...GrafanaConfigColumns,
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
        dataSource={grafana}
        footer={() => <div style={{textAlign: 'center'}}>
          <Button onClick={this.onAddConfig}>
            <FileAddFilled/>
            新增
          </Button>
        </div>}
      />

      <ModalAddGrafana
        visible={this.state.modalAddGrafana}
        onCancel={() => this.setState({modalAddGrafana: false})}
        onSubmit={this.onAddGrafana}
      />

      <ModalEditGrafana
        visible={this.state.modalEditGrafana}
        onCancel={() => this.setState({modalEditGrafana: false})}
        onSubmit={this.onUpdateGrafana}
        fields={this.state.currentEditFields}
      />
    </SettingBlock>
  }
}

export default GrafanaSetting
