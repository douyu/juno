import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { Link, history, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import SelectLang from '@/components/SelectLang';
import { LoginParamsType, accountLogin } from '@/services/login';
import LoginFrom from './components/Login';
import styles from './style.less';

var md5 = require('md5');

const { Tab, UserName, Password, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
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
  let { redirect } = params as { redirect: string };
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

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');
  const [type, setType] = useState<string>('account');

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      values.password = md5(values.password);
      const res = await accountLogin({ ...values, type });
      if (res.code === 0) {
        message.success('登陆成功！');
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
      console.log(error);
      message.error('登陆失败，请重试！');
    }
    setSubmitting(false);
  };

  const { code, msg: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
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
          <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
            <Tab key="account" tab="账户密码登录">
              {code === 1 && loginType === 'account' && !submitting && (
                <LoginMessage content="账户或密码错误（admin/confgo）" />
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
            </Tab>
            <Submit loading={submitting}>登录</Submit>
            <div className={styles.other}></div>
          </LoginFrom>
        </div>
      </div>
    </div>
  );
};

export default Login;
