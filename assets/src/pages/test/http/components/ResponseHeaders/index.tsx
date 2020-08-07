import React, {CSSProperties} from "react";
import Scroll from 'react-scrollbar'

interface ResponseHeadersProps {
  headers: {
    [key: string]: string[]
  }
  style?: CSSProperties
}

function ResponseHeaders(props: ResponseHeadersProps) {
  const {headers, style = {}} = props
  return <Scroll
    style={{
      ...style
    }}>
    <ul
      style={{
        margin: 0,
        padding: '10px'
      }}>
      {Object.keys(headers).map(key => {
        return <li key={key}>
          <span style={{fontWeight: 'bolder'}}>{key}</span>: {headers[key].join("; ")}
        </li>
      })}
    </ul>
  </Scroll>
}

export default ResponseHeaders
