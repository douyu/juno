import request from "@/utils/request";
import {stringify} from "qs";

export async function queryUserListWithGroupInfo(page = 0, pageSize = 10, groupName = '', search = '') {
  return request(`/api/admin/permission/user/list?${stringify({
    page,
    page_size: pageSize,
    group_name: groupName,
    search
  })}`)
}

export async function queryUserGroups() {
  return request(`/api/admin/permission/user/group/list`)
}

export async function changeUserGroup(uid: number, groupName: string) {
  return request(`/api/admin/permission/user/changeGroup`, {
    method: 'POST',
    data: {
      uid,
      group_name: groupName
    }
  })
}

export async function loadUserGroupMenuList(groupName: string) {
  return request(`/api/admin/permission/user/group/menuPermission?group_name=${groupName}`)
}

export async function setUserGroupMenuPerm(groupName: string, menu: string[]) {
  return request(`/api/admin/permission/user/group/setMenuPermission`, {
    method: 'POST',
    data: {
      group_name: groupName,
      menu
    }
  })
}

export async function loadUserGroupAPIList(groupName: string) {
  return request(`/api/admin/permission/user/group/apiPermission?group_name=${groupName}`)
}

export async function loadAPITree() {
  return request(`/api/admin/permission/api/list`)
}

export async function setUserGroupAPIPerm(groupName: string, apiList: { path: string, method: string }[]) {
  return request(`/api/admin/permission/user/group/setApiPermission`, {
    method: "POST",
    data: {
      group_name: groupName,
      api_list: apiList
    }
  })
}

export async function appPermissionList() {
  return request(`/api/admin/permission/appPermissions`)
}

export async function setUserGroupAppPerm(payload: { group_name: string, app_name: string, env: string[], action: string[] }) {
  return request(`/api/admin/permission/user/group/setAppPermission`, {
    method: 'POST',
    data: payload
  })
}

export async function fetchPermissionTree() {
  return request(`/api/admin/permission/permissionTree`)
}
