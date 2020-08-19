import {Button, Divider, Drawer, Form, Input, message, Popconfirm} from "antd";
import {Select} from "antd/es";
import React, {useEffect, useState} from "react";
import {Store} from "rc-field-form/lib/interface";
import {Pipeline, WorkerZone} from "@/models/testplatform/types";
import {deletePipeline, fetchWorkerZones} from "@/services/testplatform";

interface DrawerEditPipelineProps {
  visible: boolean
  onFinish: (fields: Store) => void
  onCancel: () => void
  pipeline: Pipeline
  onDelete: () => void
}

export default function DrawerEditPipeline(props: DrawerEditPipelineProps) {
  const {env, app_name, zone_code, name, branch, id} = props.pipeline
  const [workerZones, setWorkerZones] = useState<WorkerZone[]>([])
  const [form] = Form.useForm()

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

  }, [])

  useEffect(() => {
    form.setFieldsValue({
      id,
      env,
      name,
      app_name,
      zone_code,
      branch
    })
  }, [props.pipeline])

  return <Drawer
    title={"Pipeline 编辑"}
    visible={props.visible}
    width={600}
    onClose={props.onCancel}
  >
    <Form
      form={form}
      onFinish={props.onFinish}
    >
      <Form.Item hidden name={"id"}/>

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
        <Select disabled>
          {workerZones.map((item, id) => <Select.Option value={item.zone_code}>{item.zone_name}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button onClick={() => form.submit()} type={"primary"}>提交</Button>
      </Form.Item>

    </Form>

    <Divider/>

    <div>
      <h4>Options</h4>
      <Popconfirm
        title={"删除后不可恢复，确认删除？"}
        onConfirm={() => {
          deletePipeline(props.pipeline.id).then(r => {
            if (r.code === 14000) return
            if (r.code !== 0) {
              message.error("删除失败 " + r.msg)
              return
            }

            props.onDelete()
            message.success("删除成功")
          })
        }}
      >
        <Button danger>删除Pipeline</Button>
      </Popconfirm>
    </div>
  </Drawer>
}
