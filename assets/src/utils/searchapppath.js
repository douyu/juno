import { getLocalForageT, setLocalForage } from './localForage';

export function setAppSearch(app, location, cb, cb2) {
    setLocalForage(`appdefaultsearch${location.pathname}`, location.search || '', cb, cb2);
}
// 按应用名设置历史操作信息（本地存储）
export function setAppSearchByAppName(app, location, cb, cb2) {
    setLocalForage(`appdefaultsearch-${app}-${location.pathname}`, location.search || '', cb, cb2);
}

export async function getAppSearch(app, pathname) {
    return await getLocalForageT(`appdefaultsearch${pathname}`);
}
// 按应用获取历史操作信息（本地存储）
export async function getAppSearchByAppName(app, pathname) {
    return await getLocalForageT(`appdefaultsearch-${app}-${pathname}`);
}