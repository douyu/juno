import React, { useEffect, useState } from 'react';
import {
  JobType,
  PipelineDesc,
  PipelineStep,
  StepNames,
  StepType,
  Task,
  TaskStepStatus,
} from '@/models/testplatform/types';
import styles from './TaskItem.less';
import { fetchTaskSteps } from '@/services/testplatform';
import { message, Steps } from 'antd';
import { StepLogs } from '@/pages/app/components/Test/StepLogs';

interface TaskItemProps {
  task: Task;
}

function expandPipelineDesc(desc: PipelineDesc): PipelineStep[] {
  let steps: PipelineStep[] = [];

  const expandFunctor = (desc: PipelineDesc) => {
    desc.steps.map((item) => {
      if (item.type == StepType.SubPipeline && item.sub_pipeline) {
        expandFunctor(item.sub_pipeline);
      } else if (item.type == StepType.Job) {
        steps.push(item);
      }
    });
  };

  expandFunctor(desc);
  return steps;
}

function stepName(name: string): { title: string; description: string } {
  let desc = StepNames[name];
  if (desc) return desc;

  return { title: name, description: '' };
}

function TaskItem(props: TaskItemProps) {
  const { task } = props;
  const [steps, setSteps] = useState<TaskStepStatus[]>([]);
  const descSteps = expandPipelineDesc(task.desc);
  const [currentStep, setCurrentStep] = useState<number>();

  useEffect(() => {
    fetchTaskSteps(task.task_id).then((r) => {
      if (r.code === 14000) return;
      else if (r.code !== 0) {
        message.error('获取任务详情失败 ' + r.msg);
        return;
      }

      setSteps(r.data);
      return;
    });
  }, [task]);

  const getStep = (stepName: string) => {
    return steps?.find((item) => {
      return item.step_name == stepName;
    });
  };

  const getStepStatus = (stepName: string): 'wait' | 'process' | 'finish' | 'error' => {
    const step = steps?.find((item) => {
      return item.step_name == stepName;
    });

    if (!step) return 'wait';

    switch (step.status) {
      case 'failed':
        return 'error';
      case 'running':
        return 'process';
      case 'success':
        return 'finish';
      case 'waiting':
        return 'wait';
    }

    return 'wait';
  };

  return (
    <div className={styles.taskItem}>
      <div>
        <Steps
          type="navigation"
          size={'small'}
          current={currentStep}
          onChange={(current) => {
            setCurrentStep(current);
          }}
        >
          {descSteps.map((item, id) => {
            let stepDesc = stepName(item?.job_payload?.type || '');
            return (
              <Steps.Step
                key={id}
                status={getStepStatus(item.name)}
                title={stepDesc.title}
                description={stepDesc.description}
              />
            );
          })}
        </Steps>
      </div>

      <div className={styles.stepDesc}>
        <StepLogs
          logs={getStep(descSteps[currentStep || 0].name)?.logs || ''}
          jobType={descSteps[currentStep || 0].job_payload?.type || JobType.GitPull}
        />
      </div>
    </div>
  );
}

export default TaskItem;
