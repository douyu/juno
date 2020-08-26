import React, {useEffect, useState} from "react";
import {AutoComplete, Button, Cascader, Col, Form, Input, message, Modal, Row, Space, Switch, Tag} from "antd";
import {Select} from "antd/es";
import {Store} from "rc-field-form/lib/interface"
import {fetchWorkerZones} from "@/services/testplatform";
import {WorkerZone} from "@/models/testplatform/types";
import {fetchCollections} from "@/services/httptest";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {fetchServiceMethodTree} from "@/services/grpctest";
import {grpcAddrList} from "@/services/app";

interface ModalCreatePipelineProps {
  visible: boolean
  onFinish: (fields: Store) => void
  onCancel: () => void
  env: string
  zoneCode: string
  appName: string
}

interface GrpcAddr {
  port: string,
  hosts: {
    env: string
    addr: string
  }[]
}

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 4},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 20},
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {span: 24, offset: 0},
    sm: {span: 20, offset: 4},
  },
};


export default function ModalCreatePipeline(props: ModalCreatePipelineProps) {
  const {visible, env, zoneCode, appName} = props
  const [form] = Form.useForm()
  const [workerZones, setWorkerZones] = useState<WorkerZone[]>([])
  const [httpCollections, setHttpCollections] = useState<{ id: number, name: string, test_cases: any[] }[]>([])
  const [grpcTestFlag, setGrpcTestFlag] = useState(false)
  const [services, setServices] = useState([])
  const [testCases, setTestCases] = useState({}) // service -> test cases
  const [grpcAddr, setGrpcAddr] = useState<GrpcAddr | null>(null)

  useEffect(() => {
    if (visible) {
      grpcAddrList({app_name: appName}).then(r => {
        setGrpcAddr(r.data)
      })

      fetchServiceMethodTree(appName).then(r => {
        if (r.code === 14000) return
        if (r.code !== 0) {
          message.error(r.msg)
          return
        }

        setServices(r.data)
      })
    }
  }, [visible])

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

  const testCaseCascadeOptions = services.map((item: any, index: number) => {
    return {
      value: item.id,
      label: item.name,
      children: item.methods?.map((method: any) => ({
        value: method.id,
        label: method.name,
        children: method.use_cases?.map((useCase: any) => ({
          value: useCase.id,
          label: useCase.name
        })) || []
      }))
    }
  })

  return <Modal
    title={"创建 Pipeline"}
    visible={visible}
    onOk={() => form.submit()}
    onCancel={props.onCancel}
    width={grpcTestFlag ? "900px" : "500px"}
  >
    <Form
      form={form}
      onFinish={props.onFinish}
    >

      <Row gutter={15}>

        <Col span={grpcTestFlag ? 10 : 24}>
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
            rules={[
              {required: true, message: '请输入代码分支'}
            ]}
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
              {workerZones.map((item, id) => <Select.Option key={id}
                                                            value={item.zone_code}>{item.zone_name}</Select.Option>)}
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

          <Form.Item label={"GRPC接口测试"}>
            <Switch onChange={val => {
              setGrpcTestFlag(val)
              form.setFieldsValue({
                grpc_test_cases: val ? [{}] : []
              })
            }}/>
          </Form.Item>
        </Col>

        {/*GRPC 测试用例*/}
        {grpcTestFlag && <Col span={14}>
          <Form.Item label={"GRPC服务地址"} name={"grpc_test_addr"}>
            <AutoComplete placeholder={"1.2.3.4:1234"}>
              {grpcAddr && grpcAddr.hosts?.map((item, idx) => <AutoComplete.Option
                value={item.addr + ':' + grpcAddr.port}>
                <Tag>{item.env}</Tag> {item.addr} : {grpcAddr.port}
              </AutoComplete.Option>)}
            </AutoComplete>
          </Form.Item>
          <Form.List name={"grpc_test_cases"}>
            {(fields, {add, remove}) => {
              return <div>
                {fields.map((field, index) => {
                  return <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? 'GRPC用例' : ''}
                    key={field.key}
                  >
                    <Space>
                      <Form.Item
                        noStyle name={[field.name, "testcase"]}
                        rules={[
                          {required: true, message: '请选择用例'}
                        ]}
                      >
                        <Cascader options={testCaseCascadeOptions} style={{width: '400px'}}/>
                      </Form.Item>

                      <Form.Item noStyle>
                        {index > 0 && <MinusCircleOutlined
                          onClick={() => {
                            setTestCases({
                              ...testCases,
                              [field.name]: undefined
                            })
                            remove(field.name);
                          }}
                        />}
                      </Form.Item>
                    </Space>
                  </Form.Item>
                })}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined/> 新增用例
                  </Button>
                </Form.Item>
              </div>
            }}
          </Form.List>
        </Col>}

      </Row>

    </Form>
  </Modal>
}
