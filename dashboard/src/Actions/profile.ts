import BackendAPI from 'common-ui/src/utils/api/backend';
import { Dispatch } from 'redux';
import Route from 'common/types/api/route';
import * as types from '../constants/profile';
import FormData from 'form-data';
import ErrorPayload from 'common-ui/src/payload-types/error';
import Action from 'common-ui/src/types/action';
//Update profile setting

export const updateProfileSettingRequest = () => {
    return {
        type: types.UPDATE_PROFILE_SETTING_REQUEST,
    };
};

export const updateProfileSettingSuccess = (profileSetting: $TSFixMe) => {
    return {
        type: types.UPDATE_PROFILE_SETTING_SUCCESS,
        payload: profileSetting,
    };
};

export const updateProfileSettingError = (error: ErrorPayload) => {
    return {
        type: types.UPDATE_PROFILE_SETTING_FAILURE,
        payload: error,
    };
};

export const updatePushNotificationRequest = () => {
    return {
        type: types.UPDATE_PUSH_NOTIFICATION_REQUEST,
    };
};

export const updatePushNotificationError = (error: ErrorPayload) => {
    return {
        type: types.UPDATE_PUSH_NOTIFICATION_ERROR,
        payload: error,
    };
};

export const updatePushNotificationSuccess = (data: $TSFixMe) => {
    return {
        type: types.UPDATE_PUSH_NOTIFICATION_SUCCESS,
        payload: data,
    };
};

// Calls the API to update setting.

export const updateProfileSetting = (values: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const data = new FormData();
        if (values.profilePic && values.profilePic !== 'null') {
            if (!values.removedPic) {
                if (
                    values.profilePic &&
                    typeof values.profilePic !== 'object'
                ) {
                    data.append('profilePic', values.profilePic);
                } else {
                    data.append(
                        'profilePic',
                        values.profilePic[0],
                        values.profilePic[0].name
                    );
                }
            } else {
                data.append('profilePic', null);
            }
        }

        data.append('name', values.name);
        data.append('email', values.email);
        data.append('companyPhoneNumber', values.companyPhoneNumber);
        data.append('timezone', values.timezone);
        data.append('alertPhoneNumber', values.alertPhoneNumber);

        const promise = BackendAPI.put('user/profile', data);
        dispatch(updateProfileSettingRequest());
        promise.then(
            function (response) {
                const profileSettings = response.data;
                dispatch(updateProfileSettingSuccess(profileSettings));
                return profileSettings;
            },
            function (error) {
                dispatch(updateProfileSettingError(error));
            }
        );

        return promise;
    };
};

// Update push notification
export const updatePushNotification = (data: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.put('user/push-notification', data);
        dispatch(updatePushNotificationRequest());
        promise.then(
            function (response) {
                const profileSettings = response.data;
                dispatch(updatePushNotificationSuccess(profileSettings));
                return profileSettings;
            },
            function (error) {
                dispatch(updatePushNotificationError(error));
            }
        );

        return promise;
    };
};

// Update user's two factor authentication
export const twoFactorAuthTokenRequest = () => {
    return {
        type: types.UPDATE_TWO_FACTOR_AUTH_REQUEST,
    };
};

export const twoFactorAuthTokenSuccess = (payload: $TSFixMe) => {
    return {
        type: types.UPDATE_TWO_FACTOR_AUTH_SUCCESS,
        payload: payload,
    };
};

export const twoFactorAuthTokenError = (error: ErrorPayload) => {
    return {
        type: types.UPDATE_TWO_FACTOR_AUTH_FAILURE,
        payload: error,
    };
};

export const verifyTwoFactorAuthToken = (values: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(
            new Route('user/totp/verifyToken'),
            values
        );
        dispatch(twoFactorAuthTokenRequest());
        promise.then(
            function (response) {
                const payload = response.data;
                dispatch(twoFactorAuthTokenSuccess(payload));
                return payload;
            },
            function (error) {
                dispatch(twoFactorAuthTokenError(error));
            }
        );

        return promise;
    };
};

// Generate user's QR code
export const generateTwoFactorQRCodeRequest = () => {
    return {
        type: types.GENERATE_TWO_FACTOR_QR_REQUEST,
    };
};

export const generateTwoFactorQRCodeSuccess = (payload: $TSFixMe) => {
    return {
        type: types.GENERATE_TWO_FACTOR_QR_SUCCESS,
        payload: payload,
    };
};

export const generateTwoFactorQRCodeError = (error: ErrorPayload) => {
    return {
        type: types.GENERATE_TWO_FACTOR_QR_FAILURE,
        payload: error,
    };
};

export const generateTwoFactorQRCode = (userId: string) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(`user/totp/token/${userId}`);
        dispatch(generateTwoFactorQRCodeRequest());
        promise.then(
            function (response) {
                const payload = response.data;
                dispatch(generateTwoFactorQRCodeSuccess(payload));
                return payload;
            },
            function (error) {
                dispatch(generateTwoFactorQRCodeError(error));
            }
        );

        return promise;
    };
};

// Update user twoFactorAuthToken

export const updateTwoFactorAuthToken = (data: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.put('user/profile', data);
        dispatch(twoFactorAuthTokenRequest());
        promise.then(
            function (response) {
                const payload = response.data;
                dispatch(twoFactorAuthTokenSuccess(payload));
                return payload;
            },
            function (error) {
                dispatch(twoFactorAuthTokenError(error));
            }
        );

        return promise;
    };
};

//Update change password setting.

export const updateChangePasswordSettingRequest = () => {
    return {
        type: types.UPDATE_CHANGE_PASSWORD_SETTING_REQUEST,
    };
};

export const updateChangePasswordSettingSuccess = () => {
    return {
        type: types.UPDATE_CHANGE_PASSWORD_SETTING_SUCCESS,
    };
};

export const updateChangePasswordSettingError = (error: ErrorPayload) => {
    return {
        type: types.UPDATE_CHANGE_PASSWORD_SETTING_FAILURE,
        payload: error,
    };
};

// Calls the API to update change password setting.
export const updateChangePasswordSetting = (data: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.put('user/changePassword', data);
        dispatch(updateChangePasswordSettingRequest());

        promise.then(
            function () {
                dispatch(updateChangePasswordSettingSuccess());
                return {};
            },
            function (error) {
                dispatch(updateChangePasswordSettingError(error));
            }
        );
        return promise;
    };
};

export const showProfileMenu = (position: $TSFixMe) => {
    return {
        type: types.SHOW_PROFILE_MENU,
        payload: position,
    };
};

export const hideProfileMenu = (error: ErrorPayload) => {
    return {
        type: types.HIDE_PROFILE_MENU,
        payload: error,
    };
};

// Get Previous User Settings.

export const userSettingsRequest = () => {
    return {
        type: types.USER_SETTINGS_REQUEST,
    };
};

export const userSettingsSuccess = (settings: $TSFixMe) => {
    return {
        type: types.USER_SETTINGS_SUCCESS,
        payload: settings,
    };
};

export const userSettingsError = (error: ErrorPayload) => {
    return {
        type: types.USER_SETTINGS_FAILURE,
        payload: error,
    };
};

// Calls the API to update on cal alert setting.
export const userSettings = () => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.get(new Route('user/profile'));
        dispatch(userSettingsRequest());

        promise.then(
            function (response) {
                const settings = response.data;
                dispatch(userSettingsSuccess(settings));
                return settings;
            },
            function (error) {
                dispatch(userSettingsError(error));
            }
        );

        return promise;
    };
};

export const logFile = (file: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        dispatch({ type: 'LOG_FILE', payload: file });
    };
};

export const resetFile = () => {
    return function (dispatch: Dispatch) {
        dispatch({ type: 'RESET_FILE' });
    };
};

export const sendVerificationSMSRequest = () => {
    return {
        type: types.SEND_VERIFICATION_SMS_REQUEST,
    };
};

export const sendVerificationSMSSuccess = (verificationAction: Action) => {
    return {
        type: types.SEND_VERIFICATION_SMS_SUCCESS,
        payload: verificationAction,
    };
};

export const sendVerificationSMSError = (error: ErrorPayload) => {
    return {
        type: types.SEND_VERIFICATION_SMS_FAILURE,
        payload: error,
    };
};

export const sendVerificationSMSReset = () => {
    return function (dispatch: Dispatch) {
        dispatch({ type: types.SEND_VERIFICATION_SMS_RESET });
    };
};

export const sendEmailVerificationRequest = () => {
    return {
        type: types.SEND_EMAIL_VERIFICATION_REQUEST,
    };
};

export const sendEmailVerificationSuccess = (payload: $TSFixMe) => {
    return {
        type: types.SEND_EMAIL_VERIFICATION_SUCCESS,
        payload,
    };
};

export const sendEmailVerificationError = (error: ErrorPayload) => {
    return {
        type: types.SEND_EMAIL_VERIFICATION_FAILURE,
        payload: error,
    };
};

export const sendEmailVerificationLink = (values: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(new Route('user/resend'), values);
        dispatch(sendEmailVerificationRequest());

        promise.then(
            function (data) {
                dispatch(sendEmailVerificationSuccess(data));
                return data;
            },
            function (error) {
                dispatch(sendEmailVerificationError(error));
            }
        );
    };
};

export const sendVerificationSMS = (projectId: string, values: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(
            `twilio/sms/sendVerificationToken?projectId=${projectId}`,
            values
        );
        dispatch(sendVerificationSMSRequest());

        promise.then(
            function (response) {
                const vericationAction = response.data;
                dispatch(sendVerificationSMSSuccess(vericationAction));
                return vericationAction;
            },
            function (error) {
                dispatch(sendVerificationSMSError(error));
            }
        );

        return promise;
    };
};
export const verifySMSCodeRequest = () => {
    return {
        type: types.VERIFY_SMS_CODE_REQUEST,
    };
};

export const verifySMSCodeSuccess = (verificationResult: $TSFixMe) => {
    return {
        type: types.VERIFY_SMS_CODE_SUCCESS,
        payload: verificationResult,
    };
};

export const verifySMSCodeError = (error: ErrorPayload) => {
    return {
        type: types.VERIFY_SMS_CODE_FAILURE,
        payload: error,
    };
};

export const verifySMSCodeReset = () => {
    return function (dispatch: Dispatch) {
        dispatch({ type: types.VERIFY_SMS_CODE_RESET });
    };
};

export const verifySMSCode = (projectId: string, values: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(
            `twilio/sms/verify?projectId=${projectId}`,
            values
        );
        dispatch(verifySMSCodeRequest());

        promise.then(
            function (response) {
                const verificationResult = response.data;
                dispatch(verifySMSCodeSuccess(verificationResult));
                return verificationResult;
            },
            function (error) {
                dispatch(verifySMSCodeError(error));
            }
        );

        return promise;
    };
};

export const setAlertPhoneNumber = (number: $TSFixMe) => {
    return {
        type: types.SET_ALERT_PHONE_NUMBER,
        payload: number,
    };
};

export const setTwoFactorAuth = (enabled: $TSFixMe) => {
    return {
        type: types.SET_TWO_FACTOR_AUTH,
        payload: enabled,
    };
};

export const setInitAlertEmail = (email: $TSFixMe) => {
    return {
        type: types.SET_INIT_ALERT_EMAIL,
        payload: email,
    };
};

export const setVerified = (value: $TSFixMe) => {
    return {
        type: types.SET_VERIFIED,
        payload: value,
    };
};

export const setInitPhoneVerificationNumber = (number: $TSFixMe) => {
    return {
        type: types.SET_INIT_PHONE_VERIFICATION_NUMBER,
        payload: number,
    };
};

export const setInitPhoneVerification = (value: $TSFixMe) => {
    return {
        type: types.SET_INIT_PHONE_VERIFICATION,
        payload: value,
    };
};

export const setProfilePic = (value: $TSFixMe) => {
    return {
        type: types.SET_PROFILE_PIC,
        payload: value,
    };
};

export const setRemovedPic = (value: $TSFixMe) => {
    return {
        type: types.SET_REMOVED_PIC,
        payload: value,
    };
};

export const setFileInputKey = (value: $TSFixMe) => {
    return {
        type: types.SET_FILE_INPUT_KEY,
        payload: value,
    };
};

export const setIsVerified = (value: $TSFixMe) => {
    return {
        type: types.SET_IS_VERIFIED,
        payload: value,
    };
};

export const setInitialAlertPhoneNumber = (value: $TSFixMe) => {
    return {
        type: types.SET_INITIAL_ALERT_PHONE_NUMBER,
        payload: value,
    };
};

export const setUserEmail = (value: $TSFixMe) => {
    return {
        type: types.SET_USER_EMAIL,
        payload: value,
    };
};

export const setResendTimer = (value: $TSFixMe) => {
    return {
        type: types.SET_RESEND_TIMER,
        payload: value,
    };
};

// Delete user account
export const deleteAccountRequest = () => {
    return {
        type: types.DELETE_ACCOUNT_REQUEST,
    };
};

export const deleteAccountSuccess = (promise: $TSFixMe) => {
    return {
        type: types.USER_SETTINGS_SUCCESS,
        payload: promise,
    };
};

export const deleteAccountFailure = (error: ErrorPayload) => {
    return {
        type: types.USER_SETTINGS_FAILURE,
        payload: error,
    };
};

export const deleteAccount = (userId: string, confirmation: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = delete (`user/${userId}/delete`, confirmation);
        dispatch(deleteAccountRequest());

        promise.then(
            function (response) {
                dispatch(deleteAccountSuccess(response.data));
                return response;
            },
            function (error) {
                dispatch(deleteAccountFailure(error));
            }
        );

        return promise;
    };
};

// Generate backup codes
const generateBackupCodesRequest = () => ({
    type: types.GENERATE_BACKUP_CODES_REQUEST,
});

const generateBackupCodesSuccess = (payload: $TSFixMe) => ({
    type: types.GENERATE_BACKUP_CODES_SUCCESS,
    payload,
});

const generateBackupCodesFailure = (payload: $TSFixMe) => ({
    type: types.GENERATE_BACKUP_CODES_FAILURE,
    payload,
});

export const generateBackupCodes = () => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(`user/generate/backupCode`);
        dispatch(generateBackupCodesRequest());

        promise.then(
            function (response) {
                dispatch(generateBackupCodesSuccess(response.data));
                return response;
            },
            function (error) {
                dispatch(generateBackupCodesFailure(error));
            }
        );

        return promise;
    };
};