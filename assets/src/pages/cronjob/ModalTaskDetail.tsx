import {ModalProps} from "antd/es/modal";
import {Badge, Descriptions, message, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {Task, TaskDetail, TaskStatus} from "@/models/cronjob/types";
import ProSkeleton from "@ant-design/pro-skeleton/lib/index";
import MonacoEditor from "react-monaco-editor/lib/editor";
import {fetchTaskDetail} from "@/services/taskplatform";
import {PresetStatusColorType} from "antd/lib/_util/colors";

interface ModalTaskDetailProps extends ModalProps {
  task: Task | null
}

function convertTaskStatusToBadgeStatus(status: TaskStatus | undefined): PresetStatusColorType {
  switch (status) {
    case TaskStatus.Failed:
      return "error"
    case TaskStatus.Processing:
      return "processing"
    case TaskStatus.Success:
      return "success"
  }

  return "default"
}

export default function ModalTaskDetail(props: ModalTaskDetailProps) {
  const {task} = props
  const [loading, setLoading] = useState<boolean>(true)
  const [taskDeTail, setTaskDetail] = useState<TaskDetail | null>()

  useEffect(() => {
    if (task) {
      setLoading(true)
      fetchTaskDetail(task.id).then(res => {
        setLoading(false)
        setTaskDetail(res.data)
      }).catch(e => {
        setLoading(false)
        message.error("获取任务详情失败 " + e.msg)
      })
    }
  }, [task])

  return <Modal
    {...props}
    title={"任务详情"}
    footer={null}
    width={"900px"}
  >
    {loading && <ProSkeleton type={"list"}/>}

    {!loading && <div>
      <Descriptions bordered column={4}>
        <Descriptions.Item label={"Job ID"} span={2}>{taskDeTail?.job_id}</Descriptions.Item>
        <Descriptions.Item label={"Task ID"} span={2}>{taskDeTail?.id}</Descriptions.Item>

        <Descriptions.Item label={"Status"} span={4}>
          <Badge status={convertTaskStatusToBadgeStatus(taskDeTail?.status)} text={taskDeTail?.status}/>
        </Descriptions.Item>

        <Descriptions.Item label={"Executed At"} span={2}>{taskDeTail?.executed_at}</Descriptions.Item>
        <Descriptions.Item label={"Finished At"} span={2}>{taskDeTail?.finished_at}</Descriptions.Item>

        <Descriptions.Item label={"Script"} span={4}>{taskDeTail?.script}</Descriptions.Item>
        <Descriptions.Item label={"Logs"} span={4}>
          <MonacoEditor
            theme={"vs-dark"}
            height={400}
            width={"100%"}
            value={taskDeTail?.log}
            options={{
              automaticLayout: true,
              minimap: {
                enabled: false,
              },
              readOnly: true
            }}
          />
        </Descriptions.Item>

      </Descriptions>
    </div>}
  </Modal>
}
