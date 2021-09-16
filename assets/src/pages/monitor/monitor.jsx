import React, { useRef } from 'react';
import { connect } from 'dva';
// import { useFullscreen } from 'ahooks';
import { Alert, Card, Col, message, Radio, Row, Empty } from 'antd';
import { instanceOf } from 'prop-types';
import { getFrameVersion } from './services';
import { history } from '@@/core/history';
import { GetAppConfig, GetAppViewHistory, PostAppConfig } from '@/services/user';
import GrafanaPannel from './pannel';

const RadioGroup = Radio.Group;

@connect(({ setting }) => ({
  setting,
}))
export default class Monitor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      monitorType: 1,
      dashboardPath: this.props.location.query.dashboardPath,
    };
  }

  componentDidMount() {
    const { userConfig } = this.props;
    const { dashboardPath } = this.state;

    // 加载设置
    this.props.dispatch({
      type: 'setting/loadSettings',
    });
    // setTimeout(()=>{
    //   // var body =  $(this.refs['grafana'].contentDocument).item(0); //获取body对象
    //   // var Astyle =  $(this.refs['grafana'].contentDocument).document.createElement("style");//创建style标签对象
    //   // Astyle.rel = "stylesheet";
    //   // Astyle.type = "text/css";
    //   // Astyle.id = "Astyle";//定义对象的一些属性
    //   // Astyle.value=".sidemenu {display:none;}";//给标签对象赋HTML源代码
    //   // body.appendChild(Astyle);//向body对象中插入style标签对象
    //   // var cssLink = document.createElement("style");
    //   // cssLink.rel = "stylesheet";
    //   // cssLink.type = "text/css";
    //   // cssLink.id = "Astyle";//定义对象的一些属性
    //   // cssLink.value=".sidemenu {display:none;}";//给标签对象赋HTML源代码
    //   // cssLink.href = "style.css";
    //   // cssLink.rel = "stylesheet";
    //   // cssLink.type = "text/css";
    //   // frames['grafana'].document.body.appendChild(cssLink);
    //   // $(this.refs['grafana'].contentDocument).find('head').prepend('<style>sidemenu{display:none;}</style>');
    //   // $(this.refs['grafana'].contentDocument).find('sidemenu').css({'display':'none'});
    //   // $('#grafana-iframe').on('load', event => {
    //   //   // $(this.refs['grafana'].contentDocument).find('head').prepend('<style>.sidemenu{display:none;}</style>');
    //   //   console.log("========iframe1",this.refs['grafana']);
    //   //   // $($('#grafana-iframe sidemenu').iframe.contentDocument).select('sidemenu').css({'display':'none'});
    //   //   $(this.refs['grafana'].contentDocument).find('sidemenu').css({'display':'none'});

    //   // });
    // });
    // 判断url上无dashboardPath字段时，尝试从userConfig上获取（一般只有刷新页面时才会触发此逻辑）
    if (!dashboardPath && userConfig && userConfig.dashboardPath) {
      this.setState({
        dashboardPath: userConfig.dashboardPath,
      });
    }
  }

  monitorTypeTChange = (e) => {
    console.log('============monitorTypeChange', e.target.value);
    const dashboardPath = e.target.value;

    const { version, grafana } = this.props.setting.settings;
    const queryInfo = this.props.location.query;

    console.log('-------settings', this.props.setting.settings);

    if (!version || !grafana) {
      return;
    }

    this.setState(
      {
        dashboardPath,
      },
      () => {
        this.saveUserConfig();
      },
    );

    history.push({
      query: {
        ...queryInfo,
        dashboardPath,
      },
    });
  };

  saveUserConfig() {
    const { aid, versionKey } = this.props;
    const { dashboardPath } = this.state;

    const para = {
      aid,
      config: {
        versionKey,
        dashboardPath,
      },
    };

    PostAppConfig(para).then((res) => {
      if (res.code === 0) {
      } else {
        message.error(res.msg);
      }
    });
  }

  renderGrafana() {
    const { aid, env, appName, zoneCode, versionKey } = this.props;
    const { version } = this.props.setting.settings;

    const { dashboardPath = '' } = this.state;
    return (
      <GrafanaPannel
        {...this.props}
        aid={aid}
        env={env}
        appName={appName}
        zoneCode={zoneCode}
        versionKey={versionKey}
        dashboardPath={dashboardPath}
        version={version}
      />
    );
  }

  render() {
    const { env, versionKey, userConfig } = this.props;

    const { monitorType = 0, dashboardPath } = this.state;

    const { version } = this.props.setting.settings;

    const { dashboards: dashboardList = [] } =
      (Array.isArray(version) && version.find((item) => item.versionKey === versionKey)) || {};

    console.log('监控 --- version', version);
    console.log('监控 --- versionKey', versionKey);
    console.log('>>>>>>>>> this.props.userConfig', userConfig);
    console.log('监控 --- dashboardList', dashboardList);
    console.log('dashboardPath', dashboardPath);
    console.log('this.props.location.query', this.props.location.query);

    if (!env) {
      return (
        <div style={{ marginTop: 10 }}>
          <Alert message="Warning" description="请选择环境." type="warning" showIcon />
        </div>
      );
    }

    return (
      <div style={{ backgroundColor: '#f7f8fa' }}>
        <div
          style={{
            // marginLeft: 10,
            // marginTop: 10,
            // marginRight: 10,
            // marginBottom: 10,
            paddingTop: 5,
            paddingBottom: 5,
            flexDirection: 'column',
            display: 'flex',
            flex: 'auto',
            height: '100%',
          }}
        >
          <Row gutter={24} className="top">
            <Col span={22} style={{ marginLeft: '10px', paddingBottom: '10px' }}>
              {Array.isArray(dashboardList) && dashboardList.length ? (
                <RadioGroup
                  defaultValue={dashboardPath}
                  value={dashboardPath}
                  onChange={this.monitorTypeTChange}
                  optionType="button"
                  buttonStyle="solid"
                >
                  {dashboardList.map((item) => (
                    <Radio.Button key={item.name} value={item.value}>
                      {item.name}
                    </Radio.Button>
                  ))}
                </RadioGroup>
              ) : (
                <span>请在设置界面设置监控面板地址</span>
              )}
            </Col>
          </Row>
          {this.renderGrafana()}
        </div>
      </div>
    );
  }
}
