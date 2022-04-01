import React from 'react';

export default class GrafanaPage extends React.Component<any, any> {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          height: '800px',
          left: '-24px',
          top: '-24px',
          width: '100vw',
        }}
      >
        <iframe
          src="/grafana/"
          style={{
            border: 'none',
            width: '100%',
            height: 'calc(100vh - 48px)',
          }}
        />
      </div>
    );
  }
}
