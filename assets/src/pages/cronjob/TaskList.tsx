import React, {useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Link} from "umi";
import {BreadcrumbProps} from "antd/lib/breadcrumb";
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {Task} from "@/models/cronjob/types";
import {StatusValueEnums} from "@/pages/cronjob/types";
import {RequestData} from "@ant-design/pro-table/lib/useFetchData";
import {Button, message} from "antd";
import ModalTaskDetail from "@/pages/cronjob/ModalTaskDetail";
import {Route} from "antd/es/breadcrumb/Breadcrumb";
import {match} from 'react-router'
import {fetchTasks} from "@/services/taskplatform";

const breadcrumbs: BreadcrumbProps = {
  routes: [
    {
      path: '/cronjob',
      breadcrumbName: '任务中心'
    },
    {
      path: '',
      breadcrumbName: 'Job详情'
    },
  ],
  itemRender: (route: Route, params: any, routes, paths) => {
    return <Link to={route.path}>{route.breadcrumbName}</Link>
  }
}

const columns: ProColumns<Task>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    hideInSearch: true
  },
  {
    title: 'Status',
    dataIndex: 'status',
    valueEnum: StatusValueEnums,
    hideInSearch: true
  },
  {
    title: '开始时间',
    dataIndex: 'executed_at',
    hideInSearch: true,
    valueType: "dateTime"
  },
  {
    title: '结束时间',
    dataIndex: 'finished_at',
    hideInSearch: true,
    valueType: "dateTime"
  },
  {
    title: "执行时间",
    dataIndex: 'executed_at',
    hideInTable: true,
    valueType: "dateTimeRange"
  },
]

interface TaskListProps {
  match: match<{
    jobId: string
  }>
}

export default function TaskList(props: TaskListProps) {
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const {jobId} = props.match.params

  const request = (params: { current: number, pageSize: number}, sort: any, filter: any): Promise<RequestData<Task>> => {
    console.log(params, sort, filter)
    let jobIdInt: number = Number.parseInt(jobId)

    const {current, pageSize, ...otherParams} = params
    return new Promise<RequestData<Task>>((resolve, reject) => {
      fetchTasks(jobIdInt, current, pageSize, otherParams).then(r => {
        if (r.code === 14000) return
        if (r.code !== 0) {
          message.error("获取 Task 列表失败 " + r.msg)
          return
        }

        const {pagination, list} = r.data
        resolve({
          data: list,
          total: pagination.total
        })
      }).catch(e => {
        resolve(e)
      })
    })
  }

  return <PageHeaderWrapper
    title={"Task列表"}
    breadcrumb={breadcrumbs}
  >
    <ProTable
      rowKey={"id"}
      columns={[
        ...columns,
        {
          title: '操作',
          valueType: "option",
          render: (_, row) => {
            return <Button
              type={"link"}
              onClick={() => {
                setCurrentTask(row)
              }}
            >
              详情
            </Button>
          }
        }
      ]}
      request={request}
    />

    <ModalTaskDetail
      visible={currentTask !== null}
      onCancel={() => setCurrentTask(null)}
      task={currentTask}
    />
  </PageHeaderWrapper>
}
