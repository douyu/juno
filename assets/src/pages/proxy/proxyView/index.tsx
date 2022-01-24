import React from 'react';

export default class Proxy extends React.Component<any, any> {
  render() {
    const { proxyURL } = this.props;
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flex: 1,
        }}
      >
        <iframe
          src={proxyURL}
          style={{
            border: 'none',
            width: '100%',
            flex: 1,
          }}
        />
      </div>
    );
  }
}
