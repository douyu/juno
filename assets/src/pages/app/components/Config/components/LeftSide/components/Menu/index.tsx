import React from 'react';
import styles from './index.less';
import {FullscreenOutlined, FullscreenExitOutlined} from "@ant-design/icons/lib";

export interface MenuProps {
  activeKey: string
  menu: MenuItem[]
  isFullScreen: boolean
  onChange: (key: string) => void
  onFullScreen: (full: boolean) => void
}

export interface MenuItem {
  icon: JSX.Element
  key: string
  label: string
}

/**
 * @param props {activeKey: '', menu: []}
 * @returns {*}
 * @constructor
 */
export function Menu(props: MenuProps) {
  const {activeKey, menu, onChange} = props;

  return (
    <div className={styles.menu}>
      <ul>
        {menu.map(item => {
          return <li
            key={item.key}
            className={activeKey === item.key ? styles.active : null}
            onClick={() => onChange(item.key)}
          >
            {item.icon}
          </li>
        })}
      </ul>

      <div
        onClick={() => {
          props.onFullScreen(!props.isFullScreen)
        }}
        className={styles.btnFullScreen}>
        {props.isFullScreen ?  <FullscreenExitOutlined/> : <FullscreenOutlined/>}
      </div>
    </div>
  );
}
