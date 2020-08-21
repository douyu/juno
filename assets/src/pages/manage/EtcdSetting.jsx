import React, {useEffect} from 'react';
import SettingBlock from "@/pages/manage/SettingBlock";
import {connect} from 'dva';
import {Button, Form, Input, InputNumber, Modal, Popconfirm, Radio, Table} from 'antd';
import {DeleteFilled, EditFilled, FileAddFilled} from '@ant-design/icons';
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";

function ModalAddEtcd(props) {
  let [form] = Form.useForm();

  let onFinish = (vals) => {
    props.onSubmit && props.onSubmit(vals)
  }

  return <Modal
    title={"新增Etcd查询前缀配置"} {...props} width={600}
    onOk={() => form.submit()}
  >
    <Form form={form} labelCol={{span: 5}} onFinish={onFinish}>

      <Form.Item
        label={"查询前缀"}
        name={"prefix"}
        rules={[
          {required: true, message: "请填写查询前缀"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: /prometheus/job/"}
        />
      </Form.Item>

      <Form.Item
        label={"备注信息"}
        name={"info"}
        rules={[
          {required: false, message: "请填写备注信息"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: 监控key查询"}
        />
      </Form.Item>
    </Form>
  </Modal>
}

function ModalEditEtcd(props) {
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
    title={"修改Etcd查询前缀配置"} {...props} width={600}
    onOk={() => form.submit()}
  >
    <Form form={form} labelCol={{span: 5}} onFinish={onFinish}>

      <Form.Item
        label={"查询前缀"}
        name={"prefix"}
        initialValue={props.fields.prefix}
        rules={[
          {required: true, message: "请填写查询前缀"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: /prometheus/job/"}
        />
      </Form.Item>

      <Form.Item
        label={"备注信息"}
        name={"info"}
        initialValue={props.fields.info}
        rules={[
          {required: false, message: "请填写备注信息"},
          // {pattern: /^(http|https):\/\/[a-zA-Z0-9\.\-\_:]{3,}$\/[abc]*/, message: "地址不符合规则，示例：http://1.2.3.4:3000"}
        ]}
      >
        <Input
          placeholder={"示例: 监控key查询"}
        />
      </Form.Item>

    </Form>
  </Modal>
}

const EtcdConfigColumns = [
  {
    dataIndex: 'prefix',
    title: '查询前缀',
    key: 'prefix'
  },
  {
    dataIndex: 'info',
    title: '备注',
    key: 'info'
  }
];

@connect(({setting}) => ({
  settings: setting.settings
}))
class EtcdSetting extends React.Component {

  state = {
    modalAddEtcd: false,
    currentEditIndex: 0,
    modalEditEtcd: false,
    currentEditFields: {}
  }

  onAddConfig = () => {
    this.setState({
      modalAddEtcd: true,
      currentEditFields: {},
    })
  }

  onAddEtcd = (fields) => {
    console.log(fields)

    console.log("## onAddEtcd this.props.setting", this.props.settings);

    let etcdValue = this.props.settings.etcd || [];
    etcdValue = [...etcdValue, fields]

    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'etcd',
        content: JSON.stringify(etcdValue)
      }
    }).then(() => {
      this.props.dispatch({
        type: 'setting/loadSettings'
      })
      this.setState({
        modalAddEtcd: false
      })
    })
  }

  onDelete = (index) => {
    console.log(index)
    let etcdValue = this.props.settings.etcd || [];
    etcdValue.splice(index, 1);
    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'etcd',
        content: JSON.stringify(etcdValue)
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
    let fields = this.props.settings.etcd[index]
    this.setState({
      currentEditIndex: index,
      modalEditEtcd: true,
      currentEditFields: fields
    })
  }

  /**
   * 编辑Etcd窗口提交时触发
   */
  onUpdateEtcd = (fields) => {
    console.log("updateEtcd", fields);
    // console.log("## this.props.settings", this.props.settings);
    let index = this.state.currentEditIndex
    let settingValue = this.props.settings.etcd || []
    if (index >= settingValue.length) {
      message.error("保存出错，请刷新界面重试")
    }

    settingValue[index] = fields;
    this.props.dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: 'etcd',
        content: JSON.stringify(settingValue)
      }
    }).then(r => {
      if (r.code === 0) {
        this.setState({
          modalEditEtcd: false
        })
      }
      this.props.dispatch({
        type: 'setting/loadSettings'
      })
    })
  }

  render() {
    const {etcd} = this.props.settings;
    // console.log(">> etcd", etcd)

    return <SettingBlock title={"Etcd查询前缀设置"}>
      <Table
        size={"small"}
        pagination={false}
        columns={[
          ...EtcdConfigColumns,
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
        dataSource={etcd}
        footer={() => <div style={{textAlign: 'center'}}>
          <Button onClick={this.onAddConfig}>
            <FileAddFilled/>
            新增
          </Button>
        </div>}
      />

      <ModalAddEtcd
        visible={this.state.modalAddEtcd}
        onCancel={() => this.setState({modalAddEtcd: false})}
        onSubmit={this.onAddEtcd}
      />

      <ModalEditEtcd
        visible={this.state.modalEditEtcd}
        onCancel={() => this.setState({modalEditEtcd: false})}
        onSubmit={this.onUpdateEtcd}
        fields={this.state.currentEditFields}
      />
    </SettingBlock>
  }
}

export default EtcdSetting
