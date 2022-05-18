import React, { useEffect, useState } from 'react';
import SettingBlock, { useSettingBlock } from '@/pages/manage/SettingBlock';
import { AutoComplete, Tag, Button, Form, Input, Modal, Popconfirm, Select, Table } from 'antd';
import { DeleteFilled, EditFilled, FileAddFilled } from '@ant-design/icons';
import { useBoolean, useRequest } from 'ahooks';
import { connect } from 'dva';
import { zoneEnvTree } from '@/services/zone';

function ClusterForm(props) {
  const { form, onOk } = props;
  const { data: zoneEnvResp, loading: zoneEnvLoading } = useRequest(zoneEnvTree);
  const zoneCodes = {};
  const envs = [];
  zoneEnvResp &&
    Object.keys(zoneEnvResp.data).forEach((env) => {
      envs.push(env);

      zoneEnvResp.data[env].forEach((zone) => {
        zoneCodes[zone.zone_code] = zone.zone_name;
      });
    });

  return (
    <Form form={form} onFinish={onOk}>
      <Form.Item label={'名称'} name={'name'}>
        <Input />
      </Form.Item>

      <Form.Item label={'Env'} name={'env'}>
        <Select mode={'tags'} loading={zoneEnvLoading}>
          {envs.map((env) => (
            <Select.Option value={env}>{env}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={'Zone Code'} name={'zone_code'}>
        <AutoComplete>
          {Object.keys(zoneCodes).map((code) => {
            return (
              <AutoComplete.Option value={code}>
                <span>{zoneCodes[code]}</span>
                <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>[{code}]</span>
              </AutoComplete.Option>
            );
          })}
        </AutoComplete>
      </Form.Item>

      <Form.Item label={'Zone Name'} name={'zone_name'}>
        <Input />
      </Form.Item>

      <Form.Item label={'domain'} name={'domain'}>
        <Input />
      </Form.Item>

      <Form.Item label={'token'} name={'token'}>
        <Input />
      </Form.Item>
    </Form>
  );
}

function ModalCreateCluster(props) {
  const { visible, onCancel, onOk } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Modal onCancel={onCancel} title={'新增集群'} visible={visible} onOk={form.submit}>
      <ClusterForm form={form} onOk={onOk} />
    </Modal>
  );
}

function ModalEditCluster(props) {
  const { visible, onCancel, cluster, index, onOk } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...(cluster || {}),
    });

    return () => {
      form.resetFields();
    };
  }, [cluster]);

  return (
    <Modal title={'新增集群'} visible={visible} onCancel={onCancel} onOk={form.submit}>
      <ClusterForm form={form} onOk={onOk} />
    </Modal>
  );
}

function K8SClusterSetting(props) {
  const k8sCluster = props.settings.k8s_cluster || { list: [] };

  const [visibleModalCreateCluster, visibleModalCreateClusterAct] = useBoolean(false);
  const [visibleModalEditCluster, visibleModalEditClusterAct] = useBoolean(false);
  const [currentEdit, setCurrentEdit] = useState(-1);
  const [saveField] = useSettingBlock('k8s_cluster', props.dispatch);

  const onEdit = (index) => {
    setCurrentEdit(index);
    visibleModalEditClusterAct.setTrue();
  };

  const onDelete = (index) => {
    let payload = k8sCluster;
    payload.list.splice(index, 1);
    save(payload);
  };

  const save = (payload) => {
    return new Promise(async (resolve) => {
      const res = await saveField(payload);

      props.dispatch({
        type: 'setting/loadSettings',
      });

      resolve(res);
    });
  };

  const onCreate = (fields) => {
    let payload = {
      ...k8sCluster,
      list: k8sCluster.list || [],
    };

    payload.list.push(fields);
    save(payload).then((r) => {
      visibleModalCreateClusterAct.setFalse();
    });
  };

  const onClickBtnCreate = () => {
    visibleModalCreateClusterAct.setTrue();
  };

  const onUpdate = (fields) => {
    let payload = k8sCluster;
    payload.list[currentEdit] = fields;
    save(payload).then((r) => {
      visibleModalEditClusterAct.setFalse();
      setCurrentEdit(-1);
    });
  };

  return (
    <SettingBlock title={'K8S集群设置'}>
      <Table
        size={'small'}
        pagination={false}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Zone', dataIndex: 'zone_code' },
          {
            title: 'Env',
            dataIndex: 'env',
            render: (value = []) => value.map((env) => <Tag>{env}</Tag>),
          },
          {
            title: '操作',
            render: (_, record, index) => {
              return (
                <>
                  <Popconfirm title={'确定删除吗?'} onConfirm={() => onDelete(index)}>
                    <Button shape={'circle'}>
                      <DeleteFilled />
                    </Button>
                  </Popconfirm>
                  <Button
                    shape={'circle'}
                    onClick={() => onEdit(index)}
                    style={{ marginLeft: '10px' }}
                  >
                    <EditFilled />
                  </Button>
                </>
              );
            },
          },
        ]}
        dataSource={k8sCluster?.list || []}
        footer={() => (
          <div style={{ textAlign: 'center' }}>
            <Button onClick={onClickBtnCreate}>
              <FileAddFilled />
              新增
            </Button>
          </div>
        )}
      />

      <ModalCreateCluster
        visible={visibleModalCreateCluster}
        onCancel={visibleModalCreateClusterAct.setFalse}
        onOk={onCreate}
      />

      <ModalEditCluster
        visible={visibleModalEditCluster}
        onCancel={() => {
          visibleModalEditClusterAct.setFalse();
          setCurrentEdit(-1);
        }}
        index={currentEdit}
        cluster={currentEdit > -1 ? k8sCluster.list[currentEdit] : null}
        onOk={onUpdate}
      />
    </SettingBlock>
  );
}

export default connect(({ setting }) => {
  return {
    settings: setting.settings,
  };
})(K8SClusterSetting);
