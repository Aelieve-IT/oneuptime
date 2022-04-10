import BackendAPI from 'common-ui/src/utils/api/backend';
import { Dispatch } from 'redux';
import * as types from '../constants/performanceTracker';
import { encode } from 'js-base64';
import ErrorPayload from 'common-ui/src/payload-types/error';
export const setStartDate = (date: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        dispatch({
            type: 'SET_START_DATE',
            payload: date,
        });
    };
};

export const setEndDate = (date: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        dispatch({
            type: 'SET_END_DATE',
            payload: date,
        });
    };
};

// create performance tracker
export const createPerformanceTrackerRequest = () => ({
    type: types.CREATE_PERFORMANCE_TRACKER_REQUEST,
});

export const createPerformanceTrackerSuccess = (payload: $TSFixMe) => ({
    type: types.CREATE_PERFORMANCE_TRACKER_SUCCESS,
    payload,
});

export const createPerformanceTrackerFailure = (error: ErrorPayload) => ({
    type: types.CREATE_PERFORMANCE_TRACKER_FAILURE,
    payload: error,
});

export const createPerformanceTrackerReset = () => ({
    type: types.CREATE_PERFORMANCE_TRACKER_RESET,
});

export const createPerformanceTracker =
    ({ projectId, componentId, values }: $TSFixMe) =>
    (dispatch: Dispatch) => {
        dispatch(createPerformanceTrackerRequest());
        const promise = BackendAPI.post(
            `performanceTracker/${projectId}/${componentId}/create`,
            values
        );

        promise.then(
            function (response) {
                dispatch(createPerformanceTrackerSuccess(response.data));
            },
            function (error) {
                const errorMsg =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(createPerformanceTrackerFailure(errorMsg));
            }
        );

        return promise;
    };

// fetch a single performance tracker
export const fetchPerformanceTrackerRequest = () => ({
    type: types.FETCH_PERFORMANCE_TRACKER_REQUEST,
});

export const fetchPerformanceTrackerSuccess = (payload: $TSFixMe) => ({
    type: types.FETCH_PERFORMANCE_TRACKER_SUCCESS,
    payload,
});

export const fetchPerformanceTrackerFailure = (error: ErrorPayload) => ({
    type: types.FETCH_PERFORMANCE_TRACKER_FAILURE,
    payload: error,
});

export const fetchPerformanceTrackerReset = () => ({
    type: types.FETCH_PERFORMANCE_TRACKER_RESET,
});

export const fetchPerformanceTracker =
    ({ projectId, performanceTrackerId, slug }: $TSFixMe) =>
    (dispatch: Dispatch) => {
        dispatch(fetchPerformanceTrackerRequest());
        const promise = BackendAPI.get(
            `performanceTracker/${projectId}/tracker/${performanceTrackerId}?slug=${slug}`
        );

        promise.then(
            function (response) {
                dispatch(fetchPerformanceTrackerSuccess(response.data));
            },
            function (error) {
                const errorMsg =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(fetchPerformanceTrackerFailure(errorMsg));
            }
        );

        return promise;
    };

// fetch performance tracker list
export const fetchPerformanceTrackersRequest = (fetchingPage: $TSFixMe) => ({
    type: types.FETCH_PERFORMANCE_TRACKERS_REQUEST,
    payload: fetchingPage,
});

export const fetchPerformanceTrackersSuccess = (payload: $TSFixMe) => ({
    type: types.FETCH_PERFORMANCE_TRACKERS_SUCCESS,
    payload,
});

export const fetchPerformanceTrackersFailure = (error: ErrorPayload) => ({
    type: types.FETCH_PERFORMANCE_TRACKERS_FAILURE,
    payload: error,
});

export const fetchPerformanceTrackersReset = () => ({
    type: types.FETCH_PERFORMANCE_TRACKERS_RESET,
});

export const fetchPerformanceTrackers =
    ({
        projectId,
        componentId,
        skip = 0,
        limit = 0,
        fetchingPage = false,
    }: $TSFixMe) =>
    (dispatch: Dispatch) => {
        dispatch(fetchPerformanceTrackersRequest(fetchingPage));
        const promise = BackendAPI.get(
            `performanceTracker/${projectId}/${componentId}?skip=${skip}&limit=${limit}`
        );

        promise.then(
            function (response) {
                dispatch(fetchPerformanceTrackersSuccess(response.data));
            },
            function (error) {
                const errorMsg =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(fetchPerformanceTrackersFailure(errorMsg));
            }
        );

        return promise;
    };

// update performance tracker
export const updatePerformanceTrackerRequest = () => ({
    type: types.UPDATE_PERFORMANCE_TRACKER_REQUEST,
});

export const updatePerformanceTrackerSuccess = (payload: $TSFixMe) => ({
    type: types.UPDATE_PERFORMANCE_TRACKER_SUCCESS,
    payload,
});

export const updatePerformanceTrackerFailure = (error: ErrorPayload) => ({
    type: types.UPDATE_PERFORMANCE_TRACKER_FAILURE,
    payload: error,
});

export const updatePerformanceTrackerReset = () => ({
    type: types.UPDATE_PERFORMANCE_TRACKER_RESET,
});

export const updatePerformanceTracker =
    ({ projectId, componentId, performanceTrackerId, values }: $TSFixMe) =>
    (dispatch: Dispatch) => {
        dispatch(updatePerformanceTrackerRequest());
        const promise = BackendAPI.put(
            `performanceTracker/${projectId}/${componentId}/update-tracker/${performanceTrackerId}`,
            values
        );

        promise.then(
            function (response) {
                dispatch(updatePerformanceTrackerSuccess(response.data));
            },
            function (error) {
                const errorMsg =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(updatePerformanceTrackerFailure(errorMsg));
            }
        );

        return promise;
    };

// delete performance tracker
export const deletePerformanceTrackerRequest = () => ({
    type: types.DELETE_PERFORMANCE_TRACKER_REQUEST,
});

export const deletePerformanceTrackerSuccess = (payload: $TSFixMe) => ({
    type: types.DELETE_PERFORMANCE_TRACKER_SUCCESS,
    payload,
});

export const deletePerformanceTrackerFailure = (error: ErrorPayload) => ({
    type: types.DELETE_PERFORMANCE_TRACKER_FAILURE,
    payload: error,
});

export const deletePerformanceTrackerReset = () => ({
    type: types.DELETE_PERFORMANCE_TRACKER_RESET,
});

export const deletePerformanceTracker =
    ({ projectId, performanceTrackerId }: $TSFixMe) =>
    (dispatch: Dispatch) => {
        dispatch(deletePerformanceTrackerRequest());

        const promise =
            delete `performanceTracker/${projectId}/tracker/${performanceTrackerId}`;

        promise.then(
            function (response) {
                dispatch(deletePerformanceTrackerSuccess(response.data));
            },
            function (error) {
                const errorMsg =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(deletePerformanceTrackerFailure(errorMsg));
            }
        );

        return promise;
    };

// reset performance tracker api key
export const resetPerformanceTrackerKeyRequest = () => ({
    type: types.RESET_PERFORMANCE_TRACKER_KEY_REQUEST,
});

export const resetPerformanceTrackerKeySuccess = (payload: $TSFixMe) => ({
    type: types.RESET_PERFORMANCE_TRACKER_KEY_SUCCESS,
    payload,
});

export const resetPerformanceTrackerKeyFailure = (error: ErrorPayload) => ({
    type: types.RESET_PERFORMANCE_TRACKER_KEY_FAILURE,
    payload: error,
});

export const resetPerformanceTrackerKeyReset = () => ({
    type: types.RESET_PERFORMANCE_TRACKER_KEY_RESET,
});

export const resetPerformanceTrackerKey =
    ({ projectId, performanceTrackerId }: $TSFixMe) =>
    (dispatch: Dispatch) => {
        dispatch(resetPerformanceTrackerKeyRequest());
        const promise = BackendAPI.put(
            `performanceTracker/${projectId}/reset-key/${performanceTrackerId}`,
            {}
        );

        promise.then(
            function (response) {
                dispatch(resetPerformanceTrackerKeySuccess(response.data));
            },
            function (error) {
                const errorMsg =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(resetPerformanceTrackerKeyFailure(errorMsg));
            }
        );

        return promise;
    };

// remove quickstart guide
export const removeQuickStartRequest = () => ({
    type: types.REMOVE_QUICK_START_REQUEST,
});

export const removeQuickStartSuccess = (payload: $TSFixMe) => ({
    type: types.REMOVE_QUICK_START_SUCCESS,
    payload,
});

export const removeQuickStartFailure = (error: ErrorPayload) => ({
    type: types.REMOVE_QUICK_START_FAILURE,
    payload: error,
});

export const removeQuickStart =
    ({ projectId, performanceTrackerId }: $TSFixMe) =>
    (dispatch: Dispatch) => {
        dispatch(removeQuickStartRequest());
        const promise = BackendAPI.put(
            `performanceTracker/${projectId}/remove-quickstart/${performanceTrackerId}`,
            {}
        );

        promise.then(
            function (response) {
                dispatch(removeQuickStartSuccess(response.data));
            },
            function (error) {
                const errorMsg =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(removeQuickStartFailure(errorMsg));
            }
        );

        return promise;
    };

// fetch last metrics
export const fetchLastMetricsRequest = () => ({
    type: types.FETCH_LAST_METRICS_REQUEST,
});

export const fetchLastMetricsSuccess = (payload: $TSFixMe) => ({
    type: types.FETCH_LAST_METRICS_SUCCESS,
    payload,
});

export const fetchLastMetricsFailure = (error: ErrorPayload) => ({
    type: types.FETCH_LAST_METRICS_FAILURE,
    payload: error,
});

export const fetchLastMetrics =
    ({ projectId, performanceTrackerId, startDate, endDate }: $TSFixMe) =>
    (dispatch: Dispatch) => {
        dispatch(fetchLastMetricsRequest());

        startDate = encode(startDate);
        endDate = encode(endDate);

        const promise = BackendAPI.get(
            `performanceTracker/${projectId}/last-metrics/${performanceTrackerId}?startDate=${startDate}&endDate=${endDate}`
        );

        promise.then(
            function (response) {
                dispatch(fetchLastMetricsSuccess(response.data));
            },
            function (error) {
                const errorMsg =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(fetchLastMetricsFailure(errorMsg));
            }
        );

        return promise;
    };

export const addPerformanceTracker =
    (payload: $TSFixMe) => (dispatch: Dispatch) => {
        return dispatch({
            type: types.ADD_PERFORMANCE_TRACKER,
            payload,
        });
    };