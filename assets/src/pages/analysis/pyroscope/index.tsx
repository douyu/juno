import React from 'react';

export default class Pyroscope extends React.Component<any, any> {
  render() {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flex: 1,
        }}
      >
        <iframe
          src="/proxy/pyroscope/"
          style={{
            border: 'none',
            width: '100%',
            flex: 1,
            // height: 'calc(100vh - 48px)'
          }}
        />
      </div>
    );
  }
}
