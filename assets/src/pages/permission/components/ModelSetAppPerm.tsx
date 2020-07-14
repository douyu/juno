import {connect} from "dva";
import {ConnectState} from "@/models/connect";
import {Checkbox, Form, Input, message, Modal, notification, Row, Select} from "antd";
import React, {useEffect, useState} from "react";
import {appPermissionList, setUserGroupAppPerm} from "@/services/permission";

export interface ModalSetAppPermProps {
  appName: string
  visible: boolean
  envs: string[]
  onCancel: () => void
  onOk: () => void
  userGroup: string
}

function ModalSetAppPerm(props: ModalSetAppPermProps) {
  const {envs, appName, userGroup} = props
  const [pmsList, setPMSList] = useState<any[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    appPermissionList().then(r => {
      if (r.code !== 0) {
        notification.error({
          message: '加载权限列表失败'
        })
        return
      }

      setPMSList(r.data || [])
    })
  }, [])

  return <Modal
    onCancel={() => props.onCancel()}
    visible={props.visible}
    title={"设置应用权限"}
    onOk={() => {
      form.submit()
    }}
  >
    <Form
      form={form}
      onFinish={(fields) => {
        const {env, permission} = fields
        let payload = {
          env,
          action: permission,
          group_name: userGroup,
          app_name: appName
        }

        setUserGroupAppPerm(payload).then(r => {
          if (r.code !== 0) {
            message.error("保存失败")
            return
          }

          message.success("保存成功")
          props.onOk()
        })
      }}
    >
      <Form.Item label={"用户组"}>
        <Input disabled value={userGroup}/>
      </Form.Item>

      <Form.Item label={"应用"}>
        <Input disabled value={appName}/>
      </Form.Item>

      <Form.Item
        label={"环境"}
        name={"env"}
        rules={[
          {required: true, message: '请选择环境'}
        ]}
      >
        <Select mode={"multiple"}>
          {(envs || []).map(item => {
            return <Select.Option key={item} value={item}>{item}</Select.Option>
          })}
        </Select>
      </Form.Item>

      <Form.Item
        label={"权限"}
        name={"permission"}
      >

        <Checkbox.Group>
          {pmsList.map(item => {
            return <Row>
              <Checkbox value={item.key}>{item.name}</Checkbox>
            </Row>
          })}

        </Checkbox.Group>

      </Form.Item>

    </Form>
  </Modal>
}

const mapStateToProps = ({}: ConnectState) => {
  return {}
}

export default connect(mapStateToProps)(ModalSetAppPerm)
