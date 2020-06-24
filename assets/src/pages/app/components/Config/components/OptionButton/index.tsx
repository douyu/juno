import React, {CSSProperties} from 'react'
import styles from './index.less'

export enum ButtonType {
  Text = "text",
  Default = "default"
}

export interface OptionButtonProps {
  onClick?: () => void
  title?: string
  style?: CSSProperties
  type?: ButtonType
}

export default function OptionButton(props: React.PropsWithChildren<OptionButtonProps>) {
  let buttonStyle = [styles.optionButton]
  if (props.type === ButtonType.Text) {
    buttonStyle = [...buttonStyle, styles.textBtn]
  } else {
    buttonStyle = [...buttonStyle, styles.defaultBtn]
  }

  return <button
    style={props.style}
    title={props.title}
    className={buttonStyle.join(' ')}
    onClick={props.onClick}
  >
    {props.children}
  </button>
}
