import React, {useEffect} from 'react';
import SettingBlock from "@/pages/manage/SettingBlock";
import {connect} from 'dva';
import {Button, Form, Input, InputNumber, Modal, Popconfirm, Radio, Table} from 'antd';
import {DeleteFilled, EditFilled, FileAddFilled} from '@ant-design/icons';
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

function ModalAddVersion(props) {
  let [form] = Form.useForm();

  let onFinish = (vals) => {
    props.onSubmit && props.onSubmit(vals)
  }

  return <Modal
    title={"新增应用版本相关设置"} {...props} width={600}
    onOk={() => form.submit()}
  >
    <Form form={form} labelCol={{span: 5}} onFinish={onFinish}>

      <Form.Item
        label={"应用版本名称"}
        name={"name"}
        rules={[
          {required: true, message: "请填写版本名称"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: 支持v1.6-v1.7"}
        />
      </Form.Item>

      <Form.Item
        label={"应用版本号"}
        name={"version"}
        rules={[
          {required: true, message: "请填写版本号"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: [v1.0,v1.2]"}
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
                             rules={[
                               {pattern: /^\/grafana\/[a-zA-Z0-9\.\/]{3,}$/, message: "无效的监控面板地址，应该以 /grafana/ 开头"}
                             ]}
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

function ModalEditVersion(props) {
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
    title={"修改应用版本相关配置"} {...props} width={600}
    onOk={() => form.submit()}
  >
    <Form form={form} labelCol={{span: 5}} onFinish={onFinish}>

      <Form.Item
        label={"应用版本名称"}
        name={"name"}
        initialValue={props.fields.name}
        rules={[
          {required: true, message: "请填写版本名称"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: 支持v1.6-v1.7"}
        />
      </Form.Item>

      <Form.Item
        label={"应用版本号"}
        name={"version"}
        initialValue={props.fields.version}
        rules={[
          {required: true, message: "请填写版本号"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: [v1.0,v1.2]"}
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
                             rules={[
                               {pattern: /^\/grafana\/[a-zA-Z0-9\.\/]{3,}$/, message: "无效的监控面板地址，应该以 /grafana/ 开头"}
                             ]}
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

const VersionConfigColumns = [
  {
    dataIndex: 'name',
    title: '版本名称',
    key: 'name'
  },
  {
    dataIndex: 'version',
    title: '版本号',
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
class VersionSetting extends React.Component {

  state = {
    modalAddVersion: false,
    currentEditIndex: 0,
    modalEditVersion: false,
    currentEditFields: {}
  }

  onAddConfig = () => {
    this.setState({
      modalAddVersion: true,
      currentEditFields: {},
    })
  }

  onAddVersion = (fields) => {
    console.log(fields)

    console.log("## onAddVersion this.props.setting", this.props.settings);

    let versionValue = this.props.settings.version || [];
    versionValue = [...versionValue, fields]

    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'version',
        content: JSON.stringify(versionValue)
      }
    }).then(() => {
      this.props.dispatch({
        type: 'setting/loadSettings'
      })
      this.setState({
        modalAddVersion: false
      })
    })
  }

  onDelete = (index) => {
    console.log(index)
    let versionValue = this.props.settings.version || [];
    versionValue.splice(index, 1);
    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'version',
        content: JSON.stringify(versionValue)
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
    let fields = this.props.settings.version[index]
    this.setState({
      currentEditIndex: index,
      modalEditVersion: true,
      currentEditFields: fields
    })
  }

  /**
   * 编辑Version窗口提交时触发
   */
  onUpdateVersion = (fields) => {
    console.log("updateVersion", fields);
    // console.log("## this.props.settings", this.props.settings);
    let index = this.state.currentEditIndex
    let settingValue = this.props.settings.version || []
    if (index >= settingValue.length) {
      message.error("保存出错，请刷新界面重试")
    }

    settingValue[index] = fields;
    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'version',
        content: JSON.stringify(settingValue)
      }
    }).then(r => {
      if (r.code === 0) {
        this.setState({
          modalEditVersion: false
        })
      }
      this.props.dispatch({
        type: 'setting/loadSettings'
      })
    })
  }

  render() {
    const {version} = this.props.settings;
    // const versionConf = version instanceof Array ? version : [];
    // console.log(">> version", version)

    return <SettingBlock title={"应用版本相关设置"}>
      <Table
        pagination={false}
        columns={[
          ...VersionConfigColumns,
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
        dataSource={version}
        footer={() => <div style={{textAlign: 'center'}}>
          <Button onClick={this.onAddConfig}>
            <FileAddFilled/>
            新增
          </Button>
        </div>}
      />

      <ModalAddVersion
        visible={this.state.modalAddVersion}
        onCancel={() => this.setState({modalAddVersion: false})}
        onSubmit={this.onAddVersion}
      />

      <ModalEditVersion
        visible={this.state.modalEditVersion}
        onCancel={() => this.setState({modalEditVersion: false})}
        onSubmit={this.onUpdateVersion}
        fields={this.state.currentEditFields}
      />
    </SettingBlock>
  }
}

export default VersionSetting
