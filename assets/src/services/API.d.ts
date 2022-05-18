declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    username?: string;
    title?: string;
    group?: string;
    signature?: string;
    data: any;
    tags?: {
      key: string;
      label: string;
    }[];
    uid?: number;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    code?: number;
    msg?: string;
  }
}

declare namespace Resource {
  export interface Node {
    id: number;
    host_name?: string;
    ip?: string;
    create_time?: number;
    update_time?: number;
    heartbeat_time?: number;
    env?: string;
    region_code?: string;
    region_name?: string;
    zone_code?: string;
    zone_name?: string;
    node_type?: number;
    agent_type?: number;
    agent_version?: string;
  }

  export interface Transfer {
    target: any[];
    zone_id: number;
  }
}
