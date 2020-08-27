import React, {useState} from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Route} from "antd/es/breadcrumb/Breadcrumb";
import {Link} from "umi";
import {BreadcrumbProps} from "antd/lib/breadcrumb";
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {Task, TaskStatus} from "@/models/cronjob/types";
import {StatusValueEnums} from "@/pages/cronjob/types";
import {RequestData} from "@ant-design/pro-table/lib/useFetchData";
import {Button} from "antd";
import ModalTaskDetail from "@/pages/cronjob/ModalTaskDetail";

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
  },
  {
    title: '开始时间',
    dataIndex: 'executed_at',
    hideInSearch: true
  },
  {
    title: '结束时间',
    dataIndex: 'finished_at',
    hideInSearch: true
  },
  {
    title: "执行时间",
    dataIndex: 'executed_at',
    hideInTable: true,
    valueType: "dateTimeRange"
  },
]

const request = (params: any, sort: any, filter: any): Promise<RequestData<Task>> => {
  console.log(params, sort, filter)
  return new Promise<RequestData<Task>>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        total: 1,
        success: true,
        data: [
          {
            id: 1,
            job_id: 1,
            status: TaskStatus.Processing,
            executed_at: "2020-02-01 12:00:00",
            finished_at: "2020-02-01 12:00:01",
            retry_count: 1,
          },
        ],
      })
    }, 2000)
  })
}

export default function () {
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

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
