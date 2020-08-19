import React, {useEffect, useState} from "react";
import {Form, Input, message, Modal, Switch} from "antd";
import {Select} from "antd/es";
import {Store} from "rc-field-form/lib/interface"
import {fetchWorkerZones} from "@/services/testplatform";
import {WorkerZone} from "@/models/testplatform/types";
import {fetchCollections} from "@/services/httptest";

interface ModalCreatePipelineProps {
  visible: boolean
  onFinish: (fields: Store) => void
  onCancel: () => void
  env: string
  zoneCode: string
  appName: string
}

export default function ModalCreatePipeline(props: ModalCreatePipelineProps) {
  const {visible, env, zoneCode, appName} = props
  const [form] = Form.useForm()
  const [workerZones, setWorkerZones] = useState<WorkerZone[]>([])
  const [httpCollections, setHttpCollections] = useState<{ id: number, name: string, test_cases: any[] }[]>([])

  useEffect(() => {
    fetchWorkerZones().then(r => {
      if (r.code === 14000) return
      if (r.code !== 0) {
        message.error("加载 Worker 节点失败 " + r.msg)
        return
      }

      setWorkerZones(r.data)
    })
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      env: env,
      zone_code: zoneCode === 'all' ? null : zoneCode,
      app_name: appName,
      unit_test: true,
      code_check: true
    })

    fetchCollections(appName).then(r => {
      if (r.code === 14000) return
      if (r.code !== 0) {
        message.error(r.msg)
        return
      }

      setHttpCollections(r.data.list || [])
    })
  }, [env, zoneCode, appName])

  return <Modal
    title={"创建 Pipeline"}
    visible={visible}
    onOk={() => form.submit()}
    onCancel={props.onCancel}
  >
    <Form
      form={form}
      onFinish={props.onFinish}
    >
      <Form.Item label={"Env"} name={"env"}>
        <Input disabled/>
      </Form.Item>

      <Form.Item label={"App"} name={"app_name"}>
        <Input disabled/>
      </Form.Item>

      <Form.Item
        label={"名称"}
        name={"name"}
        rules={[
          {required: true, message: "请输入 Pipeline 名称"},
          {pattern: /^[a-zA-Z0-9_-]{4,32}$/, message: 'Pipeline名称只能为 a-zA-Z0-9_- 组合，长度为 4 - 32 位'}
        ]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label={"代码分支"}
        name={"branch"}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        label={"机房"} name={"zone_code"}
        rules={[
          {required: true, message: "请选择机房"}
        ]}
      >
        <Select disabled={zoneCode !== 'all'}>
          {workerZones.map((item, id) => <Select.Option value={item.zone_code}>{item.zone_name}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item label={"Http测试集合(可选)"} name={"http_test_collection"}>
        <Select allowClear>
          {httpCollections.map((item, idx) => <Select.Option value={item.id} key={idx}>
            {item.name}({item.test_cases.length}个用例)
          </Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item label={"单元测试"} name={"unit_test"} valuePropName={"checked"}>
        <Switch/>
      </Form.Item>

      <Form.Item label={"静态检查"} name={"code_check"} valuePropName={"checked"}>
        <Switch/>
      </Form.Item>
    </Form>
  </Modal>
}
