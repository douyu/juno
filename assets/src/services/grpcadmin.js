import { stringify } from 'qs';
import request from '@/utils/request';

// ## 服务治理更新
// curl -X "POST" "http://127.0.0.1:50004/api/admin/grpc/configurators/update" \
//      -H 'Content-Type: text/plain; charset=utf-8' \
//      -d $'{
// "idc_id": 1,
//   "app_name": "wsd-live-srv-roombase-go",
//   "reg_key": "/wsd-reg/server/grpc:wsd-live-srv-roombase-go/10.1.31.23:50001",
//   "enable": true,
//   "weight": 200,
//   "group": "default"
// }'
export async function configuratorsUpdate({
  idcCode,
  appName,
  regKey,
  enable,
  weight,
  group,
  env,
}) {
  weight = weight.toString();
  return request(`/api/admin/grpc/configurators/update`, {
    method: 'POST',
    data: { idcCode, appName, regKey, enable, weight, group, env },
  });
}
