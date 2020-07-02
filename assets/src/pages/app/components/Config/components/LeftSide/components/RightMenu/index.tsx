import React from "react"
import {connect} from "dva";
import styles from './index.less'

export interface RightMenuProps {
  rightMenu: RightMenuItem[]
  position: { left: number, top: number }
  visible: boolean
}

export interface RightMenuItem {
  title: string
  key: string
  onClick: (key: string, event: React.MouseEvent) => void
}

function RightMenu(props: RightMenuProps) {
  const {rightMenu, position} = props

  let menuStyle: React.CSSProperties = {
    left: position.left,
    top: position.top,
    display: props.visible ? 'block' : 'none',
  }

  return <div className={styles.rightMenu} style={menuStyle}>
    <ul className={styles.menuList}>
      {rightMenu.map((item) => {
        return <li key={item.key} onClick={ev => item.onClick(item.key, ev)}>
          {item.title}
        </li>
      })}
    </ul>
  </div>
}

const mapStateToProps = ({config}: any) => {
  return {
    currentConfig: config.currentConfig,
    rightMenu: config.rightMenu,
    visible: config.rightMenuVisible,
    position: config.rightMenuPosition
  }
}

export default connect(
  mapStateToProps
)(RightMenu)
