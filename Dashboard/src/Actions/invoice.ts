import BackendAPI from 'CommonUI/src/utils/api/backend';
import { Dispatch } from 'redux';
import * as types from '../constants/invoice';
import ErrorPayload from 'CommonUI/src/payload-types/error';
// Array of invoices

export const getInvoiceRequest = (promise: $TSFixMe): void => {
    return {
        type: types.GET_INVOICE_REQUEST,
        payload: promise,
    };
};

export const getInvoiceError = (error: ErrorPayload): void => {
    return {
        type: types.GET_INVOICE_FAILED,
        payload: error,
    };
};

export const getInvoiceSuccess = (invoices: $TSFixMe): void => {
    return {
        type: types.GET_INVOICE_SUCCESS,
        payload: invoices,
    };
};

export const getInvoiceReset = (): void => {
    return {
        type: types.GET_INVOICE_RESET,
    };
};

export const incrementNextCount = (): void => {
    return {
        type: types.INCREMENT_NEXT_COUNT,
    };
};

export const decrementNextCount = (): void => {
    return {
        type: types.DECREMENT_NEXT_COUNT,
    };
};

// Get invoice from the backend
export function getInvoice(
    projectId: string,
    startingAfter: $TSFixMe,
    endingBefore: $TSFixMe
) {
    return function (dispatch: Dispatch): void {
        let promise = null;
        const reqFornext = Boolean(startingAfter) && !endingBefore;
        const reqForPrev = Boolean(endingBefore) && Boolean(startingAfter);

        if (reqFornext) {
            promise = BackendAPI.post(
                `invoice/${projectId}?startingAfter=${startingAfter}`,
                null
            );
        } else if (reqForPrev) {
            promise = BackendAPI.post(
                `invoice/${projectId}?endingBefore=${endingBefore}`,
                null
            );
        } else {
            promise = BackendAPI.post(`invoice/${projectId}`, null);
        }

        dispatch(getInvoiceRequest(promise));

        promise.then(
            function (invoices): void {
                dispatch(getInvoiceSuccess(invoices.data));
                if (reqFornext) {
                    dispatch(incrementNextCount());
                }
                if (reqForPrev) {
                    dispatch(decrementNextCount());
                }
            },
            function (error): void {
                dispatch(getInvoiceError(error));
            }
        );
    };
}
