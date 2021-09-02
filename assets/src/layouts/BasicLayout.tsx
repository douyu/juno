/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  BasicLayoutProps as ProLayoutProps,
  DefaultFooter,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import React, {useEffect} from 'react';
// @ts-ignore
import {connect, Dispatch, history, Link, useIntl} from 'umi';
import {GithubOutlined} from '@ant-design/icons';
import {Button, Result} from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import {ConnectState} from '@/models/connect';
import {getAuthorityFromRouter} from '@/utils/utils';
import LogoIcon from '../../favicon.png';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  menuData: MenuDataItem[];
}

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 武汉斗鱼科技有限公司`}
    links={[
      {
        key: 'github',
        title: <GithubOutlined/>,
        href: 'https://github.com/douyu/juno',
        blankTarget: true,
      },
      // {
      //   key: 'Ant Design',
      //   title: 'Ant Design',
      //   href: 'https://ant.design',
      //   blankTarget: true,
      // },
    ]}
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    collapsed,
    location = {
      pathname: '/',
    },
    menuData
  } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });

      dispatch({
        type: 'global/fetchMenu'
      })
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const {formatMessage} = useIntl();

  return (
    <ProLayout
      // headerRender={false}
      menuHeaderRender={() => {
        return <div style={{width: '100%', textAlign: 'center'}}>
          <img style={{maxWidth: collapsed ? '30px' : '60px', height: 'auto'}} src={LogoIcon} alt={"juno"}/>
        </div>
      }}
      formatMessage={formatMessage}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({id: 'menu.home'}),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={() => menuData}
      rightContentRender={() => <RightContent/>}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({global, _settings}: ConnectState) => ({
  collapsed: global.collapsed,
  menuData: global.menu,
  settings: _settings,
}))(BasicLayout);
