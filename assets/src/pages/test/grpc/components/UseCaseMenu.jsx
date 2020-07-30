import React, {useEffect, useState} from 'react';
import styles from './UseCaseMenu.less';
import {useMouse} from "ahooks";
import ReactDom from 'react-dom'

function _UseCaseMenu(props) {
  const mouse = useMouse()
  const {visible, menu = [], onClose} = props
  const [pos, setPos] = useState({x: 0, y: 0})

  useEffect(() => {
    if (visible) {
      setPos({
        x: mouse.clientX,
        y: mouse.clientY
      })
    }
  }, [visible])

  return visible ? (
    <div className={styles.menuContainer}>
      <div className={styles.menuMask} onClick={onClose}/>
      <div className={styles.rightMenuBox} style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`
      }}>
        <ul className={styles.menuList}>
          {(menu || []).map((item, idx) => {
            return <li className={styles.menuItem} key={idx} onClick={() => {
              onClose();
              item.onClick();
            }}>
              {item.icon}
              <span className={styles.menuText}>{item.label}</span>
            </li>
          })}
        </ul>
      </div>
    </div>
  ) : null
}

class UseCaseMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      menu: []
    }
  }

  show = (menu) => {
    this.setState({
      visible: true,
      menu,
    })
  }

  render() {
    const {visible, menu} = this.state

    return <_UseCaseMenu
      visible={visible}
      menu={menu}
      onClose={() => {
        this.setState({
          visible: false
        })
      }}
    />
  }
}

let ele = React.createElement(
  UseCaseMenu,
)

let container = document.createElement("div")
document.body.appendChild(container)

export default ReactDom.render(
  ele,
  container
)
