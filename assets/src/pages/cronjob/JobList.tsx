import React, {useEffect, useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import ProTable, {ActionType, ProColumns, RequestData} from '@ant-design/pro-table'
import {Badge, Button, message, Select, Tag} from "antd";
import {Job, Timer} from "@/models/cronjob/types";
import {ClockCircleOutlined} from '@ant-design/icons'
import {Link} from "umi";
import {StatusValueEnums} from "@/pages/cronjob/types";
import confirm from "antd/es/modal/confirm";
import {FileAddOutlined} from "@ant-design/icons/lib";
import {useBoolean} from "ahooks";
import ModalNewJob from "@/pages/cronjob/ModalNewJob";
import ModalEditJob from "@/pages/cronjob/ModalEditJob";
import {AppItem} from "@/models/app";
import {ServiceAppList} from "@/services/app";
import {deleteJob, fetchJobs} from "@/services/taskplatform";
import ModalTriggerJob from "@/pages/cronjob/ModalTriggerJob";

function getColumns(options: {
  apps: AppItem[]
}) {
  const columns: ProColumns<Job>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      render(val: any, row: any) {
        return <Link to={`/cronjob/jobs/${row.id}/tasks`}>{val}</Link>
      }
    },
    {
      title: 'Cron',
      dataIndex: 'timers',
      hideInSearch: true,
      render(val: any) {
        return <>{(val as Timer[]).map((timer, idx) => <Tag key={idx} icon={<ClockCircleOutlined/>}
                                                            color={"processing"}>{timer.cron}</Tag>)}</>
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueEnum: StatusValueEnums
    },
    {
      title: 'User',
      dataIndex: 'username'
    },
    {
      title: 'App',
      dataIndex: 'app_name',
      order: 100,
      renderFormItem() {
        return <Select showSearch>
          {options.apps.map(app => <Select.Option key={app.app_name} value={app.app_name}>
            {app.app_name}
          </Select.Option>)}
        </Select>
      }
    },
    {
      title: 'Enable',
      dataIndex: 'enable',
      render: val => {
        return val ? <Badge color={"green"} text={"启用"}/> : <Badge color={"red"} text={"未启用"}/>
      },
      valueEnum: {
        0: "启用",
        1: "未启用"
      },
      renderFormItem(item, config, form) {
        return <Select value={config.value != undefined && (config.value ? 'true' : 'false') || undefined}
                       onChange={val => config.onChange && config.onChange(val === "true")}>
          <Select.Option value={"true"}>启用</Select.Option>
          <Select.Option value={"false"}>未启用</Select.Option>
        </Select>
      },
      order: 99
    },
    {
      title: '上次执行',
      dataIndex: 'last_executed_at',
      hideInSearch: true,
      valueType: "dateTime"
    },
  ]
  return columns
}

export default function () {
  const [visibleModalNew, visibleModalNewAct] = useBoolean(false)
  const [visibleModalEdit, visibleModalEditAct] = useBoolean(false)
  const [jobEdit, setJobEdit] = useState<Job | undefined>(undefined)
  const [jobTrigger, setJobTrigger] = useState<Job | undefined>(undefined)
  const [apps, setApps] = useState<AppItem[]>([])
  const tableActionRef = React.useRef<ActionType>()

  useEffect(() => {
    ServiceAppList().then(r => {
      setApps(r.data.list)
    })
  }, [])

  const columns = getColumns({
    apps: apps
  })

  const request = (params: { pageSize?: number, current?: number }, sort: any, filter: any) => {
    console.log(params, sort, filter)
    const {pageSize, current, ...restParams} = params
    return new Promise<RequestData<Job>>((resolve, reject) => {
      fetchJobs(current, pageSize, restParams).then(r => {
        if (r.code !== 0) {
          reject(r.msg)
        }

        const {pagination, list} = r.data
        return resolve({
          total: pagination.total,
          data: list
        })
      })
    })
  }

  const onDelete = (job: Job) => {
    confirm({
      title: "确认删除?",
      content: <div>
        确认删除任务 <b>{job.name}</b> 删除后不可恢复，确认删除？
      </div>,
      cancelText: "我点错了",
      okText: "确定",
      onOk: () => {
        return new Promise((resolve, reject) => {
          deleteJob(job.id).then(r => {
            if (r.code === 14000) {
              reject()
              return
            }

            if (r.code !== 0) {
              reject(r.msg)
              return
            }

            message.success("删除成功!")
            tableActionRef.current?.reload()
            resolve()
          })
        })
      }
    })
  }

  const onTrigger = (job: Job) => {
    setJobTrigger(job)
  }

  return <PageHeaderWrapper>
    <ProTable
      actionRef={tableActionRef}
      headerTitle={"Job列表"}
      request={request}
      toolBarRender={() => [
        <Button
          key={"new"}
          type={"link"}
          icon={<FileAddOutlined/>}
          onClick={() => {
            visibleModalNewAct.setTrue()
          }}
        >新建</Button>
      ]}
      columns={[
        ...columns,
        {
          title: '操作',
          valueType: "option",
          render: (val, row, _) => {
            return <Button.Group>
              <Button
                type={"link"}
                danger
                onClick={() => onDelete(row)}
              >删除</Button>

              <Button
                type={"link"}
                onClick={() => {
                  setJobEdit(row)
                  visibleModalEditAct.setTrue()
                }}
              >
                编辑
              </Button>

              <Button
                type={"link"}
                onClick={() => onTrigger(row)}
              >
                手动触发
              </Button>
            </Button.Group>
          }
        }
      ]}
    />

    <ModalNewJob
      visible={visibleModalNew}
      onCancel={visibleModalNewAct.setFalse}
      onOk={() => {
        tableActionRef.current?.reload()
        visibleModalNewAct.setFalse()
      }}
    />

    <ModalEditJob
      visible={visibleModalEdit}
      onCancel={visibleModalEditAct.setFalse}
      onOk={() => {
        tableActionRef.current?.reload()
        visibleModalEditAct.setFalse()
      }}
      job={jobEdit}
    />

    {jobTrigger && <ModalTriggerJob
      visible={true}
      job={jobTrigger}
      onCancel={() => setJobTrigger(undefined)}
      onOk={() => setJobTrigger(undefined)}
    />}
  </PageHeaderWrapper>;
}
