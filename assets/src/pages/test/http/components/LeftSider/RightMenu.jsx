import React from 'react';
import styles from './RightMenu.less';

/**
 * Props Example:
 * menu: [
 * {title: '删除', key: 'delete'}
 * ]
 * onClick: (key, state) => {
 *    // key 是菜单项的Key
 *    // state 是Props中的state
 * }
 */
export default class RightMenu extends React.Component {
  render() {
    const {
      /*菜单类型*/ type,
      visible,
      /*菜单项*/ menu,
      /*会随着onClick返回*/ state,
      onClick,
      onCancel,
      position,
    } = this.props;

    let onClickMenuItem = (key) => {
      if (onClick) {
        onClick(key, state);
      }
    };

    let onMaskClick = () => {
      if (onCancel) onCancel();
    };

    if (!visible) return null;

    return (
      <div className={styles.RightMenu}>
        <div onClick={onMaskClick} className={styles.menuMask}>
          <ul
            style={{
              left: position.x,
              top: position.y,
            }}
            className={styles.menuContainer}
          >
            {menu &&
              menu.map((item, idx) => {
                return (
                  <li
                    onClick={(ev) => {
                      ev.preventDefault();
                      onClickMenuItem(item.key);
                      return false;
                    }}
                    className={styles.menuItem}
                  >
                    {item.title}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}
