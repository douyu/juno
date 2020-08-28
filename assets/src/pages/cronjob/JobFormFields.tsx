import React, {useEffect, useState} from "react";
import {FormInstance} from "antd/es/form";
import {Button, Col, Divider, Form, Input, InputNumber, Row, Switch} from "antd";
import {Select} from "antd/es";
import MonacoEditor from "react-monaco-editor/lib/editor";
import {connect} from "dva";
import {ConnectState} from "@/models/connect";
import {AppItem} from "@/models/app";
import {Dispatch} from "@@/plugin-dva/connect";
import {EnvZone, ServiceAppEnvZone, ServiceAppNodeList} from "@/services/app";
import {Job} from "@/models/cronjob/types";

interface JobFormProps {
  form: FormInstance
  appList: AppItem[]
  dispatch: Dispatch
  job?: Job
}

function JobFormFields(props: JobFormProps) {
  const {appList, dispatch, form, job} = props
  const [envZoneList, setEnvZoneList] = useState<EnvZone[]>([])
  const [appName, setAppName] = useState<string | undefined>(undefined)
  const [env, setEnv] = useState<string | undefined>(undefined)
  const [zone, setZone] = useState<string | undefined>(undefined)
  const [nodeList, setNodeList] = useState([])

  useEffect(() => {
    dispatch({
      type: 'app/fetch',
      payload: {
        page: 0,
        pageSize: 10000
      }
    })
  }, [])

  const onAppChange = (appName: string) => {
    form.resetFields(['env', 'zone'])
    setAppName(appName)
  }

  useEffect(() => {
    if (job) {
      setAppName(job.app_name)
      setEnv(job.env)
      setZone(job.zone)
    }
  }, [job])

  useEffect(() => {
    appName && ServiceAppEnvZone(appName).then(r => {
      setEnvZoneList(r.data)
    })
  }, [appName])

  useEffect(() => {
    if (appName && env && zone) {
      ServiceAppNodeList({app_name: appName, env: env, zone_code: zone, pageSize: 10000}).then(r => {
        setNodeList(r.data.list)
      })
    }

  }, [appName, env, zone])

  const envs = envZoneList.map(item => item.env)
  const zones = env && envZoneList.find(item => item.env === env)?.zone_list

  return <>
    <Row gutter={10}>
      <Col span={24}>
        <Form.Item
          label={"Job Name"} name={"name"}
          rules={[
            {required: true, message: '请输入Job名称'}
          ]}
        >
          <Input/>
        </Form.Item>
      </Col>

    </Row>

    <Row gutter={10}>
      <Col span={8}>
        <Form.Item
          label={"应用"}
          name={"app_name"}
          rules={[
            {required: true, message: '请选择应用'}
          ]}
        >
          <Select
            showSearch
            onChange={onAppChange}
          >
            {appList.map(item => <Select.Option key={item.app_name} value={item.app_name}>
              {item.app_name}
            </Select.Option>)}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          label={"Env"}
          name={"env"}
          rules={[
            {required: true, message: '请选择环境'}
          ]}
        >
          <Select onSelect={(val: string) => {
            setEnv(val)
            form.resetFields(["zone"])
          }}>
            {envs.map(env => <Select.Option value={env} key={env}>{env}</Select.Option>)}
          </Select>
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          label={"Zone"}
          name={"zone"}
          rules={[
            {required: true, message: '请选择Zone'}
          ]}
        >
          <Select onSelect={(zone: string) => setZone(zone)}>
            {zones && zones?.map((zone: { zone_code: React.ReactText; zone_name: React.ReactNode; }) => <Select.Option key={zone.zone_code}
              value={zone.zone_code}>
              {zone.zone_name}
            </Select.Option>)}
          </Select>
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={10}>
      <Col span={6}>
        <Form.Item label={"Enable"} name={"enable"} valuePropName={"checked"}>
          <Switch/>
        </Form.Item>
      </Col>

      <Col span={6}>
        <Form.Item
          label={"Timeout (s)"}
          name={"timeout"}
          initialValue={3}
        >
          <InputNumber
            width={"100%"}
            min={3}
            max={3600}
          />
        </Form.Item>
      </Col>

      <Col span={6}>
        <Form.Item label={"Retries"} initialValue={0} name={"retry_count"}>
          <InputNumber
            width={"100%"}
            min={0}
            max={10}
          />
        </Form.Item>
      </Col>

      <Col span={6}>
        <Form.Item initialValue={3} label={"Retry Interval (s)"} name={"retry_interval"}>
          <InputNumber
            width={"100%"}
            min={0}
            max={30}
          />
        </Form.Item>
      </Col>

    </Row>

    <Form.Item
      label={"Script"}
      name={"script"}
      valuePropName={"value"}
      rules={[
        {required: true, message: '请输入脚本'}
      ]}
    >
      <MonacoEditor
        language={"shell"}
        width={"100%"}
        height={"400px"}
        theme={"vs-dark"}
        options={{
          automaticLayout: true,
        }}
      />
    </Form.Item>

    <Divider>Timers</Divider>

    <Form.List name={"timers"}>
      {(fields, operation) => {
        return <div>
          {fields.map((field, index) => <Form.Item
            key={field.key}
            label={`Timer ${index}`}
          >
            <Form.Item
              name={[field.name, 'cron']}
              rules={[
                {required: true, message: '请输入Cron'}
              ]}
            >
              <Input placeholder={"Cron. example: 0 * * * * *"}/>
            </Form.Item>

            <Form.Item
              name={[field.name, 'nodes']}
              rules={[
                {required: true, message: '请选择节点'}
              ]}
            >
              <Select placeholder={"nodes"} mode={"multiple"}>
                {nodeList && nodeList.map((node: any, index) => <Select.Option key={index} value={node.host_name}>
                  {node.host_name}
                </Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item noStyle>
              <Button
                onClick={() => operation.remove(index)}
                size={"small"}
              >
                remove timer
              </Button>
            </Form.Item>
          </Form.Item>)}

          <Button onClick={operation.add}>Add Timer</Button>
        </div>
      }}
    </Form.List>

    <Divider/>
  </>;
}

export default connect(
  ({app}: ConnectState) => {
    return {
      appList: app.list,
    }
  }
)(JobFormFields)
