import React, {Dispatch, useEffect, useState} from "react";
import {connect} from "dva";
import {Form, Input, message, Modal, Radio, Select, Switch} from "antd";
import {createResource} from "@/services/config_resource";

export interface ModalCreateResourceInterface {
  onOk?: () => void

  // state
  zoneEnv: {}
  visible: boolean
  tags: []

  // dispatch functions
  showModalCreateResource: (visible: Boolean) => void
  loadZoneEnvTree: () => void
  loadTags: () => void
}

function ModalCreateResource(props: ModalCreateResourceInterface) {
  const {visible, zoneEnv, tags} = props
  const [form] = Form.useForm()
  const [env, setEnv] = useState<string>()

  useEffect(() => {
    if (!visible) {
      return
    }

    props.loadTags()
    props.loadZoneEnvTree()
  }, [visible])

  return <Modal
    width={800}
    visible={props.visible} title={"创建资源"}
    onOk={() => {
      form.submit()
    }}
    onCancel={() => props.showModalCreateResource(false)}
  >

    <Form
      form={form} labelCol={{span: 3}}
      onFinish={(fields) => {
        createResource(fields).then(r => {
          if (r.code !== 0) {
            message.error("创建失败:" + r.msg)
            return
          }

          if (props.onOk) props.onOk()

          message.success("创建成功")
          props.showModalCreateResource(false)
          return
        })
      }}
    >
      <Form.Item
        label={"Env"} name={"env"}
        rules={[
          {required: true, message: '请选择环境'}
        ]}
      >
        <Radio.Group onChange={ev => {
          setEnv(ev.target.value)
          form.resetFields(['zone'])
        }}>
          {Object.keys(zoneEnv).map(env => {
            return <Radio.Button key={env} value={env}>{env}</Radio.Button>
          })}
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label={"Zone"} name={'zone'}
        rules={[
          {required: true, message: '请选择可用区'}
        ]}
      >
        <Select>
          {env && zoneEnv[env].map((item: any) => {
            return <Select.Option key={item.zone_code} value={item.zone_code}>{item.zone_name}</Select.Option>
          })}
        </Select>
      </Form.Item>

      <Form.Item
        label={"Tags"} name={"tags"}
      >
        <Select mode={"tags"}>
          {tags && tags.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item
        label={"Name"} name={"name"}
        rules={[
          {type: "regexp", pattern: /^[a-zA-Z0-9]{5,32}$/, message: "无效的资源名称"},
          {required: true, message: '请输入资源名称'},
        ]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label={"Value"} name={"value"}
        rules={[
          {required: true, message: '请输入资源值'},
        ]}
      >
        <Input.TextArea/>
      </Form.Item>

      <Form.Item label={"全局可见"} name={"is_global"}>
        <Switch/>
      </Form.Item>

      <Form.Item label={"值可见"} name={"visible"} help={"资源值内容是否公开"}>
        <Switch/>
      </Form.Item>

      <Form.Item
        label={"Description"}
        name={"description"}
        rules={[
          {required: true, message: '请填写资源描述'}
        ]}
      >
        <Input.TextArea/>
      </Form.Item>
    </Form>
  </Modal>;
}

const mapStateToProps = ({configResource}: any) => {
  return {
    visible: configResource.modalConfigResourceVisible,
    zoneEnv: configResource.zoneEnv,
    tags: configResource.tags
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    loadZoneEnvTree: () => dispatch({
      type: 'configResource/loadZoneEnvTree',
    }),
    showModalCreateResource: (visible: Boolean) => dispatch({
      type: 'configResource/showModalCreateResource',
      payload: visible
    }),
    loadTags: () => dispatch({
      type: 'configResource/loadTags',
    })
  }
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default connector(ModalCreateResource)
