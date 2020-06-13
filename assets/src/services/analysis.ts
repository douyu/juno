import { request } from 'umi';
import { stringify } from 'qs';

export async function ServiceAnalysisTopologyRelationship(param: any) {
  return request(`/api/admin/analysis/topology/relationship?${stringify(param)}`);
}
