import React from 'react';
import { Link } from 'react-router-dom';
import { message, Popover } from 'antd';
import styles from './index.less';
import { GetAppViewHistory } from '@/services/user';
import { getAppSearchByAppName } from '@/utils/searchapppath';
import { history } from '@@/core/umiExports';

const ItemColors = ['#41affe', '#4f9afc', '#35d498', '#34d2bd'];

export default class ViewHistory extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      myAppViewHistory: [],
    };
  }

  componentDidMount() {
    GetAppViewHistory().then((res) => {
      if (res.code === 0) {
        this.setState({
          myAppViewHistory: res.data,
        });
      } else {
        message.error(res.msg);
      }
    });
  }

  render() {
    const { myAppViewHistory = [] } = this.state;
    if (myAppViewHistory.length === 0) return <></>;
    return (
      <div className={styles.viewHistory}>
        {myAppViewHistory && myAppViewHistory.filter((item) => {
          return item.appName
        }).map((item, index) => {
          // 解决历史应用点击进来无历史信息的问题
          return (
            <a
              key={index}
              onClick={() => {
                getAppSearchByAppName(item.appName, '/app').then((val) => {
                  if (val == null) {
                    // eslint-disable-next-line no-param-reassign
                    val = `aid=${item.aid}&appName=${item.appName}&&tab=detailL`;
                  }
                  //若是通过路由跳转历史app
                  // history.push({
                  //   search: val ||'',
                  //   pathname: '/app',
                  // })
                  //历史app点击后新启一个浏览器tab
                  window.open('/app' + '?' + val);
                });
              }}
            >
              <Popover content={item.appName}>
                <div
                  style={{ backgroundColor: this.pickColor(item.appName) }}

                  className={styles.historyItem}
                >
                  {item.appName}
                </div>
              </Popover>
            </a>
          );
        })}
      </div>
    );
  }

  pickColor(appName) {
    let sum = appName
      .split('')
      .map((c) => c.charCodeAt(0))
      .reduce((a, b) => a + b);
    return ItemColors[sum % ItemColors.length];
  }
}
