import { Effects, Task } from '@/models/testplatform/types';
import { fetchPipelines } from '@/services/testplatform';
import { message } from 'antd';

const effects: Effects = {
  *fetchPipelines({ payload }, { call, put }) {
    yield put({ type: 'setPipelinesLoading', payload: true });

    const res = yield call(fetchPipelines, payload);

    yield put({ type: 'setPipelinesLoading', payload: false });

    if (res.code !== 0) {
      if (res.code !== 14000) {
        message.error('加载Pipeline列表失败: ' + res.msg);
        return res;
      }

      return res;
    }

    yield put({
      type: 'savePipelines',
      payload: res.data || [],
    });

    return res;
  },
  *fetchTasks(action, { put }) {
    yield put({ type: 'setTasksLoading', payload: true });

    setTimeout(async () => {
      await put({ type: 'setTasksLoading', payload: false });
      await put({
        type: 'setTasks',
        payload: [
          {
            task_id: 187,
            name: 'juno_debug',
            env: 'dev',
            zone_code: 'whyl',
          } as Task,
        ],
      });
    }, 1000);
  },
};

export default effects;
