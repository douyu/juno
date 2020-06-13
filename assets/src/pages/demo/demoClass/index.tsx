import React from 'react';
export interface HomeProps {}

export default class Base extends React.Component<HomeProps, any> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount(): void {}

  componentWillReceiveProps(nextProps: any, nextContext: any) {}

  render() {
    return <div>Hello</div>;
  }
}
