import { getApi, postApi } from '../api';
import * as types from '../constants/auditLogs';
import errors from '../errors';

// Fetch All Audit Logs
export const fetchAuditLogsRequest = () => {
  return {
    type: types.FETCH_AUDITLOGS_REQUEST
  };
};

export const fetchAuditLogsSuccess = auditLogs => {
  return {
    type: types.FETCH_AUDITLOGS_SUCCESS,
    payload: auditLogs
  };
};

export const fetchAuditLogsError = error => {
  return {
    type: types.FETCH_AUDITLOGS_FAILURE,
    payload: error
  };
};

export const fetchAuditLogs = (skip, limit) => async dispatch => {
  skip = skip ? parseInt(skip) : 0;
  limit = limit ? parseInt(limit) : 10;

  dispatch(fetchAuditLogsRequest());

  try {
    const response = await getApi(
      `auditLogs/allAuditLogs?skip=${skip}&limit=${limit}`
    );
    const data = response.data;

    dispatch(fetchAuditLogsSuccess(data));

    return response;
  } catch (error) {
    let errorMsg;
    if (error && error.response && error.response.data)
      errorMsg = error.response.data;
    if (error && error.data) {
      errorMsg = error.data;
    }
    if (error && error.message) {
      errorMsg = error.message;
    } else {
      errorMsg = 'Network Error';
    }
    dispatch(fetchAuditLogsError(errors(errorMsg)));
  }
};

// Search Audit Logs.
export const searchAuditLogsRequest = () => {
  return {
    type: types.SEARCH_AUDITLOGS_REQUEST
  };
};

export const searchAuditLogsSuccess = auditLogs => {
  return {
    type: types.SEARCH_AUDITLOGS_SUCCESS,
    payload: auditLogs
  };
};

export const searchAuditLogsError = error => {
  return {
    type: types.SEARCH_AUDITLOGS_FAILURE,
    payload: error
  };
};

export const searchAuditLogs = (filter, skip, limit) => async dispatch => {
  const values = {
    filter
  };

  dispatch(searchAuditLogsRequest());

  try {
    const response = await postApi(
      `auditLogs/search?skip=${skip}&limit=${limit}`,
      values
    );
    const data = response.data;

    dispatch(searchAuditLogsSuccess(data));
    return response;
  } catch (error) {
    let errorMsg;
    if (error && error.response && error.response.data)
      errorMsg = error.response.data;
    if (error && error.data) {
      errorMsg = error.data;
    }
    if (error && error.message) {
      errorMsg = error.message;
    } else {
      errorMsg = 'Network Error';
    }
    dispatch(searchAuditLogsError(errors(errorMsg)));
  }
};
