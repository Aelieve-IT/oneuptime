import * as types from '../constants/group';
import BackendAPI from 'common-ui/src/utils/api/backend';
import { Dispatch } from 'redux';
import { User } from '../config.js';
import ErrorPayload from 'common-ui/src/payload-types/error';
import PositiveNumber from 'common/types/PositiveNumber';
// Add Group
export const addGroupRequest = () => ({
    type: types.CREATE_GROUP_REQUEST,
});

export const addGroupSuccess = (payload: $TSFixMe) => ({
    type: types.CREATE_GROUP_SUCCESS,
    payload,
});

export const addGroupFailure = (error: ErrorPayload) => ({
    type: types.CREATE_GROUP_FAILURE,
    payload: error,
});

export const createGroup =
    (projectId: string, data: $TSFixMe) => async (dispatch: Dispatch) => {
        dispatch(addGroupRequest());

        try {
            const response = await BackendAPI.post(`group/${projectId}`, data);

            dispatch(addGroupSuccess(response.data));
            dispatch(getGroups());
            return response;
        } catch (error) {
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data
                    : error.data
                    ? error.data
                    : error.message
                    ? error.message
                    : 'Network Error';
            dispatch(addGroupFailure(errorMsg));
            return { error: errorMsg };
        }
    };

// Edit and update Groups
export const updateGroupRequest = (payload: $TSFixMe) => ({
    type: types.UPDATE_GROUP_REQUEST,
    payload,
});

export const updateGroupSuccess = (payload: $TSFixMe) => ({
    type: types.UPDATE_GROUP_SUCCESS,
    payload,
});

export const updateGroupFailure = (error: ErrorPayload) => ({
    type: types.UPDATE_GROUP_FAILURE,
    payload: error,
});

export const updateGroup =
    (projectId: string, groupId: $TSFixMe, data: $TSFixMe) =>
    async (dispatch: Dispatch) => {
        dispatch(updateGroupRequest(groupId));

        try {
            const response = await BackendAPI.put(
                `group/${projectId}/${groupId}`,
                data
            );

            dispatch(updateGroupSuccess(response.data));
            return response;
        } catch (error) {
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data
                    : error.data
                    ? error.data
                    : error.message
                    ? error.message
                    : 'Network Error';
            dispatch(updateGroupFailure(errorMsg));
            return { error: errorMsg };
        }
    };

// Get all project and subproject groups
export const getGroupsRequest = () => ({
    type: types.GET_GROUPS_REQUEST,
});

export const getGroupsSuccess = (payload: $TSFixMe) => ({
    type: types.GET_GROUPS_SUCCESS,
    payload,
});

export const getGroupsFailure = (error: ErrorPayload) => ({
    type: types.GET_GROUPS_FAILURE,
    payload: error,
});

export const getGroups = () => async (dispatch: Dispatch) => {
    dispatch(getGroupsRequest());
    const projectId = User.getCurrentProjectId();
    try {
        const response = await BackendAPI.get(`group/${projectId}/groups`);

        dispatch(getGroupsSuccess(response.data));
    } catch (error) {
        const errorMsg =
            error.response && error.response.data
                ? error.response.data
                : error.data
                ? error.data
                : error.message
                ? error.message
                : 'Network Error';
        dispatch(getGroupsFailure(errorMsg));
    }
};

// Get project groups
export const getProjectGroupsRequest = () => ({
    type: types.GET_PROJECT_GROUPS_REQUEST,
});

export const getProjectGroupsSuccess = (payload: $TSFixMe) => ({
    type: types.GET_PROJECT_GROUPS_SUCCESS,
    payload,
});

export const getProjectGroupsFailure = (error: ErrorPayload) => ({
    type: types.GET_PROJECT_GROUPS_FAILURE,
    payload: error,
});

export const getProjectGroups =
    (projectId: string, skip: PositiveNumber, limit: PositiveNumber) =>
    async (dispatch: Dispatch) => {
        dispatch(getProjectGroupsRequest());
        try {
            const response = await BackendAPI.get(
                `group/${projectId}?skip=${skip}&limit=${limit}`
            );

            dispatch(getProjectGroupsSuccess(response.data));
        } catch (error) {
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data
                    : error.data
                    ? error.data
                    : error.message
                    ? error.message
                    : 'Network Error';
            dispatch(getProjectGroupsFailure(errorMsg));
        }
    };

// Delete Group
export const deleteGroupRequest = () => ({
    type: types.DELETE_GROUP_REQUEST,
});

export const deleteGroupSuccess = (payload: $TSFixMe) => ({
    type: types.DELETE_GROUP_SUCCESS,
    payload,
});

export const deleteGroupFailure = (error: ErrorPayload) => ({
    type: types.DELETE_GROUP_FAILURE,
    payload: error,
});

export const deleteGroup =
    (projectId: string, groupId: $TSFixMe) => async (dispatch: Dispatch) => {
        dispatch(deleteGroupRequest());

        try {
            const response = await delete `group/${projectId}/${groupId}`;

            dispatch(deleteGroupSuccess(response.data));
            dispatch(getGroups());
            return response;
        } catch (error) {
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data
                    : error.data
                    ? error.data
                    : error.message
                    ? error.message
                    : 'Network Error';

            dispatch(deleteGroupFailure(errorMsg));
            return errorMsg;
        }
    };

//Reset error message
export const resetErrorMessage = () => ({
    type: types.RESET_ERROR_MESSAGE,
});