export default {
  _setZoneList(state, {payload}) {
    return {
      ...state,
      zoneList: payload || []
    }
  },
  _apply(state, {payload}) {
    return {
      ...state,
      ...payload
    }
  },
  _setCurrentConfigContent(state, {payload}) {
    let currentConfig = {
      ...state.currentConfig,
      content: payload
    }
    return {
      ...state,
      currentConfig
    }
  }
}
