import React from 'react';
import styles from './RequestItem.less';
import {connect} from "dva";

const MethodColor = {
  POST: '#FFB400',
  GET: '#249C47',
  DELETE: '#D51D11',
  PUT: '#0763C0',
  PATCH: '#666666'
};

const DefaultColor = 'gray';

export function getMethodColor(method) {
  method = method.toUpperCase();
  return MethodColor[method] || DefaultColor;
}

export function getSimpleMethodName(method) {
  return {
    DELETE: 'DEL'
  }[method] || method;
}

function RequestItem(props) {
  const style = props.style || {};
  const {method, title, dispatch, id} = props;

  return <div
    className={styles.RequestItem}
    onClick={() => {
      dispatch({
        type: 'HttpDebug/loadHistoryDetail',
        payload: id
      })
    }}
    style={{
      ...style
    }}>
    <span className={styles.method} style={{color: getMethodColor(method)}}>
      {getSimpleMethodName(method)}
    </span>
    <span className={styles.title}>{title}</span>
  </div>
}

export default connect()(RequestItem)
