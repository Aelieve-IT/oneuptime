import BackendAPI from 'common-ui/src/utils/api/backend';
import { Dispatch } from 'redux';
import * as types from '../constants/schedule';
import ErrorPayload from 'common-ui/src/payload-types/error';
import PositiveNumber from 'common/types/PositiveNumber';

// Get a payload of Schedules
export const resetSchedule = () => {
    return {
        type: types.SCHEDULE_FETCH_RESET,
    };
};

export const scheduleRequest = (promise: $TSFixMe) => {
    return {
        type: types.SCHEDULE_FETCH_REQUEST,
        payload: promise,
    };
};

export const scheduleError = (error: ErrorPayload) => {
    return {
        type: types.SCHEDULE_FETCH_FAILED,
        payload: error,
    };
};

export const scheduleSuccess = (schedule: $TSFixMe) => {
    return {
        type: types.SCHEDULE_FETCH_SUCCESS,
        payload: schedule,
    };
};

// Calls the API to fetch Schedules.

export function fetchSchedules(
    projectId: string,
    skip: PositiveNumber,
    limit: PositiveNumber
) {
    return function (dispatch: Dispatch) {
        let promise = null;
        promise = BackendAPI.get(
            `schedule/${projectId}?skip=${skip || 0}&limit=${limit || 10}`
        );
        promise.then(
            function (schedule) {
                dispatch(scheduleSuccess(schedule.data));
            },
            function (error) {
                dispatch(scheduleError(error));
            }
        );

        return promise;
    };
}

// Get a payload of SubProject Schedules

export const resetSubProjectSchedule = () => {
    return {
        type: types.SUBPROJECT_SCHEDULE_FETCH_RESET,
    };
};

export const subProjectScheduleRequest = (promise: $TSFixMe) => {
    return {
        type: types.SUBPROJECT_SCHEDULE_FETCH_REQUEST,
        payload: promise,
    };
};

export const subProjectScheduleError = (error: ErrorPayload) => {
    return {
        type: types.SUBPROJECT_SCHEDULE_FETCH_FAILED,
        payload: error,
    };
};

export const subProjectScheduleSuccess = (schedule: $TSFixMe) => {
    return {
        type: types.SUBPROJECT_SCHEDULE_FETCH_SUCCESS,
        payload: schedule,
    };
};

// Calls the API to fetch Schedules.

export const fetchSubProjectSchedules = (projectId: string) => {
    return function (dispatch: Dispatch) {
        let promise = null;
        promise = BackendAPI.get(`schedule/${projectId}/schedules`);

        dispatch(subProjectScheduleRequest());
        promise.then(
            function (schedule) {
                dispatch(subProjectScheduleSuccess(schedule.data));
            },
            function (error) {
                dispatch(subProjectScheduleError(error));
            }
        );

        return promise;
    };
};

export const resetProjectSchedule = () => {
    return {
        type: types.PROJECT_SCHEDULE_FETCH_RESET,
    };
};

export const projectScheduleRequest = (promise: $TSFixMe) => {
    return {
        type: types.PROJECT_SCHEDULE_FETCH_REQUEST,
        payload: promise,
    };
};

export const projectScheduleError = (error: ErrorPayload) => {
    return {
        type: types.PROJECT_SCHEDULE_FETCH_FAILED,
        payload: error,
    };
};

export const projectScheduleSuccess = (schedule: $TSFixMe) => {
    return {
        type: types.PROJECT_SCHEDULE_FETCH_SUCCESS,
        payload: schedule,
    };
};

// Gets list of schedules in a project.

export function fetchProjectSchedule(
    projectId: string,
    skip: PositiveNumber,
    limit: PositiveNumber
) {
    return function (dispatch: Dispatch) {
        let promise = null;
        promise = BackendAPI.get(
            `schedule/${projectId}/schedule?skip=${skip}&limit=${limit}`
        );
        promise.then(
            function (schedule) {
                const data = schedule.data;
                data.projectId = projectId;
                dispatch(projectScheduleSuccess(data));
            },
            function (error) {
                dispatch(projectScheduleError(error));
            }
        );

        return promise;
    };
}

// Create a new schedule

export const createScheduleRequest = () => {
    return {
        type: types.CREATE_SCHEDULE_REQUEST,
    };
};

export const createScheduleError = (error: ErrorPayload) => {
    return {
        type: types.CREATE_SCHEDULE_FAILED,
        payload: error,
    };
};

export const createScheduleSuccess = (schedule: $TSFixMe) => {
    return {
        type: types.CREATE_SCHEDULE_SUCCESS,
        payload: schedule,
    };
};

// Calls the API to create the schedule.

export const createSchedule = (projectId: string, values: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(`schedule/${projectId}`, values);

        dispatch(createScheduleRequest());

        promise.then(
            function (schedule) {
                dispatch(createScheduleSuccess(schedule.data));
            },
            function (error) {
                dispatch(createScheduleError(error));
            }
        );
        return promise;
    };
};

// Rename a Schedule

export const renameScheduleReset = () => {
    return {
        type: types.RENAME_SCHEDULE_RESET,
    };
};

export const renameScheduleRequest = () => {
    return {
        type: types.RENAME_SCHEDULE_REQUEST,
        payload: true,
    };
};

export const renameScheduleSuccess = (schedule: $TSFixMe) => {
    return {
        type: types.RENAME_SCHEDULE_SUCCESS,
        payload: schedule.data,
    };
};

export const renameScheduleError = (error: ErrorPayload) => {
    return {
        type: types.RENAME_SCHEDULE_FAILED,
        payload: error,
    };
};

export function renameSchedule(
    projectId: string,
    scheduleId: $TSFixMe,
    scheduleName: $TSFixMe
) {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.put(`schedule/${projectId}/${scheduleId}`, {
            name: scheduleName,
        });

        dispatch(renameScheduleRequest());

        promise
            .then(
                function (schedule) {
                    dispatch(renameScheduleSuccess(schedule));
                },
                function (error) {
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
                    dispatch(renameScheduleError(error));
                }
            )
            .then(function () {
                dispatch(renameScheduleReset());
            });

        return promise;
    };
}

// Delete a Schedule

export const deleteScheduleReset = () => {
    return {
        type: types.DELETE_SCHEDULE_RESET,
    };
};

export const deleteScheduleRequest = () => {
    return {
        type: types.DELETE_SCHEDULE_REQUEST,
        payload: true,
    };
};

export const deleteScheduleSuccess = (schedule: $TSFixMe) => {
    return {
        type: types.DELETE_SCHEDULE_SUCCESS,
        payload: schedule.data,
    };
};

export const deleteProjectSchedules = (projectId: string) => {
    return {
        type: types.DELETE_PROJECT_SCHEDULES,
        payload: projectId,
    };
};

export const deleteScheduleError = (error: ErrorPayload) => {
    return {
        type: types.DELETE_SCHEDULE_FAILED,
        payload: error,
    };
};

export const deleteSchedule = (projectId: string, scheduleId: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = delete `schedule/${projectId}/${scheduleId}`;

        dispatch(deleteScheduleRequest());

        promise
            .then(
                function (schedule) {
                    const data = Object.assign(
                        {},
                        { scheduleId },

                        schedule.data
                    );

                    dispatch(fetchSchedules(projectId));
                    return dispatch(deleteScheduleSuccess({ data }));
                },
                function (error) {
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
                    dispatch(deleteScheduleError(error));
                }
            )
            .then(function () {
                dispatch(deleteScheduleReset());
            });

        return promise;
    };
};

// Add Monitors to Schedule

export const addMonitorReset = () => {
    return {
        type: types.ADD_MONITOR_RESET,
    };
};

export const addMonitorRequest = () => {
    return {
        type: types.ADD_MONITOR_REQUEST,
        payload: true,
    };
};

export const addMonitorSuccess = (schedule: $TSFixMe) => {
    return {
        type: types.ADD_MONITOR_SUCCESS,
        payload: schedule.data,
    };
};

export const addMonitorError = (error: ErrorPayload) => {
    return {
        type: types.ADD_MONITOR_FAILED,
        payload: error,
    };
};

export function addMonitors(
    projectId: string,
    scheduleId: $TSFixMe,
    data: $TSFixMe
) {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.put(
            `schedule/${projectId}/${scheduleId}`,
            data
        );

        dispatch(addMonitorRequest());

        promise
            .then(
                function (schedule) {
                    dispatch(addMonitorSuccess(schedule));
                },
                function (error) {
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
                    dispatch(addMonitorError(error));
                }
            )
            .then(function () {
                dispatch(addMonitorReset());
            });

        return promise;
    };
}

// Add Users to Schedule

export const addUserReset = () => {
    return {
        type: types.ADD_USER_RESET,
    };
};

export const addUserRequest = () => {
    return {
        type: types.ADD_USER_REQUEST,
        payload: true,
    };
};

export const addUserSuccess = (schedule: $TSFixMe) => {
    return {
        type: types.ADD_USER_SUCCESS,
        payload: schedule.data,
    };
};

export const addUserError = (error: ErrorPayload) => {
    return {
        type: types.ADD_USER_FAILED,
        payload: error,
    };
};

export function addUsers(
    projectId: string,
    scheduleId: $TSFixMe,
    data: $TSFixMe
) {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(
            `schedule/${projectId}/${scheduleId}/addUsers`,
            data
        );

        dispatch(addUserRequest());

        promise
            .then(
                function (schedule) {
                    dispatch(addUserSuccess(schedule));
                },
                function (error) {
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
                    dispatch(addUserError(error));
                }
            )
            .then(function () {
                dispatch(addUserReset());
            });

        return promise;
    };
}

// onCallAlertBox

export const escalationReset = () => {
    return {
        type: types.ESCALATION_RESET,
    };
};

export const escalationRequest = () => {
    return {
        type: types.ESCALATION_REQUEST,
        payload: true,
    };
};

export const escalationSuccess = (escalation: $TSFixMe) => {
    return {
        type: types.ESCALATION_SUCCESS,
        payload: escalation,
    };
};

export const escalationError = (error: ErrorPayload) => {
    return {
        type: types.ESCALATION_FAILED,
        payload: error,
    };
};

export function addEscalation(
    projectId: string,
    scheduleId: $TSFixMe,
    data: $TSFixMe
) {
    data = data.OnCallAlertBox;

    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(
            `schedule/${projectId}/${scheduleId}/addescalation`,
            data
        );

        dispatch(escalationRequest());

        promise.then(
            function (escalation) {
                dispatch(escalationSuccess(escalation));
            },
            function (error) {
                dispatch(escalationError(error));
            }
        );

        return promise;
    };
}

export const getEscalation = (projectId: string, scheduleId: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.get(
            `schedule/${projectId}/${scheduleId}/getescalation`
        );

        dispatch(escalationRequest());

        promise.then(
            function (escalation) {
                dispatch(escalationSuccess(escalation.data));
            },
            function (error) {
                dispatch(escalationError(error));
            }
        );

        return promise;
    };
};

// Implements pagination for Team Members table

export const paginateNext = () => {
    return {
        type: types.PAGINATE_NEXT,
    };
};

export const paginatePrev = () => {
    return {
        type: types.PAGINATE_PREV,
    };
};

export const paginateReset = () => {
    return {
        type: types.PAGINATE_RESET,
    };
};

export const paginate = (type: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        type === 'next' && dispatch(paginateNext());
        type === 'prev' && dispatch(paginatePrev());
        type === 'reset' && dispatch(paginateReset());
    };
};

export const userScheduleReset = () => {
    return {
        type: types.USER_SCHEDULE_RESET,
    };
};

export const userScheduleRequest = () => {
    return {
        type: types.USER_SCHEDULE_REQUEST,
    };
};

export const userScheduleSuccess = (userSchedule: $TSFixMe) => {
    return {
        type: types.USER_SCHEDULE_SUCCESS,
        payload: userSchedule,
    };
};

export const userScheduleError = (error: ErrorPayload) => {
    return {
        type: types.USER_SCHEDULE_FAILED,
        payload: error,
    };
};

export const fetchUserSchedule = (projectId: string, userId: string) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.get(
            `schedule/${projectId}/${userId}/getescalations`
        );

        dispatch(userScheduleRequest());

        promise.then(
            function (schedule) {
                dispatch(userScheduleSuccess(schedule.data));
            },
            function (error) {
                dispatch(userScheduleError(error));
            }
        );

        return promise;
    };
};