import request from '@/utils/request';
import {stringify} from 'qs';

export async function getFrameVersion(params) {
  return request(`/api/admin/resource/app/frameVersion?${stringify(params)}`);
}

