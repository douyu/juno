import { DefaultState, Type } from '@/models/cronjob/types';
import effects from '@/models/cronjob/effects';
import reducers from '@/models/cronjob/reducers';

const CronJobModel: Type = {
  namespace: 'cronjob',
  effects: effects,
  reducers: reducers,
  state: DefaultState,
};

export default CronJobModel;
