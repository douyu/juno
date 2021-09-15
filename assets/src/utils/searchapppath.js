import { getLocalForageT , setLocalForage } from './localForage';

export function setAppSearch(app, location, cb, cb2) {
  setLocalForage(`appdefaultsearch${location.pathname}`, location.search || '', cb, cb2);
}

export async function getAppSearch(app,pathname) {
  return  await getLocalForageT(`appdefaultsearch${pathname}`);
  }
  