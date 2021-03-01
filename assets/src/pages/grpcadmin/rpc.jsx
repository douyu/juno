import React from 'react';
import {
  Table,
  Badge,
  Button,
  Modal,
  Spin,
  message,
  Tooltip,
  Icon,
  Tabs,
  Tag,
  Popconfirm,
  Input,
  Switch,
  Alert
} from 'antd'
const confirm = Modal.confirm;
import moment from 'moment';
import { configuratorsUpdate } from "@/services/grpcadmin";
import {connect} from "dva";
import {routerRedux} from "dva/router";


@connect(({ providerModel }) => ({
  listAggData: providerModel.listAggData
}))

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 治理信息是否可见
      governVisible: false,
      governText: "",
      // 操作里,显示提供者详细信息
      infoVisible: false,
      editRegKey:'',
      editGroup:'',
      editWeight:100,
      editRegEnable:"false",

      appName:props.appName,
      mode:props.mode,
      idcCode:props.idcCode,
    };
  }

  componentDidMount() {
    //获取节点信息
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // 说明已经传了数据
    if (nextProps.idcCode === "" || nextProps.appName === "" || nextProps.mode === "") {
      return
    }
    const { idcCode, appName, mode,env } = this.state

    // 内容一样就不在渲染
    if (nextProps.idcCode === idcCode && nextProps.appName === appName && nextProps.mode === mode && nextProps.env === env ) {
      return
    }
    // 一定要同步
    this.setState({
      idcCode: nextProps.idcCode,
      appName: nextProps.appName,
      mode: nextProps.mode,
      env: nextProps.env,
    },() => {
      this.getList()
    })
  }

  //获取节点状态
  getList = () => {
    const {appName, idcCode, env } = this.state;
    this.props.dispatch({
      type: "providerModel/fetchAggregationList",
      payload: { appName,env,idcCode}
    });
  };


  //更新治理键
  governUpdate = ({regKey,enable,weight,group})=>{
    const {appName,idcCode, env} = this.state;

    configuratorsUpdate({idcCode,appName,regKey,enable,weight,group, env}).then(rs=>{
      const {code,msg} = rs;
      if (code === 0) {
        message.success("配置成功");
        this.getList();
      }else {
        message.error("配置失败:"+msg);
      }
    })
  };

  render() {
    const that = this;
    let {idcCode,editRegKey,editRegEnable,editWeight,editGroup, env} = this.state;
    const { appIdcList = [], listAggData } = this.props;
    const grpcCols = [
    //   {
    //   title:'节点',
    //   render(t,r){
    //     const { aggregation : { labels: {hostname} } } = r;
    //     let url = '/app_platform/machine/'+hostname;
    //     return <p><a href={url} target="_blank">{hostname}</a></p>
    //   }
    // },
      {
      title:'注册键',
      render(t,r){
        const { aggregation : { regKey } } = r;
        return regKey
      }
    },
    //   {
    //   title:'可用区',
    //   render(t,r){
    //     const { aggregation : { labels: {region} } } = r;
    //     return region
    //   }
    // },
      {
      title:'状态',
      render(t,r){
        const { aggregation : { regKey, labels:{enable} } } = r;
        if (editRegKey === regKey) {
          return <Switch defaultChecked={enable==="true"} onChange={e=>{
            that.setState({
              editRegEnable: e
            })
          }}/>
        }
        if (enable === "true") {
          return <Tag color={'#87d068'}>已启用</Tag>
        }
        return <Tag color={'#f50'}>已禁用</Tag>
      }
    },
    //   {
    //   title:'权重',
    //   render(t,r){
    //     const { aggregation : { regKey, labels:{weight} } } = r;
    //     if (editRegKey === regKey) {
    //       return <Input defaultValue={weight} onChange={e=>{
    //         that.setState({
    //           editWeight: e.target.value
    //         })
    //       }}/>
    //     }
    //     return weight
    //   }
    // },
    //   {
    //   title:'分组',
    //   render(t,r){
    //     const { aggregation : { regKey, labels:{group} } } = r;
    //     if (editRegKey === regKey) {
    //       return <Input defaultValue={group} onChange={e=>{
    //         that.setState({
    //           editGroup: e.target.value
    //         })
    //       }}/>
    //     }
    //     return group
    //   }
    // },
    //   {
    //   title:'程序版本',
    //   render(t,r){
    //     const { aggregation : { labels:{vcsInfo} } } = r;
    //     return vcsInfo
    //   }
    // },
    //   {
    //   title:'启动时间',
    //   render(t,r){
    //     const { aggregation : { labels:{startTs} } } = r;
    //     return moment(startTs*1000).format('YYYY/MM/DD HH:mm:ss')
    //   }
    // },
      {
      title:'操作',
      key:'op',
      dataIndex:'op',
      render(t,r) {
        const { aggregation : { regKey, labels:{weight,enable,group} } } = r;
        if (editRegKey !== '' && editRegKey === regKey) {
          //保存取消
          return (
            <div>
              <Button.Group>
                <Button
                  onClick={e => {
                    that.governUpdate({regKey,enable:editRegEnable.toString(),weight:editWeight,group:editGroup});
                    that.setState({
                      editRegKey: '',
                    });
                  }}
                >
                  保存
                </Button>
                <Button
                  onClick={e => {
                    that.setState({
                      editRegKey: '',
                    });
                  }}
                >
                  取消
                </Button>
              </Button.Group>
            </div>
          );
        }

        return (
          <div>
            <Button.Group>
              {/*<Button*/}
              {/*  onClick={e => {*/}
              {/*    that.setState({*/}
              {/*      editRegKey: regKey,*/}
              {/*      editRegEnable: enable,*/}
              {/*      editWeight: weight,*/}
              {/*      editGroup: group,*/}
              {/*    });*/}
              {/*  }}*/}
              {/*  style={{color:'#1890FF'}}*/}
              {/*><Icon type="edit"/>*/}
              {/*  编辑*/}
              {/*</Button>*/}
              {/*<Popconfirm*/}
              {/*  title={'是否加倍?'}*/}
              {/*  onConfirm={() => {*/}
              {/*    that.governUpdate({regKey,enable,weight:weight*2,group})*/}
              {/*  }}*/}
              {/*  okText={'确认'}*/}
              {/*  cancelText={'取消'}*/}
              {/*>*/}
              {/*  <Button style={{color:'#1890FF'}}><Icon type="arrow-up"/>倍权</Button>*/}
              {/*</Popconfirm>*/}
              {/*<Popconfirm*/}
              {/*  title={'是否减半?'}*/}
              {/*  onConfirm={() => {*/}
              {/*    that.governUpdate({regKey,enable,weight:Math.floor(weight/2),group})*/}
              {/*  }}*/}
              {/*  okText={'确认'}*/}
              {/*  cancelText={'取消'}*/}
              {/*>*/}
              {/*  <Button style={{color:'#1890FF'}}><Icon type="arrow-down"/>半权</Button>*/}
              {/*</Popconfirm>*/}
              {enable === "true" && (
                <Popconfirm
                  title={'是否禁用?'}
                  onConfirm={() => {
                    that.governUpdate({regKey,enable:"false",weight,group})
                  }}
                  okText={'确认'}
                  cancelText={'取消'}
                >
                  <Button style={{color:'#1890FF'}}><Icon type="stop"/>禁用</Button>
                </Popconfirm>
              )}
              {enable === "false" && (
                <Popconfirm
                  title={'是否启用?'}
                  onConfirm={() => {
                    that.governUpdate({regKey,enable:"true",weight,group})
                  }}
                  okText={'确认'}
                  cancelText={'取消'}
                >
                  <Button style={{color:'#1890FF'}}><Icon type="check-circle"/>启用</Button>
                </Popconfirm>
              )}
            </Button.Group>
          </div>)
      }
    }];

    if (env === "" || idcCode===""){
      return (
        <div style={{marginTop:10}}>
          <Alert
            message="Warning"
            description="选择环境、机房."
            type="warning"
            showIcon
          />
        </div>
      )
    }

    return <div style={{backgroundColor:'white',paddingLeft: '8px'}}>

                  <h3>服务信息</h3>
                  <Table columns={grpcCols} dataSource={listAggData}/>
                </div>
  }
}
