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
  disabled?: boolean
}

export default function OptionButton(props: React.PropsWithChildren<OptionButtonProps>) {
  let buttonStyle = [styles.optionButton]
  if (props.type === ButtonType.Text) {
    buttonStyle = [...buttonStyle, styles.textBtn]
  } else {
    buttonStyle = [...buttonStyle, styles.defaultBtn]
  }

  if (props.disabled) {
    buttonStyle.push(styles.btnDisabled)
  }

  return <button
    style={props.style}
    title={props.title}
    className={buttonStyle.join(' ')}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    {props.children}
  </button>
}
