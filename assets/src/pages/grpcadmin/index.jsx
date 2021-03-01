import React, { PureComponent } from 'react';
import View from "./rpc";
import {connect} from "dva";
import {Card} from "antd";
import AppHeader from "./components/Header"
import {routerRedux} from "dva/router";

@connect(({ monitorModel, loading}) => ({
  appIdcList: [],

}))
export default class MonitorIndex extends PureComponent {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
  }


  getAppInfo = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: "monitorModel/getAppInfo",
      payload: {
        appName: value,
      },
    });
  };

  setEnv = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: "monitorModel/setEnv",
      payload: {
        env: value,
      },
    });
  };

  setIdcCode = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: "monitorModel/setIdcCode",
      payload: {
        idcCode: value,
      },
    });
  };

  render() {
    const {appName,appInfo, version, appIdcList } = this.props;
    const {env, idcCode} = this.props;
    let view = null;
    view = (<View
      appName={appName}
      appInfo={appInfo}
      appIdcList={appIdcList}
      env={env}
      idcCode={idcCode}
    />);

    return <Card>
      {/*<AppHeader*/}
      {/*  appInfo={appInfo}*/}
      {/*  appIdcList={appIdcList}*/}
      {/*  env={env}*/}
      {/*  idcCode={idcCode}*/}
      {/*/>*/}
      {view}
    </Card>;
  }
}
