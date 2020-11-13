import {FormComponentProps} from "antd/lib/form";

export interface DashboardPropsWithForm extends FormComponentProps, DashboardProps {
}

export interface DashboardProps {
  key: string
  zone_code: string
  onSearch?: (fields: Object) => void
  onReset?: () => void
}

export interface HomeInfoItem {
  zone_code: string
  nodeCount: any
  podCount: any
  appCount: any
}


export interface EventItem {
  color: string
  content: string
  eventType: string
  reason: string
  lastTimestamp: string
  zone_code: string
  podName: string
}
