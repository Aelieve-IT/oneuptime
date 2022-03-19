import { postApi, getApi, deleteApi, putApi } from '../api';
import * as types from '../constants/automatedScript';

export function resetScripts(data: $TSFixMe) {
    return {
        type: types.RESET_AUTOMATED_SCRIPT,
        payload: data,
    };
}

export function createAutomatedScriptRequest(data: $TSFixMe) {
    return {
        type: types.CREATE_AUTOMATED_SCRIPT_REQUEST,
        payload: data,
    };
}

export function createAutomatedScriptSuccess(data: $TSFixMe) {
    return {
        type: types.CREATE_AUTOMATED_SCRIPT_SUCCESS,
        payload: data,
    };
}

export function createAutomatedScriptFailure(error: $TSFixMe) {
    return {
        type: types.CREATE_AUTOMATED_SCRIPT_FAILURE,
        payload: error,
    };
}

export function createAutomatedScript(projectId: $TSFixMe, data: $TSFixMe) {
    return function(dispatch: $TSFixMe) {
        const promise = postApi(`automated-scripts/${projectId}`, data);

        dispatch(createAutomatedScriptRequest());

        promise.then(
            function(response) {
                dispatch(createAutomatedScriptSuccess(response.data));

                return response.data;
            },
            function(error) {
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
                dispatch(createAutomatedScriptFailure(error));
                return error;
            }
        );

        return promise;
    };
}

export function updateAutomatedScriptRequest(data: $TSFixMe) {
    return {
        type: types.CREATE_AUTOMATED_SCRIPT_REQUEST,
        payload: data,
    };
}

export function updateAutomatedScriptSuccess(data: $TSFixMe) {
    return {
        type: types.CREATE_AUTOMATED_SCRIPT_SUCCESS,
        payload: data,
    };
}

export function updateAutomatedScriptFailure(error: $TSFixMe) {
    return {
        type: types.CREATE_AUTOMATED_SCRIPT_FAILURE,
        payload: error,
    };
}

export function updateAutomatedScript(
    projectId: $TSFixMe,
    automatedScriptId: $TSFixMe,
    data: $TSFixMe
) {
    return function(dispatch: $TSFixMe) {
        const promise = putApi(
            `automated-scripts/${projectId}/${automatedScriptId}`,
            data
        );

        dispatch(updateAutomatedScriptRequest());

        promise.then(
            function(response) {
                dispatch(updateAutomatedScriptSuccess(response.data));

                return response.data;
            },
            function(error) {
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
                dispatch(updateAutomatedScriptFailure(error));
                return error;
            }
        );

        return promise;
    };
}

export function fetchSingleAutomatedScriptSuccess(data: $TSFixMe) {
    return {
        type: types.FETCH_SINGLE_SCRIPT_SUCCESS,
        payload: data,
    };
}

export function fetchSingleAutomatedScriptRequest(data: $TSFixMe) {
    return {
        type: types.FETCH_SINGLE_SCRIPT_REQUEST,
        payload: data,
    };
}

export function fetchSingleAutomatedScriptFailure(data: $TSFixMe) {
    return {
        type: types.FETCH_SINGLE_SCRIPT_FAILURE,
        payload: data,
    };
}

export function fetchSingleAutomatedScript(
    projectId: $TSFixMe,
    automatedSlug: $TSFixMe,
    skip: $TSFixMe,
    limit: $TSFixMe
) {
    return function(dispatch: $TSFixMe) {
        const promise = getApi(
            `automated-scripts/${projectId}/${automatedSlug}?skip=${skip}&limit=${limit}`
        );

        dispatch(fetchSingleAutomatedScriptRequest());

        promise.then(
            function(response) {
                dispatch(fetchSingleAutomatedScriptSuccess(response.data));
            },
            function(error) {
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
                dispatch(fetchSingleAutomatedScriptFailure(error));
                return error;
            }
        );

        return promise;
    };
}

export function fetchAutomatedScriptSuccess(scripts: $TSFixMe) {
    return {
        type: types.FETCH_AUTOMATED_SCRIPT_SUCCESS,
        payload: scripts,
    };
}
export function fetchAutomatedScriptFailure(error: $TSFixMe) {
    return {
        type: types.FETCH_AUTOMATED_SCRIPT_FAILURE,
        payload: error,
    };
}

export function fetchAutomatedScript(
    projectId: $TSFixMe,
    skip: $TSFixMe,
    limit: $TSFixMe
) {
    return function(dispatch: $TSFixMe) {
        const promise = getApi(
            `automated-scripts/${projectId}?skip=${skip}&limit=${limit}`
        );

        promise.then(
            function(response) {
                dispatch(fetchAutomatedScriptSuccess(response.data));
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(fetchAutomatedScriptFailure(error));
            }
        );

        return promise;
    };
}

export function runAutomatedScriptRequest() {
    return {
        type: types.RUN_AUTOMATED_SCRIPT_REQUEST,
    };
}
export function runAutomatedScriptFailure(error: $TSFixMe) {
    return {
        type: types.RUN_AUTOMATED_SCRIPT_FAILURE,
        payload: error,
    };
}
export function runAutomatedScriptSuccess(data: $TSFixMe) {
    return {
        type: types.RUN_AUTOMATED_SCRIPT_SUCCESS,
        payload: data,
    };
}

export function runScript(projectId: $TSFixMe, automatedScriptId: $TSFixMe) {
    return function(dispatch: $TSFixMe) {
        const promise = putApi(
            `automated-scripts/${projectId}/${automatedScriptId}/run`
        );
        dispatch(runAutomatedScriptRequest());

        promise.then(
            function(response) {
                dispatch(runAutomatedScriptSuccess(response.data));

                return response.data;
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(runAutomatedScriptFailure(error));
            }
        );

        return promise;
    };
}

const deleteAutomatedScriptSuccess = (data: $TSFixMe) => {
    return {
        type: types.DELETE_AUTOMATED_SCRIPT_SUCCESS,
        payload: data,
    };
};

const deleteAutomatedScriptRequest = () => {
    return {
        type: types.DELETE_AUTOMATED_SCRIPT_REQUEST,
    };
};

const deleteAutomatedScriptFailure = (error: $TSFixMe) => {
    return {
        type: types.DELETE_AUTOMATED_SCRIPT_FAILURE,
        payload: error,
    };
};

export function deleteAutomatedScript(
    projectId: $TSFixMe,
    automatedSlug: $TSFixMe
) {
    return function(dispatch: $TSFixMe) {
        const promise = deleteApi(
            `automated-scripts/${projectId}/${automatedSlug}`
        );
        dispatch(deleteAutomatedScriptRequest());

        promise.then(
            function(response) {
                dispatch(deleteAutomatedScriptSuccess(response.data));
                return true;
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(deleteAutomatedScriptFailure(error));
                return false;
            }
        );

        return promise;
    };
}