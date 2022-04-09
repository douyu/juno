import {
  AutoComplete,
  Button,
  Cascader,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Switch,
  Tag,
} from 'antd';
import { Select } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { Store } from 'rc-field-form/lib/interface';
import { Pipeline, WorkerZone } from '@/models/testplatform/types';
import { deletePipeline, fetchWorkerZones } from '@/services/testplatform';
import { fetchCollections } from '@/services/httptest';
import { fetchServiceMethodTree } from '@/services/grpctest';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons/lib';
import { grpcAddrList } from '@/services/app';

interface DrawerEditPipelineProps {
  visible: boolean;
  onFinish: (fields: Store) => void;
  onCancel: () => void;
  pipeline: Pipeline;
  onDelete: () => void;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

interface GrpcAddr {
  port: string;
  hosts: {
    env: string;
    addr: string;
  }[];
}

export default function DrawerEditPipeline(props: DrawerEditPipelineProps) {
  const { visible } = props;
  const { env, app_name, zone_code } = props.pipeline;
  const [workerZones, setWorkerZones] = useState<WorkerZone[]>([]);
  const [form] = Form.useForm();
  const [httpCollections, setHttpCollections] = useState<
    { id: number; name: string; test_cases: any[] }[]
  >([]);
  const [grpcTestFlag, setGrpcTestFlag] = useState(false);
  const [services, setServices] = useState([]);
  const [testCases, setTestCases] = useState({}); // service -> test cases
  const [grpcAddr, setGrpcAddr] = useState<GrpcAddr | null>(null);

  useEffect(() => {
    fetchWorkerZones().then((r) => {
      if (r.code === 14000) return;
      if (r.code !== 0) {
        message.error('加载 Worker 节点失败 ' + r.msg);
        return;
      }

      setWorkerZones(r.data);
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      env: env,
      zone_code: zone_code,
      app_name: app_name,
      unit_test: true,
      code_check: true,
    });

    app_name &&
      fetchCollections(app_name).then((r) => {
        if (r.code === 14000) return;
        if (r.code !== 0) {
          message.error(r.msg);
          return;
        }

        setHttpCollections(r.data.list || []);
      });
  }, [env, app_name, zone_code]);

  useEffect(() => {
    if (visible) {
      fetchServiceMethodTree(app_name).then((r) => {
        if (r.code === 14000) return;
        if (r.code !== 0) {
          message.error(r.msg);
          return;
        }

        setServices(r.data);
      });

      grpcAddrList({ app_name }).then((r) => {
        setGrpcAddr(r.data);
      });

      setGrpcTestFlag(props.pipeline.grpc_test_cases?.length > 0);
    }
  }, [app_name, visible]);

  useEffect(() => {
    form.setFieldsValue({
      ...props.pipeline,
      grpc_test_cases: props.pipeline.grpc_test_cases.map((item) => ({
        testcase: [item.service, item.method, item.testcase],
      })),
    });
  }, [props.pipeline]);

  const testCaseCascadeOptions = services.map((item: any, index: number) => {
    return {
      value: item.id,
      label: item.name,
      children: item.methods?.map((method: any) => ({
        value: method.id,
        label: method.name,
        children:
          method.use_cases?.map((useCase: any) => ({
            value: useCase.id,
            label: useCase.name,
          })) || [],
      })),
    };
  });

  return (
    <Drawer title={'Pipeline 编辑'} visible={props.visible} width={600} onClose={props.onCancel}>
      <Form form={form} onFinish={props.onFinish} labelAlign={'left'}>
        <Form.Item hidden name={'id'}>
          <input type={'hidden'} />
        </Form.Item>

        <Form.Item label={'Env'} name={'env'}>
          <Input disabled />
        </Form.Item>

        <Form.Item label={'App'} name={'app_name'}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={'名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入 Pipeline 名称' },
            {
              pattern: /^[a-zA-Z0-9_-]{4,32}$/,
              message: 'Pipeline名称只能为 a-zA-Z0-9_- 组合，长度为 4 - 32 位',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={'代码分支'}
          name={'branch'}
          rules={[{ required: true, message: '请输入代码分支' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={'机房'}
          name={'zone_code'}
          rules={[{ required: true, message: '请选择机房' }]}
        >
          <Select>
            {workerZones.map((item, id) => (
              <Select.Option key={id} value={item.zone_code}>
                {item.zone_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={'Http测试集合(可选)'} name={'http_test_collection'}>
          <Select allowClear>
            {httpCollections.map((item, idx) => (
              <Select.Option value={item.id} key={idx}>
                {item.name}({item.test_cases.length}个用例)
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={'单元测试'} name={'unit_test'} valuePropName={'checked'}>
          <Switch />
        </Form.Item>

        <Form.Item label={'静态检查'} name={'code_check'} valuePropName={'checked'}>
          <Switch />
        </Form.Item>

        <Form.Item label={'GRPC接口测试'}>
          <Switch
            checked={grpcTestFlag}
            onChange={(val) => {
              setGrpcTestFlag(val);
              form.setFieldsValue({
                grpc_test_cases: val ? [{}] : [],
              });
            }}
          />
        </Form.Item>

        {grpcTestFlag && (
          <Form.Item label={'GRPC服务地址'} name={'grpc_test_addr'}>
            <AutoComplete placeholder={'1.2.3.4:1234'}>
              {grpcAddr &&
                grpcAddr.hosts?.map((item, idx) => (
                  <AutoComplete.Option value={item.addr + ':' + grpcAddr.port}>
                    <Tag>{item.env}</Tag> {item.addr} : {grpcAddr.port}
                  </AutoComplete.Option>
                ))}
            </AutoComplete>
          </Form.Item>
        )}

        {grpcTestFlag && (
          <Form.List name={'grpc_test_cases'}>
            {(fields, { remove, add }) => {
              return (
                <div>
                  {fields.map((field, index) => {
                    return (
                      <Form.Item
                        key={field.key}
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'GRPC用例' : ''}
                      >
                        <Space>
                          <Form.Item
                            noStyle
                            name={[field.name, 'testcase']}
                            rules={[{ required: true, message: '请选择用例' }]}
                          >
                            <Cascader style={{ width: '400px' }} options={testCaseCascadeOptions} />
                          </Form.Item>

                          <Form.Item noStyle>
                            {index > 0 && (
                              <MinusCircleOutlined
                                onClick={() => {
                                  setTestCases({
                                    ...testCases,
                                    [field.name]: undefined,
                                  });
                                  remove(field.name);
                                }}
                              />
                            )}
                          </Form.Item>
                        </Space>
                      </Form.Item>
                    );
                  })}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined /> 新增用例
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        )}

        <Form.Item>
          <Button onClick={() => form.submit()} type={'primary'}>
            提交
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <div>
        <h4>Options</h4>
        <Popconfirm
          title={'删除后不可恢复，确认删除？'}
          onConfirm={() => {
            deletePipeline(props.pipeline.id).then((r) => {
              if (r.code === 14000) return;
              if (r.code !== 0) {
                message.error('删除失败 ' + r.msg);
                return;
              }

              props.onDelete();
              message.success('删除成功');
            });
          }}
        >
          <Button danger>删除Pipeline</Button>
        </Popconfirm>
      </div>
    </Drawer>
  );
}
