import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Pipeline, Task } from '@/models/testplatform/types';
import styles from './Task.less';
import { fetchTasks, runPipeline, updatePipeline } from '@/services/testplatform';
import { Button, List, message, Popconfirm, Skeleton } from 'antd';
import moment from 'moment';
import TaskItem from '@/pages/app/components/Test/TaskItem';
import RunStatus from '@/pages/app/components/Test/RunStatus';
import { useBoolean } from 'ahooks';
import DrawerEditPipeline from '@/pages/app/components/Test/DrawerEditPipeline';
import { EditOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons/lib';

interface TasksProps {
  pipeline: Pipeline;
  onDelete: () => {};
  onUpdate: () => {};
  appName: string;
  zoneCode: string;
  env: string;
}

function Tasks(props: TasksProps) {
  const { pipeline } = props;
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, tasksLoadingAct] = useBoolean(false);
  const [pagination, setPagination] =
    useState<{ current: number; total: number; pageSize: number }>();
  const [visibleDrawer, visibleDrawerAct] = useBoolean(false);

  const loadTasks = (page = 1, pageSize = 10) => {
    tasksLoadingAct.setTrue();

    fetchTasks(pipeline.id, page, pageSize).then((r) => {
      tasksLoadingAct.setFalse();

      if (r.code === 14000) {
        return;
      } else if (r.code !== 0) {
        message.error('加载任务失败 ' + r.msg);
        return;
      }

      const { list, pagination } = r.data;
      setTasks(list);
      setPagination(pagination);
    });
  };

  const triggerPipeline = () => {
    runPipeline(pipeline.id).then((r) => {
      if (r.code === 14000) return;
      if (r.code !== 0) {
        message.error('触发失败 ' + r.msg);
        return;
      }

      message.success('触发成功');
      return;
    });
  };

  const onReload = () => {
    loadTasks();
    let task = currentTask;
    setCurrentTask(null);
    setCurrentTask(task);
  };

  useEffect(() => {
    loadTasks();
  }, [pipeline]);

  let classNames = [styles.task];
  if (currentTask) classNames.push(styles.taskSelected);
  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Button.Group>
          <Popconfirm onConfirm={() => triggerPipeline()} title={'确认触发？'}>
            <Button icon={<PlayCircleOutlined />}>手动触发</Button>
          </Popconfirm>
          <Button icon={<EditOutlined />} onClick={() => visibleDrawerAct.setTrue()}>
            编辑 Pipeline
          </Button>
          <Button icon={<ReloadOutlined />} onClick={onReload} />
        </Button.Group>
      </div>

      <div className={classNames.join(' ')}>
        {tasksLoading && <Skeleton active round />}

        {!tasksLoading && (
          <List
            split={false}
            className={styles.taskList}
            pagination={{
              ...pagination,
              onChange: (page, pageSize) => {
                loadTasks(page, pageSize);
              },
            }}
            dataSource={tasks || []}
            renderItem={(task, id) => {
              return (
                <List.Item
                  className={styles.taskItem}
                  key={id}
                  onClick={() => setCurrentTask(task)}
                >
                  <div className={styles.taskID}># {task.task_id}</div>
                  <RunStatus status={task.status} className={styles.runStatus} />
                  <div className={styles.timeCost}>
                    <div>{moment(task.created_at).fromNow()}</div>
                    <div>开始于</div>
                  </div>
                </List.Item>
              );
            }}
          />
        )}

        {!tasksLoading && currentTask && <TaskItem task={currentTask} />}
      </div>

      <DrawerEditPipeline
        {...props}
        visible={visibleDrawer}
        onDelete={() => {
          visibleDrawerAct.setFalse();
          props.onDelete();
        }}
        onFinish={(fields) => {
          fields = {
            ...fields,
            grpc_test_cases:
              fields.grpc_test_cases?.map((item: any) => ({
                service: item.testcase[0],
                method: item.testcase[1],
                testcase: item.testcase[2],
              })) || [],
          };

          updatePipeline(fields).then((r) => {
            if (r.code === 14000) return;
            if (r.code !== 0) {
              message.error(r.msg);
              return;
            }

            message.success('更新成功');
            visibleDrawerAct.setFalse();
            props.onUpdate();
          });
        }}
        onCancel={() => {
          visibleDrawerAct.setFalse();
        }}
        pipeline={pipeline}
      />
    </div>
  );
}

export default connect()(Tasks);
