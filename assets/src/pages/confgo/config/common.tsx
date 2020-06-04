import { FormComponentProps } from 'antd/lib/form';

export interface CommonProps {
  name: string;
  appName: string;
  zone_code: string;
  namespace: string;
  instanceList: [];
  token: {
    token: string;
    expire: string;
  };
}

export interface CommonPropsWithForm extends CommonProps, FormComponentProps {}
