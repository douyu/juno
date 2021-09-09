import React, {useEffect, useState} from 'react';
import request from 'umi-request';
import ProTable from '@ant-design/pro-table';
import {Select} from "antd";
import {reqSelect} from "@/pages/analysis/register/service";
import {loadSettings} from "@/pages/manage/services";
import {FormInstance} from "antd/es/form";

export default function ServiceRegister() {
  const [zoneSelect, setZoneSelect] = useState([])
  const [app_select, setAppSelect] = useState([])
  const [prefix_data, setPrefixData] = useState([])
  const [env, setEnv] = useState([])
  const formRef = React.useRef<FormInstance>()

  useEffect(() => {
    reqSelect().then(res => {
      setZoneSelect(res.data.zoneSelect)
      setAppSelect(res.data.app_select)
      setEnv(res.data.envSelect)

      formRef.current?.setFieldsValue({zoneCode: res.data.zoneSelect[0].name})
      formRef.current?.setFieldsValue({env: res.data.envSelect[0].name})
    })

    loadSettings().then(res => {
      let settings = res.data

      Object.keys(settings).map(name => {
        settings[name] = JSON.parse(settings[name])
      })

      let prefixData = settings.etcd.map((item: any, idx: number) => {
        return item.prefix
      })
      setPrefixData(prefixData)

      formRef.current?.setFieldsValue({prefix: prefixData[0]})

    })

  }, [])


  return (
    <ProTable
      formRef={formRef}
      columns={[
        {
          dataIndex: 'prefix',
          title: "前缀",
          hideInTable: true,
          renderFormItem: (_, {type, defaultRender, ...rest}, form) => {
            return <Select>
              {prefix_data.map((item: any, idx) => {
                return <Select.Option value={item} key={idx}>{item}</Select.Option>
              })}
            </Select>;
          }
        },
        {
          dataIndex: 'zoneCode',
          title: "zone",
          hideInTable: true,
          renderFormItem: (_, {type, defaultRender, ...rest}, form) => {
            return <Select>
              {zoneSelect.map((item: any, idx) => {
                return <Select.Option value={item.value} key={idx}>{item.name}</Select.Option>
              })}
            </Select>;
          }
        },
        {
          dataIndex: 'env',
          title: "环境",
          hideInTable: true,
          renderFormItem: (_, {type, defaultRender, ...rest}, form) => {
            return <Select>
              {env.map((item: any, idx) => {
                return <Select.Option value={item.value} key={idx}>{item.name}</Select.Option>
              })}
            </Select>;
          }
        },
        {
          dataIndex: 'appName',
          title: "应用名称",
          hideInTable: true,
          renderFormItem: (_, {type, defaultRender, ...rest}, form) => {
            return <Select>
              {app_select.map((item: any, idx) => {
                return <Select.Option value={item.value} key={idx}>{item.value}</Select.Option>
              })}
            </Select>;
          }
        },
        {
          dataIndex: 'suffix',
          title: "后缀",
          hideInTable: true,
        },
        {
          dataIndex: 'key',
          title: 'key',
        },
        {
          dataIndex: 'value',
          title: 'value',
        },
        {
          dataIndex: 'version',
          title: 'version',
        },
        {
          dataIndex: 'lease',
          title: 'lease',
        },
        {
          dataIndex: 'mod_revision',
          title: 'ModRevision',
        },
        {
          dataIndex: 'create_revision',
          title: 'CreateRevision',
        },

      ]}
      request={async (params) => {
        return new Promise(async (resolve) => {
          const res = await request("/api/admin/analysis/register/list", {
            params
          })

          resolve(res.data)
        })
      }}

    />
  )
}
