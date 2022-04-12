import BackendAPI from 'CommonUI/src/utils/api/backend';
import { Dispatch } from 'redux';
import * as types from '../constants/msteams';
import ErrorPayload from 'CommonUI/src/payload-types/error';
import PositiveNumber from 'Common/Types/PositiveNumber';
export const deleteMsTeamsRequest = (): void => {
    return {
        type: types.DELETE_MS_TEAMS_REQUEST,
    };
};

export const deleteMsTeamsError = (error: ErrorPayload): void => {
    return {
        type: types.DELETE_MS_TEAMS_FAILED,
        payload: error,
    };
};

export const deleteMsTeamsSuccess = (deleteMsTeams: $TSFixMe): void => {
    return {
        type: types.DELETE_MS_TEAMS_SUCCESS,
        payload: deleteMsTeams,
    };
};

export const resetDeleteMsTeams = (): void => {
    return {
        type: types.DELETE_MS_TEAMS_RESET,
    };
};

// Calls the API to link webhook team to project
export const deleteMsTeams = (projectId: string, msTeamsId: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        const promise = delete (`webhook/${projectId}/delete/${msTeamsId}`,
        null);

        dispatch(deleteMsTeamsRequest());

        return promise.then(
            function (msTeams): void {
                dispatch(deleteMsTeamsSuccess(msTeams.data));

                return msTeams.data;
            },
            function (error): void {
                dispatch(deleteMsTeamsError(error));
            }
        );
    };
};

export const getMsTeamsRequest = (promise: $TSFixMe): void => {
    return {
        type: types.GET_MS_TEAMS_REQUEST,
        payload: promise,
    };
};

export const getMsTeamsError = (error: ErrorPayload): void => {
    return {
        type: types.GET_MS_TEAMS_FAILED,
        payload: error,
    };
};

export const getMsTeamsSuccess = (msTeams: $TSFixMe): void => {
    return {
        type: types.GET_MS_TEAMS_SUCCESS,
        payload: msTeams,
    };
};

export const resetGetMsTeams = (): void => {
    return {
        type: types.GET_MS_TEAMS_RESET,
    };
};

export function getMsTeams(
    projectId: string,
    skip: PositiveNumber,
    limit: PositiveNumber
) {
    return function (dispatch: Dispatch): void {
        let promise = null;
        promise = BackendAPI.get(
            `webhook/${projectId}/hooks?skip=${skip || 0}&limit=${
                limit || 10
            }&type=msteams`
        );
        dispatch(getMsTeamsRequest(promise));

        promise.then(
            function (webhooks): void {
                dispatch(getMsTeamsSuccess(webhooks.data));
            },
            function (error): void {
                dispatch(getMsTeamsError(error));
            }
        );

        return promise;
    };
}

export function getMsTeamsMonitor(
    projectId: string,
    monitorId: $TSFixMe,
    skip: PositiveNumber,
    limit: PositiveNumber
) {
    return function (dispatch: Dispatch): void {
        let promise = null;
        promise = BackendAPI.get(
            `webhook/${projectId}/hooks/${monitorId}?skip=${skip || 0}&limit=${
                limit || 10
            }&type=msteams`
        );
        dispatch(getMsTeamsRequest(promise));

        promise.then(
            function (webhooks): void {
                dispatch(getMsTeamsSuccess(webhooks.data));
            },
            function (error): void {
                dispatch(getMsTeamsError(error));
            }
        );

        return promise;
    };
}

export const createMsTeamsRequest = (): void => {
    return {
        type: types.CREATE_MS_TEAMS_REQUEST,
    };
};

export const createMsTeamsError = (error: ErrorPayload): void => {
    return {
        type: types.CREATE_MS_TEAMS_FAILED,
        payload: error,
    };
};

export const createMsTeamsSuccess = (newWebHook: $TSFixMe): void => {
    return {
        type: types.CREATE_MS_TEAMS_SUCCESS,
        payload: newWebHook,
    };
};

export const resetCreateMsTeams = (): void => {
    return {
        type: types.CREATE_MS_TEAMS_RESET,
    };
};

// Calls the API to add webhook to project
export const createMsTeams = (projectId: string, data: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.post(`webhook/${projectId}/create`, data);

        dispatch(createMsTeamsRequest());
        return promise.then(
            function (webhook): void {
                dispatch(createMsTeamsSuccess(webhook.data));

                return webhook.data;
            },
            function (error): void {
                dispatch(createMsTeamsError(error));
            }
        );
    };
};

export const updateMsTeamsRequest = (): void => {
    return {
        type: types.UPDATE_MS_TEAMS_REQUEST,
    };
};

export const updateMsTeamsError = (error: ErrorPayload): void => {
    return {
        type: types.UPDATE_MS_TEAMS_FAILED,
        payload: error,
    };
};

export const updateMsTeamsSuccess = (newWebHook: $TSFixMe): void => {
    return {
        type: types.UPDATE_MS_TEAMS_SUCCESS,
        payload: newWebHook,
    };
};

export const resetUpdateMsTeams = (): void => {
    return {
        type: types.UPDATE_MS_TEAMS_RESET,
    };
};

// Calls the API to add webhook to project
export function updateMsTeams(
    projectId: string,
    webhookId: $TSFixMe,
    data: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        const promise = BackendAPI.put(
            `webhook/${projectId}/${webhookId}`,
            data
        );

        dispatch(updateMsTeamsRequest());

        return promise.then(
            function (webhook): void {
                dispatch(updateMsTeamsSuccess(webhook.data));

                return webhook.data;
            },
            function (error): void {
                dispatch(updateMsTeamsError(error));
            }
        );
    };
}

// Implements pagination for Webhooks Members table

export const paginateNext = (): void => {
    return {
        type: types.PAGINATE_NEXT,
    };
};

export const paginatePrev = (): void => {
    return {
        type: types.PAGINATE_PREV,
    };
};

export const paginateReset = (): void => {
    return {
        type: types.PAGINATE_RESET,
    };
};

export const paginate = (type: $TSFixMe): void => {
    return function (dispatch: Dispatch): void {
        type === 'next' && dispatch(paginateNext());
        type === 'prev' && dispatch(paginatePrev());
        type === 'reset' && dispatch(paginateReset());
    };
};
