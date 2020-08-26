import React from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import ProTable, {RequestData} from '@ant-design/pro-table'
import {Button, Tag} from "antd";
import {Job, JobStatus} from "@/models/cronjob/types";
import {ClockCircleOutlined} from '@ant-design/icons'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name'
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
    valueEnum: {
      'processing': {
        status: "Processing",
        text: '运行中'
      },
      'success': {
        status: "Success",
        text: '成功'
      },
      'failed': {
        status: "Error",
        text: '失败'
      }
    }
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
              app_name: "wsd-app-badGuy",
              status: JobStatus.Processing,
              last_executed_at: "2018-12-12 12:00:00",
              created_at: "2018-12-12 12:00:00",
            }
          ]
        });
      }, 1000)
    })
  }

  return <PageHeaderWrapper>
    <ProTable
      headerTitle={"Job列表"}
      request={request}
      columns={[
        ...columns,
        {
          title: '操作',
          render: () => {
            return <Button.Group>
              <Button danger>删除</Button>

            </Button.Group>
          }
        }
      ]}
    />
  </PageHeaderWrapper>
}
