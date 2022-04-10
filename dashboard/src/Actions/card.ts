import BackendAPI from 'common-ui/src/utils/api/backend';
import { Dispatch } from 'redux';
import * as types from '../constants/card';
import ErrorPayload from 'common-ui/src/payload-types/error';
export const addCardRequest = (promise: $TSFixMe) => {
    return {
        type: types.ADD_CARD_REQUEST,
        payload: promise,
    };
};

export const addCardFailed = (error: ErrorPayload) => {
    return {
        type: types.ADD_CARD_FAILED,
        payload: error,
    };
};

export const addCardSuccess = (card: $TSFixMe) => {
    return {
        type: types.ADD_CARD_SUCCESS,
        payload: card,
    };
};

export const addCard = (userId: string, token: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(`stripe/${userId}/creditCard/${token}`);

        dispatch(addCardRequest(promise));

        promise.then(
            function (card) {
                dispatch(addCardSuccess(card.data));
            },
            function (error) {
                dispatch(addCardFailed(error));
            }
        );
        return promise;
    };
};
export const fetchCardsRequest = (promise: $TSFixMe) => {
    return {
        type: types.FETCH_CARDS_REQUEST,
        payload: promise,
    };
};

export const fetchCardsFailed = (error: ErrorPayload) => {
    return {
        type: types.FETCH_CARDS_FAILED,
        payload: error,
    };
};

export const fetchCardsSuccess = (cards: $TSFixMe) => {
    return {
        type: types.FETCH_CARDS_SUCCESS,
        payload: cards,
    };
};

export const fetchCards = (userId: string) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.get(`stripe/${userId}/creditCard`);

        dispatch(fetchCardsRequest(promise));

        promise.then(
            function (cards) {
                dispatch(fetchCardsSuccess(cards.data.data));
            },
            function (error) {
                dispatch(fetchCardsFailed(error));
            }
        );
        return promise;
    };
};

export const deleteCardRequest = (promise: $TSFixMe) => {
    return {
        type: types.DELETE_CARD_REQUEST,
        payload: promise,
    };
};

export const deleteCardFailed = (error: ErrorPayload) => {
    return {
        type: types.DELETE_CARD_FAILED,
        payload: error,
    };
};

export const deleteCardSuccess = (card: $TSFixMe) => {
    return {
        type: types.DELETE_CARD_SUCCESS,
        payload: card,
    };
};

export const deleteCard = (userId: string, cardId: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = delete `stripe/${userId}/creditCard/${cardId}`;

        dispatch(deleteCardRequest(promise));

        promise.then(
            function (card) {
                dispatch(deleteCardSuccess(card.data));
            },
            function (error) {
                dispatch(deleteCardFailed(error));
            }
        );
        return promise;
    };
};

export const setDefaultCardRequest = (promise: $TSFixMe, cardId: $TSFixMe) => {
    return {
        type: types.SET_DEFAULT_CARD_REQUEST,
        payload: {
            promise,
            cardId,
        },
    };
};

export const setDefaultCardFailed = (error: ErrorPayload) => {
    return {
        type: types.SET_DEFAULT_CARD_FAILED,
        payload: error,
    };
};

export const setDefaultCardSuccess = (card: $TSFixMe) => {
    return {
        type: types.SET_DEFAULT_CARD_SUCCESS,
        payload: card,
    };
};

export const setDefaultCard = (userId: string, cardId: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.put(`stripe/${userId}/creditCard/${cardId}`);

        dispatch(setDefaultCardRequest(promise, cardId));

        promise.then(
            function (card) {
                dispatch(setDefaultCardSuccess(card.data));
                dispatch(fetchCards(userId));
            },
            function (error) {
                dispatch(setDefaultCardFailed(error));
            }
        );
        return promise;
    };
};