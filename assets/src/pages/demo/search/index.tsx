import React, { Component } from 'react';
import { message, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PageList from '@/components/PageList';
import { reqSelect } from './service';
const urlList = '/analysis/topology';

export default class ServiceTopology extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region_select: [],
      zone_select: [],
      env_select: [],
      type_select: [],
      app_select: [],
    };
  }

  search = new PageList({
    router: urlList,
    param: {
      region_code: null,
      show_type: 'chart',
    },
    refresh: (e: any) => {},
  });

  componentWillMount() {
    this.initList();
  }

  initList = (): void => {
    reqSelect().then((res) => {
      if (res.code !== 0) {
        message.error(res.msg);
        return false;
      }
      this.setState({
        region_select: res.data.region_select,
        zone_select: res.data.zone_select,
        env_select: res.data.env_select,
        type_select: res.data.type_select,
        app_select: res.data.app_select,
      });
      return true;
    });
  };

  render() {
    const { zone_select, env_select, type_select, app_select } = this.state;
    let { zone_code, env, type, show_type, app_name } = this.search.getParam();

    return (
      <PageHeaderWrapper>
        <Card>
          <PageList.Search
            onSubmit={this.search.submit}
            defaultValue={this.search.defaultParam}
            onReset={this.search.reset}
            items={[
              {
                label: '可用区',
                select: {
                  field: 'zone_code',
                  style: { width: 300 },
                  placeholder: '全部状态',
                  data: zone_select,
                  initialValue: zone_code,
                },
              },
              {
                label: '环境',
                select: {
                  field: 'env',
                  style: { width: 100 },
                  placeholder: '全部状态',
                  data: env_select,
                  initialValue: env,
                },
              },
              {
                label: '应用',
                select: {
                  field: 'app_name',
                  style: { width: 300 },
                  placeholder: '全部状态',
                  data: app_select,
                  initialValue: app_name,
                },
              },
              {
                label: '依赖类型',
                select: {
                  field: 'type',
                  style: { width: 100 },
                  placeholder: '全部状态',
                  data: type_select,
                  initialValue: type,
                },
              },
              {
                label: '展示类型',
                select: {
                  field: 'show_type',
                  style: { width: 100 },
                  placeholder: '全部状态',
                  data: [
                    { name: '图表', value: 'chart' },
                    { name: '列表', value: 'list' },
                  ],
                  initialValue: show_type,
                },
              },
            ]}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
