import {Alert, Button, List, message, Spin} from 'antd';
import React, {useEffect, useState} from 'react';
// @ts-ignore
import {history, Link, useModel} from 'umi';
import {getPageQuery} from '@/utils/utils';
import SelectLang from '@/components/SelectLang';
import {accountLogin, LoginParamsType} from '@/services/login';
import LoginFrom from './components/Login';
import {GithubOutlined, GitlabOutlined, GoogleOutlined} from '@ant-design/icons'
import styles from './style.less';
import {connect} from 'dva'
import {Dispatch} from "@@/plugin-dva/connect";
import {ExclamationCircleOutlined, LoginOutlined} from "@ant-design/icons/lib";

var md5 = require('md5');

const {Tab, UserName, Password, Submit} = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let {redirect} = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  history.replace(redirect || '/');
};

const OAuthLoginItems = {
  github: {
    icon: <GithubOutlined/>,
    title: 'GitHub',
  },
  gitlab: {
    icon: <GitlabOutlined/>,
    title: 'GitLab',
  },
  google: {
    icon: <GoogleOutlined/>,
    title: 'Google',
  },
  generic_oauth: {
    icon: <LoginOutlined/>,
    title: 'Generic OAuth'
  }
}

export interface LoginProps {
  configLoading: boolean
  appUrl: string
  authProxyEnabled: boolean
  disableLoginForm: boolean
  oauth: any
  dispatch: Dispatch
}

const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const {configLoading, dispatch, disableLoginForm, oauth} = props
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);

  const {refresh} = useModel('@@initialState');
  const [type, setType] = useState<string>('account');

  useEffect(() => {
    dispatch({
      type: 'system/loadSystemConfig'
    })
  }, [])

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      values.password = md5(values.password);
      const res = await accountLogin({...values, type});
      if (res.code === 0) {
        message.success('登录成功！');
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      } else {
        message.error(res.msg);
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(res);
    } catch (error) {
      message.error('登陆失败，请重试！');
    }
    setSubmitting(false);
  };

  const {code, msg: loginType} = userLoginState;

  const accountLoginTab = <Tab key="account" tab="账户密码登录">
    {code === 1 && loginType === 'account' && !submitting && (
      <LoginMessage content="账户或密码错误（admin/confgo）"/>
    )}

    <UserName
      name="userName"
      placeholder="用户名: admin"
      rules={[
        {
          required: true,
          message: '请输入用户名!',
        },
      ]}
    />
    <Password
      name="password"
      placeholder="密码: admin"
      rules={[
        {
          required: true,
          message: '请输入密码！',
        },
      ]}
    />
    <Submit loading={submitting}>登录</Submit>
  </Tab>

  const oAuthList = Object.keys(oauth).map((key) => {
    const loginItem = OAuthLoginItems[key]
    return <List.Item key={key}>
      <Button
        style={{width: '100%'}}
        onClick={() => {
          window.open(`/api/admin/user/login/${key}`)
        }}
      >
        {loginItem.icon} {loginItem.title}
      </Button>
    </List.Item>
  })

  let loginFromTabs: JSX.Element[] = []

  if (!disableLoginForm) {
    loginFromTabs.push(accountLoginTab)
  } else {
    if (type != '3rd_party') setType('3rd_party')
  }

  loginFromTabs.push(<Tab key={"3rd_party"} tab={"第三方账户登录"}>
    {oAuthList.length > 0 ? <List>
      {oAuthList}
    </List> : <div className={styles.noOAuthLoginChoices}>
      <ExclamationCircleOutlined/> 暂未配置第三方登录
    </div>}
  </Tab>)

  const renderLoginForm = () => {
    if (configLoading) {
      return <div className={styles.configLoading}>
        <Spin tip={"系统配置加载中..."}/>
      </div>
    }

    return <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
      {loginFromTabs}
    </LoginFrom>
  }

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang/>
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <span className={styles.title}>Juno</span>
            </Link>
          </div>
          <div className={styles.desc}>微服务治理平台</div>
        </div>

        <div className={styles.main}>
          {renderLoginForm()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({system}: any) => {
  return {
    configLoading: system.configLoading,
    appUrl: system.appUrl,
    authProxyEnabled: system.authProxyEnabled,
    disableLoginForm: system.disableLoginForm,
    oauth: system.oauth,
  }
}

export default connect(
  mapStateToProps,
)(Login);
