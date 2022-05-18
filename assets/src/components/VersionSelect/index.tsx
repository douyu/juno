import React from 'react';
import { Radio } from 'antd';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const ZoneSelect = (props: any) => {
  const { onChange, appEnvZone, env, zoneCode } = props;
  let data = [];
  data.push(<Radio.Button value="all">全部111</Radio.Button>);
  appEnvZone.forEach((envItem: any) => {
    if (env != undefined && envItem.env == env) {
      envItem.zone_list.forEach((zoneItem: any) => {
        data.push(<Radio.Button value={zoneItem.zone_code}>{zoneItem.zone_name}</Radio.Button>);
      });
    }
  });
  return (
    <div>
      <Radio.Group value={zoneCode} buttonStyle="solid" onChange={onChange}>
        {data}
      </Radio.Group>
    </div>
  );
};

export default ZoneSelect;
