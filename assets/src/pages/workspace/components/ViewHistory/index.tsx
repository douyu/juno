import React from "react";
import {Link} from "react-router-dom";
import {message, Popover} from "antd";
import styles from './index.less';
import {
  GetAppViewHistory
} from '@/services/user';


const ItemColors = [
  "#41affe",
  "#4f9afc",
  "#35d498",
  "#34d2bd"
];

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
    const {myAppViewHistory=[]} = this.state;
    console.log(myAppViewHistory);
    if (myAppViewHistory.length === 0) return <></>;
    return <div className={styles.viewHistory}>
      {myAppViewHistory.map((item, index) => {
        return <Link to={`/app?aid=${item.aid}&appName=${item.appName}&&tab=detailL`} target="_blank">
          <Popover content={item.appName}>
            <div
              style={{backgroundColor: this.pickColor(item.appName)}}
              key={index}
              className={styles.historyItem}>
              {item.appName}
            </div>
          </Popover>
        </Link>
      })}
    </div>;
  }

  pickColor(appName) {
    let sum = appName.split('')
      .map(c => c.charCodeAt(0))
      .reduce((a, b) => a + b);
    return ItemColors[sum % ItemColors.length];
  }
}
