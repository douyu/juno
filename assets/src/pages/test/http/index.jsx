import React from 'react';
import {Button, Tabs, Icon, Input, Layout, Select, Form, Tag, Spin, message, Card, Empty} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import LeftSider from "./components/LeftSider";
import NewTestCaseModal from "./components/LeftSider/NewTestCaseModal";
import {createRequest} from "@/services/httptest";
import Editor from "@/pages/test/http/editor";
import {routerRedux} from "dva/router";
import {stringify} from "qs";

@connect(({HttpDebug, app}) => ({
  model: HttpDebug,
  nameEditing: HttpDebug.nameEditing,
  appList: app.list,
  currentAppName: HttpDebug.currentAppName,
  collections: HttpDebug.collections,
  currentRequestLoading: HttpDebug.currentRequestLoading,
  request: HttpDebug.currentRequest
}))
export default class HttpTestPage extends React.Component {

  form = React.createRef()

  state = {
    params: [],
    headers: [],
    nameEditing: false,
    name: 'Read User List',
    modalNewRequestVisible: false
  };

  componentDidMount() {
    const {appName} = this.props.location.query
    appName && this.onSelectApp(appName)

    this.loadHistory();
    this.loadAppList();
  }

  loadCollections = appName => {
    const {dispatch} = this.props
    dispatch({
      type: 'HttpDebug/fetchCollections',
      payload: {
        appName
      }
    })
  }

  onSelectApp = (appName) => {
    const {dispatch} = this.props;
    const {query} = this.props.location

    this.loadCollections(appName)

    dispatch({
      type: 'HttpDebug/setCurrentApp',
      payload: appName
    })

    dispatch(routerRedux.push({
      search: stringify({
        ...query,
        appName: appName
      })
    }));

    dispatch({
      type: 'HttpDebug/fetchAppHttpAddrList',
      payload: appName
    })
  }

  loadAppList = () => {
    const {dispatch, currentAppName} = this.props
    return dispatch({
      type: 'app/fetch',
      payload: {
        page: 0,
        pageSize: 5000
      }
    })
  }

  onSend = () => {
    const {dispatch, model} = this.props;
    dispatch({
      type: 'HttpDebug/sendRequest',
      payload: model.currentRequest
    });
  };

  onSave = () => {
    const {dispatch, model} = this.props;
    if (!model.currentRequestID) {
      // 未保存的Request，打开窗口进行新建
      this.setState({
        modalNewRequestVisible: true
      })
    } else {
      dispatch({
        type: 'HttpDebug/updateRequest',
        payload: model.currentRequest,
      }).then(res => {
        this.loadFolderTree();
      });
    }
  };


  loadHistory = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'HttpDebug/loadHistory',
    });
  };

  onCreateNewRequest = (fields) => {
    // 新建Request
    const {dispatch} = this.props;
    const {name, parentFolder, ...restFields} = fields;
    const request = this.props.model.currentRequest;
    createRequest(name, parentFolder, {
      ...request,
      ...restFields
    }).then(r => {
      if (r.code !== 0) {
        // 失败
        message.error(r.msg);
      } else {
        this.setState({
          modalNewRequestVisible: false
        });
        // 加载列表
        this.loadFolderTree();
        // 加载新建的request
        dispatch({
          type: 'HttpDebug/loadTestCase',
          payload: {
            id: r.data.requestID,
          }
        }).then(res => {
          if (res.code !== 0) {
            message.error("加载请求失败:" + res.msg);
          }
        })
      }
    });
  };

  render() {
    const {modalNewRequestVisible} = this.state;
    const {appList, request, currentAppName, currentRequestLoading} = this.props;

    return <div className={styles.httpDebugPage}>
      <div className={styles.header}>
        <Select
          style={{width: '280px'}}
          placeholder={"请选择应用"}
          onSelect={this.onSelectApp}
          value={currentAppName}
          showSearch
        >
          {(appList || []).map(item => <Select.Option value={item.app_name} key={item.app_name}>
            {item.app_name}
          </Select.Option>)}
        </Select>
      </div>

      {
        currentAppName ? <div className={styles.main}>
          <div className={styles.leftSider}>
            <LeftSider {...this.props}/>
          </div>

          <Spin tip={"加载中"} spinning={currentRequestLoading}>
            {request ? <Editor/>
              : <Empty
                description={"请先选择测试用例"}
                style={{padding: '100px'}}
              />}
          </Spin>
        </div> : <Empty
          description={"请先选择应用"}
          style={{margin: '0', padding: '100px', backgroundColor: "#fff"}}
        />
      }

      <NewTestCaseModal
        visible={modalNewRequestVisible}
        onOk={this.onCreateNewRequest}
        onCancel={() => {
          this.setState({
            modalNewRequestVisible: false
          })
        }}
      />
    </div>
  }
}
