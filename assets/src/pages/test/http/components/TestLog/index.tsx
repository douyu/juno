import React, {CSSProperties} from 'react';
import ScrollArea from 'react-scrollbar'

interface TestLogProps {
  logs: {
    [key: string]: string
  }
  style?: CSSProperties
}

function TestLog(props: TestLogProps) {
  const {style, logs} = props

  return <ScrollArea style={style}>
    <ul style={{
      margin: 0,
      padding: '10px'
    }}>
      {Object.keys(logs).map(key => {
        return <li key={key}>
          <span style={{fontWeight: 'bolder'}}>{key}</span>: {logs[key]}
        </li>
      })}
    </ul>
  </ScrollArea>
}

export default TestLog
