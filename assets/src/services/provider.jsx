import request from "@/utils/request";
import {stringify} from "qs";



export async function fetchAggregationList(params) {
  return request(`/api/admin/grpc/aggregation/list?${stringify(params)}`);
}
