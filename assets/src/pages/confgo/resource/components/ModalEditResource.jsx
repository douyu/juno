import React, {useEffect} from "react";
import {Form, Input, Modal, Radio, Select} from "antd";
import {connect} from "dva";

function ModalEditResource(props) {
  const {visible, zoneEnv, tagList, onOk} = props
  const {id, env, zone_code, name, description, tags} = props.resource
  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) {
      return
    }

    form.resetFields()
    props.loadTags()
  }, [visible])

  return <Modal
    width={700}
    visible={props.visible} title={"编辑资源"}
    onOk={() => {
      form.submit()
    }}
    onCancel={() => props.showModalEdit({visible: false})}
  >

    <Form
      form={form} labelCol={{span: 3}}
      onFinish={(fields) => {
        console.log(fields)

        props.createResourceVersion({
          id: id,
          value: fields.value,
          tags: fields.tags,
          description: fields.description
        }).then(r => {
          if (r.code === 0) {
            // 成功，关闭窗口
            props.showModalEdit({visible: false})
            onOk && onOk()
          }
        })
      }}
    >
      <Form.Item
        label={"Env"} name={"env"} initialValue={env}
      >
        <Radio.Group disabled={true}>
          {Object.keys(zoneEnv).map(env => {
            return <Radio.Button key={env} value={env}>{env}</Radio.Button>
          })}
        </Radio.Group>
      </Form.Item>

      <Form.Item label={"Zone"} name={'zone'} initialValue={zone_code}>
        <Select disabled>
          {env && zoneEnv[env].map((item) => {
            return <Select.Option key={item.zone_code} value={item.zone_code}>{item.zone_name}</Select.Option>
          })}
        </Select>
      </Form.Item>

      <Form.Item
        label={"Tags"} name={"tags"} initialValue={tags}
      >
        <Select mode={"tags"}>
          {tagList && tagList.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
        </Select>
      </Form.Item>

      <Form.Item
        label={"Name"} name={"name"}
        initialValue={name}
        rules={[
          {pattern: /^[a-zA-Z0-9_]{5,32}$/, message: "无效的资源名称.需要符合规则：/^[a-zA-Z0-9_]{5,32}$/"},
          {required: true, message: '请输入资源名称'},
        ]}
      >
        <Input disabled/>
      </Form.Item>

      <Form.Item
        label={"Value"} name={"value"}
        rules={[
          {required: true, message: '请填写资源值'}
        ]}
      >
        <Input.TextArea/>
      </Form.Item>

      <Form.Item
        label={"Description"} name={"description"}
        initialValue={description}
        required
        rules={[
          {required: true, message: '请填写资源描述'}
        ]}
      >
        <Input.TextArea placeholder={"描述下本资源和资源变动"}/>
      </Form.Item>
    </Form>
  </Modal>;
}

const mapStateToProps = ({configResource}) => {
  return {
    resource: configResource.currentEditResource,
    visible: configResource.modalConfigResourceEditVisible,
    zoneEnv: configResource.zoneEnv,
    tagList: configResource.tags,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showModalEdit: (payload) => dispatch({
      type: 'configResource/showModalEdit',
      payload,
    }),
    createResourceVersion: payload => dispatch({
      type: 'configResource/createResourceVersion',
      payload
    }),
    loadTags: () => dispatch({
      type: 'configResource/loadTags'
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditResource)
