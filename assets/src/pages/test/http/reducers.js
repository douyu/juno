export default {
  _setCurrentRequest(state, { payload }) {
    return {
      ...state,
      currentRequest: payload,
      currentRequestID: payload.id,
    };
  },
  _updateCurrentRequest(state, { payload }) {
    let currentRequest = {
      ...state.currentRequest,
      ...payload,
    };
    return {
      ...state,
      currentRequest,
    };
  },
  _setResponse(state, { payload }) {
    let response = payload.response;
    if (response && response.headers && response.headers['Content-Type']) {
      let contentType = response.headers && response.headers['Content-Type'];
      if (contentType && contentType[0].startsWith('application/json')) {
        let data = response.body;
        try {
          data = JSON.parse(data);
          data = JSON.stringify(data, null, 2);
          response.body = data;
        } catch (e) {
          console.log(e);
        }
      }
      payload.response = response;
    }
    return {
      ...state,
      response: payload.response,
      responseStatus: payload.status,
      responseError: payload.error,
      sendStatus: 'done',
    };
  },
  _setFolderTree(state, { payload }) {
    return {
      ...state,
      folderTree: payload,
    };
  },
  _setHistory(state, { payload }) {
    const { pagination, list } = payload;
    let history = list || [];
    if (pagination.current > 0) {
      history = [...(state.history || []), ...history];
    } else {
      history = list;
    }

    return {
      ...state,
      history: history,
      historyPagination: pagination,
      historyLoading: false,
    };
  },
  _setSendStatus(state, { payload }) {
    return {
      ...state,
      sendStatus: payload,
    };
  },
  _apply(state, { payload }) {
    return {
      ...state,
      ...payload,
    };
  },
};
