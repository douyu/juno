import React, { useState } from 'react';
import styles from './style.less';
import { Button, Divider, Radio } from 'antd';
/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const ZoneSelect: React.FC<{}> = (props) => {
  const { onChange, appEnvZone, env, defalutZone } = props;
  let data = [];
  data.push(<Radio.Button value="all">全部</Radio.Button>);
  appEnvZone.forEach((envItem) => {
    if (env != undefined && envItem.env == env) {
      envItem.zone_list.forEach((zoneItem) => {
        data.push(<Radio.Button value={zoneItem.zone_code}>{zoneItem.zone_name}</Radio.Button>);
      });
    }
  });
  return (
    <div className={styles.lay}>
      <Radio.Group defaultValue={defalutZone} buttonStyle="solid" onChange={onChange}>
        {data}
      </Radio.Group>
    </div>
  );
};

export default ZoneSelect;
