import React, {PropsWithChildren, useState} from 'react';
import styles from './SettingBlock.less';
import {Button, Form} from "antd";
import {Dispatch} from "@@/plugin-dva/connect";

export interface SettingBlockProps {
  title: string
  editable: boolean
  edit?: boolean
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
}

export default function (props: PropsWithChildren<SettingBlockProps>) {
  const editButton = props.edit ? (<span style={{paddingLeft: '10px'}}>
        <Button type={"primary"} size={"small"} onClick={props.onSave}>
          保存
        </Button>
        <Button type={"link"} size={"small"} onClick={props.onCancel}>
          取消
        </Button>
      </span>) :
    <Button onClick={props.onEdit} style={{marginLeft: '10px'}} size={"small"} type={"link"}>修改</Button>


  return <div className={styles.settingBlock}>
    <div className={styles.header}>
      <span className={styles.title}>{props.title}</span>
      {props.editable && editButton}
    </div>
    <div>
      {props.children}
    </div>
  </div>
}

export function useSettingBlock(fieldName: string, dispatch: Dispatch, editable = true) {
  const [editing, setEditing] = useState(!editable)
  const [form] = Form.useForm()

  const saveField = (content: any) => {
    return dispatch({
      type: 'setting/saveSetting',
      payload: {
        name: fieldName,
        content: JSON.stringify(content)
      }
    })
  }

  const props = {
    editable,
    edit: editing,
    onEdit: () => setEditing(true),
    onCancel: () => setEditing(false),
    onSave: () => {
      form.validateFields().then(fields => {
        saveField(fields)
      })
    }
  }

  return [
    saveField,
    props,
    form,
    editing,
  ]
}
