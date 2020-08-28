import React, {useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import ProTable, {ProColumns, RequestData} from '@ant-design/pro-table'
import {Button, message, Tag} from "antd";
import {Job, TaskStatus} from "@/models/cronjob/types";
import {ClockCircleOutlined} from '@ant-design/icons'
import {Link} from "umi";
import {StatusValueEnums} from "@/pages/cronjob/types";
import confirm from "antd/es/modal/confirm";
import {FileAddOutlined} from "@ant-design/icons/lib";
import {useBoolean} from "ahooks";
import ModalNewJob from "@/pages/cronjob/ModalNewJob";
import ModalEditJob from "@/pages/cronjob/ModalEditJob";

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
    dataIndex: 'cron',
    hideInSearch: true,
    render(val: any) {
      return <Tag icon={<ClockCircleOutlined/>} color={"processing"}>
        {val}
      </Tag>
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
    title: '上次执行',
    dataIndex: 'last_executed_at',
    hideInSearch: true,
  },
]

export default function () {
  const [visibleModalNew, visibleModalNewAct] = useBoolean(false)
  const [visibleModalEdit, visibleModalEditAct] = useBoolean(false)
  const [jobEdit, setJobEdit] = useState<Job | undefined>(undefined)

  const request = () => {
    return new Promise<RequestData<Job>>((resolve) => {
      setTimeout(() => {
        return resolve({
          total: 1,
          data: [
            {
              id: 1,
              name: "定时清理过期文件",
              cron: "0 0 0 * * *",
              username: "段律",
              app_name: "juno-admin",
              status: TaskStatus.Processing,
              last_executed_at: "2018-12-12 12:00:00",
              created_at: "2018-12-12 12:00:00",
              zone: "WH",
              env: "dev",
              script: "echo hello",
              timeout: 10,
              retry_count: 3,
              retry_interval: 5,
              timers: [
                {
                  cron: "0 0 * * * *",
                  nodes: [
                    "dev.wh.a-1",
                    "dev.wh.a-2",
                  ]
                }
              ]
            }
          ]
        });
      }, 1000)
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
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve()
            message.success("删除成功!")
          }, 2000)
        })
      }
    })
  }

  const onTrigger = (job: Job) => {
    confirm({
      title: '确认触发?',
      content: <div>
        确认触发任务 <b>{job.name}</b> ?
      </div>,
      cancelText: "我点错了",
      okText: "确定",
      onOk: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve()
            message.success("触发成功!")
          }, 2000)
        })
      }
    })
  }

  return <PageHeaderWrapper>
    <ProTable
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
          render: (_, row) => {
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
      onOk={visibleModalNewAct.setFalse}
    />

    <ModalEditJob
      visible={visibleModalEdit}
      onCancel={visibleModalEditAct.setFalse}
      onOk={visibleModalEditAct.setFalse}
      job={jobEdit}
    />
  </PageHeaderWrapper>;
}
