import React from 'react';
import {Radio} from 'antd';
import KeyValueEditor from "../KeyValueEditor";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/duotone-light.css';
import './index.less';
import {connect} from "dva";

const BodyTypes = [
  {
    name: 'form-data',
    editorType: 'keyValue',
    value: 'multipart/form-data'
  },
  {
    name: 'x-www-form-urlencoded',
    editorType: 'keyValue',
    value: 'application/x-www-form-urlencoded'
  },
  {
    name: 'json',
    editorType: 'text',
    value: 'application/json'
  },
];

function BodyTabPane(props) {
  const {currentRequest, dispatch} = props

  const onFieldChange = (fields) => {
    dispatch({
      type: 'HttpDebug/updateCurrentRequest',
      payload: {
        ...fields
      }
    })
  };

  const renderEditor = (type) => {
    let {body} = currentRequest;
    let bodyType = BodyTypes.find(item => item.value === type)

    if (!bodyType) return

    if (bodyType.editorType === 'keyValue') {
      if (!(body instanceof Array)) {
        try {
          body = JSON.parse(body)
          if (!(body instanceof Array)) body = []
        } catch (e) {
          body = []
        }
      }

      return <KeyValueEditor
        data={body}
        onChange={(data) => {
          onFieldChange({body: data})
        }}/>
    } else if (bodyType.editorType === 'text') {
      if (typeof body !== 'string') {
        try {
          body = JSON.stringify(body)
        } catch (e) {
          body = ""
        }
      }

      return <div>
        <CodeMirror
          value={body}
          className={"bodyEditor"}
          onChange={(e, d, val) => {
            onFieldChange({body: val})
          }}
          autoCursor={false}
          options={{
            mode: 'javascript',
            theme: 'duotone-light',
            lineNumbers: true
          }}/>
      </div>
    }
  }

  const {content_type} = currentRequest;
  if (!content_type) {
    onFieldChange({content_type: 'form-data'})
  }

  return (
    <div>
      <div style={{padding: '0 10px 10px 10px'}}>
        <Radio.Group
          value={content_type}
          onChange={(ev) => {
            let content_type = ev.target.value;
            onFieldChange({content_type})
          }}>
          {BodyTypes.map((item, idx) => {
            return <Radio key={idx} value={item.value}>{item.name}</Radio>
          })}
        </Radio.Group>
      </div>
      <div>
        {renderEditor(content_type)}
      </div>
    </div>
  );
}


export default connect(({HttpDebug}) => {
  return {
    currentRequest: HttpDebug.currentRequest
  }
})(BodyTabPane)
