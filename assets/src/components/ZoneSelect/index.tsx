import React from 'react';
import {Radio} from 'antd';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const ZoneSelect = (props: any) => {
  const {onChange, zoneCode, zoneList} = props;
  return (
    <div>
      <Radio.Group value={zoneCode} buttonStyle="solid" onChange={onChange}>
        <Radio.Button value="all" key={"all"}>全部</Radio.Button>
        {zoneList.map((zoneItem: any, index: number) => {
          return <Radio.Button key={index} value={zoneItem.zone_code}>{zoneItem.zone_name}</Radio.Button>
        })}
      </Radio.Group>
    </div>
  );
};

export default ZoneSelect;
