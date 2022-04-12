/* eslint-disable no-console */
import BackendAPI from 'CommonUI/src/utils/api/backend';
import { Dispatch } from 'redux';
import * as types from '../constants/errorTracker';
import ErrorPayload from 'CommonUI/src/payload-types/error';
import PositiveNumber from 'Common/Types/PositiveNumber';
//Create new error tracker
//props -> {name: '', type, data -> { data.url}}
export function createErrorTracker(
    projectId: string,
    componentId: $TSFixMe,
    values: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.post(
            `error-tracker/${projectId}/${componentId}/create`,
            values
        );
        dispatch(createErrorTrackerRequest());

        promise.then(
            function (errorTracker): void {
                dispatch(createErrorTrackerSuccess(errorTracker.data));
            },
            function (error): void {
                if (error && error.response && error.response.data) {
                    error = error.response.data;
                }
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(createErrorTrackerFailure(error));
            }
        );

        return promise;
    };
}

export const createErrorTrackerSuccess = (newErrorTracker: $TSFixMe): void => {
    return {
        type: types.CREATE_ERROR_TRACKER_SUCCESS,
        payload: newErrorTracker,
    };
};

export const createErrorTrackerRequest = (): void => {
    return {
        type: types.CREATE_ERROR_TRACKER_REQUEST,
    };
};

export const createErrorTrackerFailure = (error: ErrorPayload): void => {
    return {
        type: types.CREATE_ERROR_TRACKER_FAILURE,
        payload: error,
    };
};

export const resetCreateErrorTracker = (): void => {
    return {
        type: types.CREATE_ERROR_TRACKER_RESET,
    };
};

export const fetchErrorTrackersByProject = (projectId: string): void => {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.get(`component/${projectId}/issues`);

        dispatch(fetchErrorTrackersRequest());

        promise.then(
            function (errorTrackers): void {
                dispatch(
                    fetchErrorTrackersSuccess(errorTrackers.data.errorTrackers)
                );
            },
            function (error): void {
                dispatch(fetchErrorTrackersFailure(error));
            }
        );

        return promise;
    };
};

export function fetchErrorTrackers(
    projectId: string,
    componentId: $TSFixMe,
    skip = 0,
    limit = 0,
    fetchingPage = false
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.get(
            `error-tracker/${projectId}/${componentId}?skip=${skip}&limit=${limit}`
        );
        dispatch(fetchErrorTrackersRequest(fetchingPage));

        promise.then(
            function (errorTrackers): void {
                dispatch(fetchErrorTrackersSuccess(errorTrackers.data));
            },
            function (error): void {
                dispatch(fetchErrorTrackersFailure(error));
            }
        );

        return promise;
    };
}

export const fetchErrorTrackersSuccess = (errorTrackers: $TSFixMe): void => {
    return {
        type: types.FETCH_ERROR_TRACKERS_SUCCESS,
        payload: errorTrackers,
    };
};

export const fetchErrorTrackersRequest = (fetchingPage: $TSFixMe): void => {
    return {
        type: types.FETCH_ERROR_TRACKERS_REQUEST,
        payload: fetchingPage,
    };
};

export const fetchErrorTrackersFailure = (error: ErrorPayload): void => {
    return {
        type: types.FETCH_ERROR_TRACKERS_FAILURE,
        payload: error,
    };
};

export const resetFetchErrorTrackers = (): void => {
    return {
        type: types.FETCH_ERROR_TRACKERS_RESET,
    };
};

export function fetchErrorTrackerIssues(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe,
    skip: PositiveNumber,
    limit: PositiveNumber,
    startDate: $TSFixMe,
    endDate: $TSFixMe,
    filters = null
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.post(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/issues`,
            { skip, limit, startDate, endDate, filters }
        );
        dispatch(fetchErrorTrackerIssuesRequest(errorTrackerId));

        promise.then(
            function (response): void {
                dispatch(
                    fetchErrorTrackerIssuesSuccess({
                        errorTrackerId,
                        errorTrackerIssues:
                            response.data.data.errorTrackerIssues,

                        dateRange: response.data.data.dateRange,
                        skip,
                        limit,

                        count: response.data.data.count,
                    })
                );
            },
            function (error): void {
                dispatch(fetchErrorTrackerIssuesFailure(error));
            }
        );

        return promise;
    };
}

export const fetchErrorTrackerIssuesSuccess = (
    errorTrackersList: $TSFixMe
): void => {
    return {
        type: types.FETCH_ISSUES_SUCCESS,
        payload: errorTrackersList,
    };
};

export const fetchErrorTrackerIssuesRequest = (
    errorTrackerId: $TSFixMe
): void => {
    return {
        type: types.FETCH_ISSUES_REQUEST,
        payload: errorTrackerId,
    };
};

export const fetchErrorTrackerIssuesFailure = (error: ErrorPayload): void => {
    return {
        type: types.FETCH_ISSUES_FAILURE,
        payload: error,
    };
};

export const resetFetchErrorTrackerIssues = (): void => {
    return {
        type: types.FETCH_ISSUES_RESET,
    };
};

export function fetchErrorEvent(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe,
    errorEventId: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.post(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/error-events/${errorEventId}`
        );
        dispatch(fetchErrorEventRequest(errorTrackerId, errorEventId));

        promise.then(
            function (response): void {
                dispatch(
                    fetchErrorEventSuccess({
                        errorTrackerId,
                        errorEventId,

                        errorEvent: response.data.errorEvent,

                        previous: response.data.previous,

                        next: response.data.next,

                        totalEvents: response.data.totalEvents,
                    })
                );
            },
            function (error): void {
                dispatch(fetchErrorEventFailure(error));
            }
        );

        return promise;
    };
}

export const fetchErrorEventSuccess = (errorEvent: $TSFixMe): void => {
    return {
        type: types.FETCH_ERROR_EVENT_SUCCESS,
        payload: errorEvent,
    };
};

export function fetchErrorEventRequest(
    errorTrackerId: $TSFixMe,
    errorEventId: $TSFixMe
) {
    return {
        type: types.FETCH_ERROR_EVENT_REQUEST,
        payload: { errorTrackerId, errorEventId },
    };
}

export const fetchErrorEventFailure = (error: ErrorPayload): void => {
    return {
        type: types.FETCH_ERROR_EVENT_FAILURE,
        payload: error,
    };
};

export const resetFetchErrorEvent = (): void => {
    return {
        type: types.FETCH_ERROR_EVENT_RESET,
    };
};

export const setCurrentErrorEvent = (errorEventId: $TSFixMe): void => {
    return {
        type: types.SET_CURRENT_ERROR_EVENT,
        payload: { errorEventId },
    };
};

//Delete an errorTrackeer
//props -> {name: '', type, data -> { data.url}}
export function deleteErrorTracker(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise =
            delete `error-tracker/${projectId}/${componentId}/${errorTrackerId}`;
        dispatch(deleteErrorTrackerRequest(errorTrackerId));

        promise.then(
            function (errorTracker): void {
                dispatch(deleteErrorTrackerSuccess(errorTracker.data._id));
            },
            function (error): void {
                dispatch(
                    deleteErrorTrackerFailure({
                        error: error,
                        errorTrackerId,
                    })
                );
            }
        );

        return promise;
    };
}

export const deleteErrorTrackerSuccess = (
    removedErrorTrackerId: $TSFixMe
): void => {
    return {
        type: types.DELETE_ERROR_TRACKER_SUCCESS,
        payload: removedErrorTrackerId,
    };
};

export const deleteErrorTrackerRequest = (errorTrackerId: $TSFixMe): void => {
    return {
        type: types.DELETE_ERROR_TRACKER_REQUEST,
        payload: errorTrackerId,
    };
};

export const deleteErrorTrackerFailure = (error: ErrorPayload): void => {
    return {
        type: types.DELETE_ERROR_TRACKER_FAILURE,
        payload: error,
    };
};

export const editErrorTrackerSwitch = (index: $TSFixMe): void => {
    return {
        type: types.EDIT_ERROR_TRACKER_SWITCH,
        payload: index,
    };
};
//Edit new errorTracker
export function editErrorTracker(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe,
    values: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.put(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}`,
            values
        );
        dispatch(editErrorTrackerRequest());

        promise.then(
            function (errorTracker): void {
                dispatch(editErrorTrackerSuccess(errorTracker.data));
            },
            function (error): void {
                if (error && error.response && error.response.data) {
                    error = error.response.data;
                }
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(editErrorTrackerFailure(error));
            }
        );

        return promise;
    };
}

export const editErrorTrackerSuccess = (newErrorTracker: $TSFixMe): void => {
    return {
        type: types.EDIT_ERROR_TRACKER_SUCCESS,
        payload: newErrorTracker,
    };
};

export const editErrorTrackerRequest = (): void => {
    return {
        type: types.EDIT_ERROR_TRACKER_REQUEST,
    };
};

export const editErrorTrackerFailure = (error: ErrorPayload): void => {
    return {
        type: types.EDIT_ERROR_TRACKER_FAILURE,
        payload: error,
    };
};

export function resetErrorTrackerKey(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.post(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/reset-key`
        );
        dispatch(resetErrorTrackerKeyRequest());

        promise.then(
            function (errorTracker): void {
                dispatch(resetErrorTrackerKeySuccess(errorTracker.data));
            },
            function (error): void {
                dispatch(resetErrorTrackerKeyFailure(error));
            }
        );

        return promise;
    };
}

export const resetErrorTrackerKeySuccess = (errorTracker: $TSFixMe): void => {
    return {
        type: types.RESET_ERROR_TRACKER_KEY_SUCCESS,
        payload: errorTracker,
    };
};

export const resetErrorTrackerKeyRequest = (): void => {
    return {
        type: types.RESET_ERROR_TRACKER_KEY_REQUEST,
    };
};

export const resetErrorTrackerKeyFailure = (error: ErrorPayload): void => {
    return {
        type: types.RESET_ERROR_TRACKER_KEY_FAILURE,
        payload: error,
    };
};

export const resetresetErrorTrackerKey = (): void => {
    return {
        type: types.RESET_ERROR_TRACKER_KEY_RESET,
    };
};

export function ignoreErrorEvent(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe,
    issueId: $TSFixMe,
    unIgnore: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.post(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/issues/action`,
            { issueId, action: unIgnore } // Instead of 'Unignore' becoming UNDEFINED always because the argument is always empty. A 'ignore' or 'unignore' parameter is used
        );
        dispatch(ignoreErrorEventRequest(errorTrackerId, issueId));

        promise.then(
            function (response): void {
                dispatch(
                    ignoreErrorEventSuccess({
                        errorTrackerId,

                        ignoredIssues: response.data.issues,
                    })
                );
            },
            function (error): void {
                dispatch(ignoreErrorEventFailure(error));
            }
        );

        return promise;
    };
}

export const ignoreErrorEventReset = (): void => {
    return {
        type: types.IGNORE_ERROR_EVENT_RESET,
    };
};

export function ignoreErrorEventRequest(
    errorTrackerId: $TSFixMe,
    issueId: $TSFixMe
) {
    return {
        type: types.IGNORE_ERROR_EVENT_REQUEST,
        payload: { errorTrackerId, issueId },
    };
}
export function ignoreErrorEventFailure(
    error: ErrorPayload,
    errorTrackerId: $TSFixMe
) {
    return {
        type: types.IGNORE_ERROR_EVENT_FAILURE,
        payload: { error, errorTrackerId },
    };
}
export const ignoreErrorEventSuccess = (errorEvents: $TSFixMe): void => {
    return {
        type: types.IGNORE_ERROR_EVENT_SUCCESS,
        payload: errorEvents,
    };
};

export function unresolveErrorEvent(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe,
    issueId: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.post(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/issues/action`,
            { issueId, action: 'unresolve' }
        );
        dispatch(unresolveErrorEventRequest(errorTrackerId, issueId));

        promise.then(
            function (response): void {
                dispatch(
                    unresolveErrorEventSuccess({
                        errorTrackerId,

                        unresolvedIssues: response.data.issues,
                    })
                );
            },
            function (error): void {
                dispatch(unresolveErrorEventFailure(error));
            }
        );

        return promise;
    };
}

export const unresolveErrorEventReset = (): void => {
    return {
        type: types.UNRESOLVE_ERROR_EVENT_RESET,
    };
};

export function unresolveErrorEventRequest(
    errorTrackerId: $TSFixMe,
    issueId: $TSFixMe
) {
    return {
        type: types.UNRESOLVE_ERROR_EVENT_REQUEST,
        payload: { errorTrackerId, issueId },
    };
}
export function unresolveErrorEventFailure(
    error: ErrorPayload,
    errorTrackerId: $TSFixMe
) {
    return {
        type: types.UNRESOLVE_ERROR_EVENT_FAILURE,
        payload: { error, errorTrackerId },
    };
}
export const unresolveErrorEventSuccess = (errorEvents: $TSFixMe): void => {
    return {
        type: types.UNRESOLVE_ERROR_EVENT_SUCCESS,
        payload: errorEvents,
    };
};

export function resolveErrorEvent(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe,
    issueId: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.post(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/issues/action`,
            { issueId, action: 'resolve' }
        );
        dispatch(resolveErrorEventRequest(errorTrackerId, issueId));

        promise.then(
            function (response): void {
                dispatch(
                    resolveErrorEventSuccess({
                        errorTrackerId,

                        resolvedIssues: response.data.issues,
                    })
                );
            },
            function (error): void {
                dispatch(resolveErrorEventFailure(error));
            }
        );

        return promise;
    };
}

export const resolveErrorEventReset = (): void => {
    return {
        type: types.RESOLVE_ERROR_EVENT_RESET,
    };
};

export function resolveErrorEventRequest(
    errorTrackerId: $TSFixMe,
    issueId: $TSFixMe
) {
    return {
        type: types.RESOLVE_ERROR_EVENT_REQUEST,
        payload: { errorTrackerId, issueId },
    };
}
export function resolveErrorEventFailure(
    error: ErrorPayload,
    errorTrackerId: $TSFixMe
) {
    return {
        type: types.RESOLVE_ERROR_EVENT_FAILURE,
        payload: { error, errorTrackerId },
    };
}
export const resolveErrorEventSuccess = (errorEvents: $TSFixMe): void => {
    return {
        type: types.RESOLVE_ERROR_EVENT_SUCCESS,
        payload: errorEvents,
    };
};

export function updateErrorEventMember(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe,
    issueId: $TSFixMe,
    teamMemberId: $TSFixMe,
    type = 'assign'
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.post(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/${type}/${issueId}`,
            { teamMemberId }
        );
        dispatch(
            updateErrorEventMemberRequest({
                issueId,
                memberId: teamMemberId[0],
            })
        );

        promise.then(
            function (response): void {
                dispatch(
                    updateErrorEventMemberSuccess({
                        errorTrackerId,
                        issueId,

                        members: response.data.members,
                    })
                );
            },
            function (error): void {
                dispatch(updateErrorEventMemberFailure(error));
            }
        );

        return promise;
    };
}

export const updateErrorEventMemberReset = (): void => {
    return {
        type: types.UPDATE_ERROR_EVENT_MEMBER_RESET,
    };
};

export function updateErrorEventMemberRequest(
    errorTrackerIssueMembers: $TSFixMe
) {
    return {
        type: types.UPDATE_ERROR_EVENT_MEMBER_REQUEST,
        payload: errorTrackerIssueMembers,
    };
}
export const updateErrorEventMemberFailure = (error: ErrorPayload): void => {
    return {
        type: types.UPDATE_ERROR_EVENT_MEMBER_FAILURE,
        payload: error,
    };
};
export function updateErrorEventMemberSuccess(
    errorTrackerIssueMembers: $TSFixMe
) {
    return {
        type: types.UPDATE_ERROR_EVENT_MEMBER_SUCCESS,
        payload: errorTrackerIssueMembers,
    };
}
export const getErrorEventSuccess = (data: $TSFixMe): void => {
    return {
        type: types.NEW_ERROR_EVENT_SUCCESS,
        payload: data,
    };
};
//Delete an errorTracker Issue
export function deleteErrorTrackerIssue(
    projectId: string,
    componentId: $TSFixMe,
    errorTrackerId: $TSFixMe,
    issueId: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise =
            delete `error-tracker/${projectId}/${componentId}/${errorTrackerId}/issue/${issueId}`;
        dispatch(deleteErrorTrackerIssueRequest(issueId));

        promise.then(
            function (errorTracker): void {
                dispatch(deleteErrorTrackerIssueSuccess(errorTracker.data));
            },
            function (error): void {
                dispatch(
                    deleteErrorTrackerIssueFailure({
                        error: error,
                        issueId,
                    })
                );
            }
        );

        return promise;
    };
}

export function deleteErrorTrackerIssueSuccess(
    removedErrorTrackerIssue: $TSFixMe
) {
    return {
        type: types.DELETE_ERROR_TRACKER_ISSUE_SUCCESS,
        payload: removedErrorTrackerIssue,
    };
}

export const deleteErrorTrackerIssueRequest = (
    errorTrackerIssueId: $TSFixMe
) => {
    return {
        type: types.DELETE_ERROR_TRACKER_ISSUE_REQUEST,
        payload: errorTrackerIssueId,
    };
};

export const deleteErrorTrackerIssueFailure = (error: ErrorPayload): void => {
    return {
        type: types.DELETE_ERROR_TRACKER_ISSUE_FAILURE,
        payload: error,
    };
};
