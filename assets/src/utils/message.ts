import { message as antMessage } from 'antd';

interface Response {
  code: number;
  msg: string;
}

export const message = {
  info: (res: Response) => {
    if (res.code === 0 || res.code === 14000) return;
    return antMessage.info(res.msg);
  },
  success: (res: Response) => {
    if (res.code === 0 || res.code === 14000) return;
    return antMessage.success(res.msg);
  },
  error: (res: Response) => {
    console.log(res);
    if (res.code === 0 || res.code === 14000) return;
    return antMessage.error(res.msg);
  },
  warn: (res: Response) => {
    if (res.code === 0 || res.code === 14000) return;
    return antMessage.warn(res.msg);
  },
  warning: (res: Response) => {
    if (res.code === 0 || res.code === 14000) return;
    return antMessage.warning(res.msg);
  },
  loading: (res: Response) => {
    if (res.code === 0 || res.code === 14000) return;
    return antMessage.loading(res.msg);
  },
};
