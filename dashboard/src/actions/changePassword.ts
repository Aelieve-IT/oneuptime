import BackendAPI from '../api';
import { Dispatch } from 'redux';
import * as types from '../constants/changePassword';
import Route from 'common/types/api/route';
export const changePasswordRequest = (promise: $TSFixMe) => {
    return {
        type: types.CHANGEPASSWORD_REQUEST,
        payload: promise,
    };
};

export const changePasswordError = (error: $TSFixMe) => {
    return {
        type: types.CHANGEPASSWORD_FAILED,
        payload: error,
    };
};

export const changePasswordSuccess = (values: $TSFixMe) => {
    return {
        type: types.CHANGEPASSWORD_SUCCESS,
        payload: values,
    };
};

export const resetChangePassword = () => {
    return {
        type: types.RESET_CHANGEPASSWORD,
    };
};

// Calls the API to register a user.
export const changePassword = (values: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(
            new Route('user/reset-password'),
            values
        );
        dispatch(changePasswordRequest(promise));

        promise.then(
            function (response) {
                dispatch(changePasswordSuccess(response.data));
            },
            function (error) {

                dispatch(changePasswordError(error));
            }
        );
    };
};
