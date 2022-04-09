import React, { useEffect } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { AppEventState } from '@/models/app_event';
import { Empty, List } from 'antd';
import EventView from '@/components/EventView';
import { Dispatch } from '@@/plugin-dva/connect';

interface AppEventProps {
  dispatch: Dispatch;
  active: boolean;
  appName: string;
  env: string;
}

function Event(props: AppEventProps & AppEventState) {
  const { list, active, listLoading, appName, pagination, env } = props;

  const fetch = (payload: any) => {
    props.dispatch({
      type: 'appEvent/fetch',
      payload: {
        ...payload,
        page_size: 10,
        app_name: appName,
        env: env,
      },
    });
  };

  useEffect(() => {
    if (active && appName && env) {
      fetch({});
    } else {
      props.dispatch({
        type: 'appEvent/clear',
      });
    }
  }, [active, appName, env]);

  return (
    <div style={{ padding: '20px' }}>
      <List
        loading={listLoading}
        pagination={{
          ...pagination,
          current: pagination.current,
          onChange: (page) => {
            fetch({
              page,
            });
          },
        }}
      >
        {list.map((item, index) => {
          return (
            <List.Item key={index}>
              <EventView data={item} />
            </List.Item>
          );
        })}
      </List>

      {!listLoading && !list.length && (
        <Empty style={{ margin: '100px 0' }} description={'暂无事件'} />
      )}
    </div>
  );
}

export default connect(({ appEvent }: ConnectState) => {
  return {
    list: appEvent.list,
    pagination: appEvent.pagination,
    listLoading: appEvent.listLoading,
  };
})(Event);
