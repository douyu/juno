import { DefaultState, Reducers, TestPlatformState } from '@/models/testplatform/types';

const reducers: Reducers = {
  savePipelines(state = DefaultState, { payload }): TestPlatformState {
    return {
      ...state,
      pipelines: payload,
    };
  },
  setPipelinesLoading(state = DefaultState, { payload }): TestPlatformState {
    return {
      ...state,
      pipelinesLoading: payload,
    };
  },
  saveTasks(state = DefaultState, { payload }): TestPlatformState {
    return {
      ...state,
      tasks: payload,
    };
  },
  setTasksLoading(state = DefaultState, { payload }): TestPlatformState {
    return {
      ...state,
      tasksLoading: payload,
    };
  },
};

export default reducers;
