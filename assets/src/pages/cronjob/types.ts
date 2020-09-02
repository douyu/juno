import {ValueEnumObj} from "@ant-design/pro-table/es/Table";

export const StatusValueEnums: ValueEnumObj = {
  'waiting': {
    status: 'Default',
    text: '未运行',
  },
  'processing': {
    status: "Processing",
    text: '运行中'
  },
  'success': {
    status: "Success",
    text: '成功'
  },
  'failed': {
    status: "Error",
    text: '失败'
  }
}
