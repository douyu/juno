import React from 'react';
import { AppstoreOutlined, AppstoreAddOutlined, ClusterOutlined } from '@ant-design/icons';
import styles from './index.less';

export interface NumberCardProps {
  style: Object;
  text: any;
  title: string;
  icon: string;
  onClick?: () => void;
}

export default class NumberCard extends React.Component<NumberCardProps> {
  render() {
    const { style = {}, text = '', title = '', icon = 'home' } = this.props;
    return (
      <div className={styles.numberCard} style={style} /*onClick={onClick}*/>
        <div className={styles.wrapper}>
          <div className={styles.body}>
            <div className={styles.content}>{text}</div>
            <div className={styles.title}>{title}</div>
          </div>
          <div className={styles.icon}>
            {icon == 'app' && <AppstoreAddOutlined style={{ color: '#f5a623' }} />}
            {icon == 'node' && <ClusterOutlined style={{ color: '#f5a623' }} />}
          </div>
        </div>
      </div>
    );
  }
}
