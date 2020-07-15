import React, {useEffect, useState} from 'react'
import {connect} from 'dva'
import {Form, Input, Modal, Radio, Select} from "antd";

function ModalCreate(props) {
  const [form] = Form.useForm()
  const [format, setFormat] = useState('toml')
  const {showCreateModal, loadConfigList, loadConfigDetail} = props

  useEffect(() => {
    form.resetFields()
  }, [])

  const onOK = () => {
    form.submit()
  }

  const onFinish = (fields) => {
    const {appName, env} = props
    const data = {
      ...fields,
      app_name: appName,
      env
    }

    props.createConfig(data).then(r => {
      const {data} = r
      if (r.code === 0) {
        showCreateModal(false)
      }

      // 加载新建的文件
      loadConfigDetail(data.id)

      loadConfigList(appName, env)
    })
  }

  return <Modal
    {...props}
    title={"新增配置"}
    onOk={onOK}
  >
    <Form form={form} labelCol={{span: 4}} onFinish={onFinish}>
      <Form.Item
        label={"Zone"}
        name={"zone"}
        rules={[
          {required: true,}
        ]}
      >
        <Select>
          {props.zoneList.map((item, index) => {
            return <Select.Option value={item.zone_code} key={index}>
              {item.zone_name}
            </Select.Option>
          })}
        </Select>
      </Form.Item>
      <Form.Item
        rules={[
          {required: true,}
        ]}
        label={"格式"}
        initialValue={format}
        name={"format"}
      >
        <Radio.Group onChange={ev => {
          setFormat(ev.target.value)
        }}>
          <Radio.Button key={"toml"} value={"toml"}>toml</Radio.Button>
          <Radio.Button key={"yaml"} value={"yaml"}>yaml</Radio.Button>
          <Radio.Button key={"ini"} value={"ini"}>ini</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label={"文件名"}
        name={"file_name"}
        rules={[
          {required: true,}
        ]}
      >
        <Input
          placeholder={"不带后缀的文件名，示例: config-prod"}
          suffix={'.' + format}
        />
      </Form.Item>
    </Form>
  </Modal>
}

const mapStateToProps = ({config}) => {
  return {
    zoneList: config.zoneList,
    aid: config.aid,
    env: config.env,
    appName: config.appName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createConfig: payload => dispatch({type: 'config/create', payload}),
    loadConfigList: (appName, env) => dispatch({
      type: 'config/loadConfigInfo',
      payload: {
        appName,
        env
      }
    }),
    showCreateModal: visible => dispatch({
      type: 'config/showCreateModal',
      payload: visible
    }),
    loadConfigDetail: id => dispatch({
      type: 'config/loadConfigDetail',
      payload: {id}
    }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreate)
