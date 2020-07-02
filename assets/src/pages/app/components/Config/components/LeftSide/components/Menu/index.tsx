import React from 'react';
import styles from './index.less';

export interface MenuProps {
  activeKey: string
  menu: MenuItem[]
  onChange: (key: string) => void
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
    <ul className={styles.menu}>
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
  );
}
