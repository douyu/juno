import {Component} from 'react'
import {Avatar} from 'antd'
import styles from './style.css'

export default class UserInfo extends Component {
  render() {
    const {name, avatar} = this.props;
    
    return <span>
      <Avatar size="small" src={avatar}>{name}</Avatar>
      <span className={styles.username}>{name}</span>
    </span>
  }
}