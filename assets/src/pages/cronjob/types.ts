import {ValueEnumObj} from "@ant-design/pro-table/es/Table";

export const StatusValueEnums: ValueEnumObj = {
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
