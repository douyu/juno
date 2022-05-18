import { stringify } from 'qs';
import request from '@/utils/request';

export async function ServiceAnalysisTopologyRelationship(param: any) {
  return request(`/api/admin/analysis/topology/relationship?${stringify(param)}`);
}
