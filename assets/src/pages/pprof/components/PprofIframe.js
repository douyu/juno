import React from 'react';

export default class PprofIframe extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  //this.props.iframepage
  render() {
    const iframeHeight = 690;
    // '../../../../pprof_static/' +
    const imgAddr = '/pprof/' + this.props.iframepage;

    console.log('imgAddr', imgAddr);
    return <iframe src={imgAddr} width="100%" height={iframeHeight} frameBorder="0" />;
  }
}
