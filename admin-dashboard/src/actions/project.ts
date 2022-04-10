import BackendAPI from 'common-ui/src/utils/api/backend';
import { Dispatch } from 'redux';
import * as types from '../constants/project';
import PositiveNumber from 'common/types/PositiveNumber';
// Fetch Projects

export const fetchProjectsRequest = () => {
    return {
        type: types.FETCH_PROJECTS_REQUEST,
    };
};

export const fetchProjectsSuccess = (projects: $TSFixMe) => {
    return {
        type: types.FETCH_PROJECTS_SUCCESS,
        payload: projects,
    };
};

export const fetchProjectsError = (error: $TSFixMe) => {
    return {
        type: types.FETCH_PROJECTS_FAILURE,
        payload: error,
    };
};

// Calls the API to fetch all projects.
export const fetchProjects =
    (skip: PositiveNumber, limit: PositiveNumber) =>
    async (dispatch: Dispatch) => {
        skip = skip || 0;
        limit = limit || 10;

        dispatch(fetchProjectsRequest());

        try {
            const response = await BackendAPI.get(
                `project/projects/allProjects?skip=${skip}&limit=${limit}`
            );

            dispatch(fetchProjectsSuccess(response.data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(fetchProjectsError(errorMsg));
        }
    };

export const fetchProjectRequest = () => {
    return {
        type: types.FETCH_PROJECT_REQUEST,
    };
};

export const fetchProjectSuccess = (project: $TSFixMe) => {
    return {
        type: types.FETCH_PROJECT_SUCCESS,
        payload: project,
    };
};

export const fetchProjectError = (error: $TSFixMe) => {
    return {
        type: types.FETCH_PROJECT_FAILURE,
        payload: error,
    };
};

// Calls the API to fetch a project.
export const fetchProject = (slug: $TSFixMe) => async (dispatch: Dispatch) => {
    dispatch(fetchProjectRequest());

    try {
        const response = await BackendAPI.get(`project/projects/${slug}`);

        const projects = response.data;

        dispatch(fetchProjectSuccess(projects));
        return response;
    } catch (error) {
        let errorMsg;
        if (error && error.response && error.response.data)
            errorMsg = error.response.data;
        if (error && error.data) {
            errorMsg = error.data;
        }
        if (error && error.message) {
            errorMsg = error.message;
        } else {
            errorMsg = 'Network Error';
        }
        dispatch(fetchProjectError(errorMsg));
    }
};

// Team create
export const userCreateRequest = () => {
    return {
        type: types.USER_CREATE_REQUEST,
    };
};

export const userCreateSuccess = (team: $TSFixMe) => {
    return {
        type: types.USER_CREATE_SUCCESS,
        payload: team,
    };
};

export const userCreateError = (error: $TSFixMe) => {
    return {
        type: types.USER_CREATE_FAILURE,
        payload: error,
    };
};

// Calls the API to add users to project.
export const userCreate = (projectId: string, values: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.post(`team/${projectId}`, values);
        dispatch(userCreateRequest());
        promise.then(
            function (response) {
                const data = response.data;
                const projectUsers = data.filter(
                    (team: $TSFixMe) => team.projectId === projectId
                )[0];
                dispatch(userCreateSuccess(projectUsers.team));
            },
            function (error) {
                dispatch(userCreateError(error));
            }
        );

        return promise;
    };
};

export const fetchUserProjectsRequest = () => {
    return {
        type: types.FETCH_USER_PROJECTS_REQUEST,
    };
};

export const fetchUserProjectsSuccess = (users: $TSFixMe) => {
    return {
        type: types.FETCH_USER_PROJECTS_SUCCESS,
        payload: users,
    };
};

export const fetchUserProjectsError = (error: $TSFixMe) => {
    return {
        type: types.FETCH_USER_PROJECTS_FAILURE,
        payload: error,
    };
};

// Calls the API to fetch users belonging to a particular project
export const fetchProjectTeam =
    (projectId: string) => async (dispatch: Dispatch) => {
        dispatch(fetchProjectTeamRequest());
        try {
            const response = await BackendAPI.get(
                `team/${projectId}/teamMembers`
            );

            const team = response.data;
            const projectTeam = team.filter(
                (team: $TSFixMe) => team._id === projectId
            )[0];
            dispatch(fetchProjectTeamSuccess(projectTeam));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(fetchProjectTeamError(errorMsg));
        }
    };

export const fetchProjectTeamRequest = () => {
    return {
        type: types.FETCH_PROJECT_TEAM_REQUEST,
    };
};

export const fetchProjectTeamSuccess = (payload: $TSFixMe) => {
    return {
        type: types.FETCH_PROJECT_TEAM_SUCCESS,
        payload,
    };
};

export const fetchProjectTeamError = (error: $TSFixMe) => {
    return {
        type: types.FETCH_PROJECT_TEAM_ERROR,
        payload: error,
    };
};
export const userUpdateRoleRequest = (id: $TSFixMe) => {
    return {
        type: types.USER_UPDATE_ROLE_REQUEST,
        payload: id,
    };
};

export const userUpdateRoleSuccess = (team: $TSFixMe) => {
    return {
        type: types.USER_UPDATE_ROLE_SUCCESS,
        payload: team,
    };
};

export const userUpdateRoleError = (error: $TSFixMe) => {
    return {
        type: types.USER_UPDATE_ROLE_FAILURE,
        payload: error,
    };
};

export const changeUserProjectRole = (team: $TSFixMe) => {
    return {
        type: types.CHANGE_USER_PROJECT_ROLES,
        payload: team,
    };
};
// Calls the API to update user role.
export const userUpdateRole = (projectId: string, values: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = BackendAPI.put(
            `team/${projectId}/${values.teamMemberId}/changerole`,
            values
        );
        dispatch(userUpdateRoleRequest(values.teamMemberId));

        promise.then(
            function (response) {
                const data = response.data;
                const projectUsers = data.filter(
                    (user: $TSFixMe) => user.projectId === projectId
                )[0];
                dispatch(userUpdateRoleSuccess(projectUsers));
            },
            function (error) {
                dispatch(userUpdateRoleError(error));
            }
        );

        return promise;
    };
};

//userlist pagination
export const paginateNext = () => {
    return {
        type: types.PAGINATE_USERS_NEXT,
    };
};

export const paginatePrev = () => {
    return {
        type: types.PAGINATE_USERS_PREV,
    };
};

export const paginate = (type: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        type === 'next' && dispatch(paginateNext());
        type === 'prev' && dispatch(paginatePrev());
    };
};

//Add Balance to a project
export const updateBalance =
    (projectId: string, rechargeBalanceAmount: $TSFixMe) =>
    async (dispatch: Dispatch) => {
        dispatch(updateProjectBalanceRequest());

        try {
            const response = await BackendAPI.put(
                `project/${projectId}/updateBalance`,
                {
                    rechargeBalanceAmount,
                }
            );

            const data = response.data;
            dispatch(updateProjectBalanceSuccess(data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(updateProjectBalanceError(errorMsg));
        }
    };

export const updateProjectBalanceRequest = () => {
    return {
        type: types.PROJECT_BALANCE_UPDATE_REQUEST,
    };
};

export const updateProjectBalanceSuccess = (project: $TSFixMe) => {
    return {
        type: types.PROJECT_BALANCE_UPDATE_SUCCESS,
        payload: project,
    };
};

export const updateProjectBalanceError = (error: $TSFixMe) => {
    return {
        type: types.PROJECT_BALANCE_UPDATE_FAILURE,
        payload: error,
    };
};
// Calls the API to delete user from project
export const teamDelete = (projectId: string, teamMemberId: $TSFixMe) => {
    return function (dispatch: Dispatch) {
        const promise = delete (`team/${projectId}/${teamMemberId}`, null);
        dispatch(teamDeleteRequest(teamMemberId));

        promise.then(
            function (response) {
                const team = response.data;
                const projectTeam = team.filter(
                    (team: $TSFixMe) => team.projectId === projectId
                )[0];
                dispatch(teamDeleteSuccess(projectTeam.team));
                return { team };
            },
            function (error) {
                dispatch(teamDeleteError(error));
                return { error };
            }
        );

        return promise;
    };
};

export const teamDeleteRequest = (id: $TSFixMe) => {
    return {
        type: types.TEAM_DELETE_REQUEST,
        payload: id,
    };
};
export const teamDeleteSuccess = (team: $TSFixMe) => {
    return {
        type: types.TEAM_DELETE_SUCCESS,
        payload: team,
    };
};

export const teamDeleteError = (error: $TSFixMe) => {
    return {
        type: types.TEAM_DELETE_FAILURE,
        payload: error,
    };
};

export const teamDeleteReset = () => {
    return {
        type: types.TEAM_DELETE_RESET,
    };
};
export const resetTeamDelete = () => {
    return function (dispatch: Dispatch) {
        dispatch(teamDeleteReset());
    };
};

// Calls the API to fetch all user projects.
export const fetchUserProjects =
    (userId: string, skip: PositiveNumber, limit: PositiveNumber) =>
    async (dispatch: Dispatch) => {
        skip = skip ? parseInt(skip) : 0;
        limit = limit ? parseInt(limit) : 10;

        dispatch(fetchUserProjectsRequest());

        try {
            const response = await BackendAPI.get(
                `project/projects/user/${userId}?skip=${skip}&limit=${limit}`
            );

            const users = response.data;

            dispatch(fetchUserProjectsSuccess(users));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(fetchUserProjectsError(errorMsg));
        }
    };

//Delete project
export const deleteProjectRequest = () => {
    return {
        type: types.DELETE_PROJECT_REQUEST,
    };
};

export const deleteProjectReset = () => {
    return {
        type: types.DELETE_PROJECT_RESET,
    };
};

export const deleteProjectSuccess = (project: $TSFixMe) => {
    return {
        type: types.DELETE_PROJECT_SUCCESS,
        payload: project,
    };
};

export const deleteProjectError = (error: $TSFixMe) => {
    return {
        type: types.DELETE_PROJECT_FAILED,
        payload: error,
    };
};

// Calls the API to delete a project
export const deleteProject =
    (projectId: string) => async (dispatch: Dispatch) => {
        dispatch(deleteProjectRequest());

        try {
            const response = await delete `project/${projectId}/deleteProject`;

            const data = response.data;

            dispatch(deleteProjectSuccess(data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(deleteProjectError(errorMsg));
        }
    };

//Block project
export const blockProjectRequest = () => {
    return {
        type: types.BLOCK_PROJECT_REQUEST,
    };
};

export const blockProjectReset = () => {
    return {
        type: types.BLOCK_PROJECT_RESET,
    };
};

export const blockProjectSuccess = (project: $TSFixMe) => {
    return {
        type: types.BLOCK_PROJECT_SUCCESS,
        payload: project,
    };
};

export const blockProjectError = (error: $TSFixMe) => {
    return {
        type: types.BLOCK_PROJECT_FAILED,
        payload: error,
    };
};

// Calls the API to block a project
export const blockProject =
    (projectId: string) => async (dispatch: Dispatch) => {
        dispatch(blockProjectRequest());

        try {
            const response = await BackendAPI.put(
                `project/${projectId}/blockProject`
            );

            const data = response.data;

            dispatch(blockProjectSuccess(data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(blockProjectError(errorMsg));
        }
    };

//Renew Alert Limit
export const renewAlertLimitRequest = () => {
    return {
        type: types.ALERT_LIMIT_REQUEST,
    };
};

export const renewAlertLimitReset = () => {
    return {
        type: types.ALERT_LIMIT_RESET,
    };
};

export const renewAlertLimitSuccess = (project: $TSFixMe) => {
    return {
        type: types.ALERT_LIMIT_SUCCESS,
        payload: project,
    };
};

export const renewAlertLimitError = (error: $TSFixMe) => {
    return {
        type: types.ALERT_LIMIT_FAILED,
        payload: error,
    };
};

// Calls the API to block a project
export const renewAlertLimit =
    (projectId: string, alertLimit: PositiveNumber) =>
    async (dispatch: Dispatch) => {
        dispatch(renewAlertLimitRequest());

        try {
            const response = await BackendAPI.put(
                `project/${projectId}/renewAlertLimit`,
                {
                    alertLimit,
                }
            );

            const data = response.data;

            dispatch(renewAlertLimitSuccess(data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(renewAlertLimitError(errorMsg));
        }
    };

//Restore project
export const restoreProjectRequest = () => {
    return {
        type: types.RESTORE_PROJECT_REQUEST,
    };
};

export const restoreProjectReset = () => {
    return {
        type: types.RESTORE_PROJECT_RESET,
    };
};

export const restoreProjectSuccess = (project: $TSFixMe) => {
    return {
        type: types.RESTORE_PROJECT_SUCCESS,
        payload: project,
    };
};

export const restoreProjectError = (error: $TSFixMe) => {
    return {
        type: types.RESTORE_PROJECT_FAILED,
        payload: error,
    };
};

// Calls the API to restore a project
export const restoreProject =
    (projectId: string) => async (dispatch: Dispatch) => {
        dispatch(restoreProjectRequest());

        try {
            const response = await BackendAPI.put(
                `project/${projectId}/restoreProject`
            );

            const data = response.data;

            dispatch(restoreProjectSuccess(data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(restoreProjectError(errorMsg));
        }
    };

//Unblock project
export const unblockProjectRequest = () => {
    return {
        type: types.UNBLOCK_PROJECT_REQUEST,
    };
};

export const unblockProjectReset = () => {
    return {
        type: types.UNBLOCK_PROJECT_RESET,
    };
};

export const unblockProjectSuccess = (project: $TSFixMe) => {
    return {
        type: types.UNBLOCK_PROJECT_SUCCESS,
        payload: project,
    };
};

export const unblockProjectError = (error: $TSFixMe) => {
    return {
        type: types.UNBLOCK_PROJECT_FAILED,
        payload: error,
    };
};

// Calls the API to un-block a project
export const unblockProject =
    (projectId: string) => async (dispatch: Dispatch) => {
        dispatch(unblockProjectRequest());

        try {
            const response = await BackendAPI.put(
                `project/${projectId}/unblockProject`
            );

            const data = response.data;

            dispatch(unblockProjectSuccess(data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(unblockProjectError(errorMsg));
        }
    };

//Add Project Notes
export const addProjectNoteRequest = () => {
    return {
        type: types.ADD_PROJECT_NOTE_REQUEST,
    };
};

export const addProjectNoteReset = () => {
    return {
        type: types.ADD_PROJECT_NOTE_RESET,
    };
};

export const addProjectNoteSuccess = (projectNote: $TSFixMe) => {
    return {
        type: types.ADD_PROJECT_NOTE_SUCCESS,
        payload: projectNote,
    };
};

export const addProjectNoteError = (error: $TSFixMe) => {
    return {
        type: types.ADD_PROJECT_NOTE_FAILURE,
        payload: error,
    };
};

// Calls the API to add Admin Note
export const addProjectNote =
    (projectId: string, values: $TSFixMe) => async (dispatch: Dispatch) => {
        dispatch(addProjectNoteRequest());

        try {
            const response = await BackendAPI.post(
                `project/${projectId}/addNote`,
                values
            );

            const data = response.data;

            dispatch(addProjectNoteSuccess(data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(addProjectNoteError(errorMsg));
        }
    };

//Search Projects
export const searchProjectsRequest = () => {
    return {
        type: types.SEARCH_PROJECTS_REQUEST,
    };
};

export const searchProjectsReset = () => {
    return {
        type: types.SEARCH_PROJECTS_RESET,
    };
};

export const searchProjectsSuccess = (projects: $TSFixMe) => {
    return {
        type: types.SEARCH_PROJECTS_SUCCESS,
        payload: projects,
    };
};

export const searchProjectsError = (error: $TSFixMe) => {
    return {
        type: types.SEARCH_PROJECTS_FAILURE,
        payload: error,
    };
};

// Calls the search projects api
export const searchProjects =
    (filter: $TSFixMe, skip: PositiveNumber, limit: PositiveNumber) =>
    async (dispatch: Dispatch) => {
        const values = {
            filter,
        };

        dispatch(searchProjectsRequest());

        try {
            const response = await BackendAPI.post(
                `project/projects/search?skip=${skip}&limit=${limit}`,
                values
            );

            const data = response.data;

            dispatch(searchProjectsSuccess(data));
            return response;
        } catch (error) {
            let errorMsg;
            if (error && error.response && error.response.data)
                errorMsg = error.response.data;
            if (error && error.data) {
                errorMsg = error.data;
            }
            if (error && error.message) {
                errorMsg = error.message;
            } else {
                errorMsg = 'Network Error';
            }
            dispatch(searchProjectsError(errorMsg));
        }
    };

// Upgrade a Project
export const changePlanRequest = () => {
    return {
        type: types.CHANGE_PLAN_REQUEST,
    };
};

export const changePlanSuccess = (payload: $TSFixMe) => {
    return {
        type: types.CHANGE_PLAN_SUCCESS,
        payload,
    };
};

export const changePlanFailure = (error: $TSFixMe) => {
    return {
        type: types.CHANGE_PLAN_FAILURE,
        payload: error,
    };
};

export const changePlan =
    (
        projectId: string,
        planId: $TSFixMe,
        projectName: $TSFixMe,
        oldPlan: $TSFixMe,
        newPlan: $TSFixMe
    ) =>
    async (dispatch: Dispatch) => {
        dispatch(changePlanRequest());

        try {
            const response = await BackendAPI.put(
                `project/${projectId}/admin/changePlan`,
                {
                    projectName,
                    planId,
                    oldPlan,
                    newPlan,
                }
            );

            dispatch(changePlanSuccess(response.data));
        } catch (error) {
            const errorMsg =
                error.response && error.response.data
                    ? error.response.data
                    : error.data
                    ? error.data
                    : error.message
                    ? error.message
                    : 'Network Error';
            dispatch(changePlanFailure(errorMsg));
        }
    };

export const fetchProjectDomainsRequest = () => {
    return {
        type: types.PROJECT_DOMAIN_REQUEST,
    };
};

export const fetchProjectDomainsSuccess = (payload: $TSFixMe) => {
    return {
        type: types.PROJECT_DOMAIN_SUCCESS,
        payload,
    };
};

export const fetchProjectDomainsFailure = (error: $TSFixMe) => {
    return {
        type: types.PROJECT_DOMAIN_FAILURE,
        payload: error,
    };
};

export const fetchProjectDomains = (
    projectId: string,
    skip = 0,
    limit = 10
) => {
    return async function (dispatch: Dispatch) {
        dispatch(fetchProjectDomainsRequest());

        try {
            const response = await BackendAPI.get(
                `domainVerificationToken/${projectId}/domains?skip=${skip}&limit=${limit}`
            );

            dispatch(fetchProjectDomainsSuccess(response.data));

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response && error.response.data
                    ? error.response.data
                    : error.data
                    ? error.data
                    : error.message
                    ? error.message
                    : 'Network Error';
            dispatch(fetchProjectDomainsFailure(errorMessage));
        }
    };
};

export const deleteProjectDomainRequest = () => {
    return {
        type: types.DELETE_PROJECT_DOMAIN_REQUEST,
    };
};

export const deleteProjectDomainSuccess = (payload: $TSFixMe) => {
    return {
        type: types.DELETE_PROJECT_DOMAIN_SUCCESS,
        payload,
    };
};

export const deleteProjectDomainFailure = (error: $TSFixMe) => {
    return {
        type: types.DELETE_PROJECT_DOMAIN_FAILURE,
        payload: error,
    };
};

export const resetDeleteProjectDomain = () => {
    return {
        type: types.RESET_DELETE_PROJECT_DOMAIN,
    };
};

export const deleteProjectDomain = ({ projectId, domainId }: $TSFixMe) => {
    return async function (dispatch: Dispatch) {
        dispatch(deleteProjectDomainRequest());

        const promise =
            delete `domainVerificationToken/${projectId}/domain/${domainId}`;
        promise.then(
            function (response) {
                dispatch(deleteProjectDomainSuccess(response.data));

                return response.data;
            },
            function (error) {
                const errorMessage =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(deleteProjectDomainFailure(errorMessage));
            }
        );
        return promise;
    };
};

export const verifyProjectDomainRequest = () => {
    return {
        type: types.VERIFY_PROJECT_DOMAIN_REQUEST,
    };
};

export const verifyProjectDomainSuccess = (payload: $TSFixMe) => {
    return {
        type: types.VERIFY_PROJECT_DOMAIN_SUCCESS,
        payload,
    };
};

export const verifyProjectDomainFailure = (error: $TSFixMe) => {
    return {
        type: types.VERIFY_PROJECT_DOMAIN_FAILURE,
        payload: error,
    };
};

export const resetVerifyProjectDomain = () => {
    return {
        type: types.RESET_VERIFY_PROJECT_DOMAIN,
    };
};

export const verifyProjectDomain = ({ projectId, domainId }: $TSFixMe) => {
    return async function (dispatch: Dispatch) {
        dispatch(verifyProjectDomainRequest());

        try {
            const response = await BackendAPI.put(
                `domainVerificationToken/${projectId}/forceVerify/${domainId}`
            );

            dispatch(verifyProjectDomainSuccess(response.data));

            return response.data;
        } catch (error) {
            const errorMessage =
                error.response && error.response.data
                    ? error.response.data
                    : error.data
                    ? error.data
                    : error.message
                    ? error.message
                    : 'Network Error';
            dispatch(verifyProjectDomainFailure(errorMessage));
        }
    };
};

export const unVerifyProjectDomainRequest = () => {
    return {
        type: types.UNVERIFY_PROJECT_DOMAIN_REQUEST,
    };
};

export const unVerifyProjectDomainSuccess = (payload: $TSFixMe) => {
    return {
        type: types.UNVERIFY_PROJECT_DOMAIN_SUCCESS,
        payload,
    };
};

export const unVerifyProjectDomainFailure = (error: $TSFixMe) => {
    return {
        type: types.UNVERIFY_PROJECT_DOMAIN_FAILURE,
        payload: error,
    };
};

export const resetUnverifyProjectDomain = () => {
    return {
        type: types.RESET_UNVERIFY_PROJECT_DOMAIN,
    };
};

export const unVerifyProjectDomain = (
    projectId: string,
    domainId: $TSFixMe
) => {
    return async function (dispatch: Dispatch) {
        dispatch(unVerifyProjectDomainRequest());

        const promise = BackendAPI.put(
            `domainVerificationToken/${projectId}/unverify/${domainId}`
        );
        promise.then(
            function (response) {
                dispatch(unVerifyProjectDomainSuccess(response.data));
            },
            function (error) {
                const errorMessage =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(unVerifyProjectDomainFailure(errorMessage));
            }
        );
        return promise;
    };
};

export const resetProjectDomainRequest = () => {
    return {
        type: types.RESET_PROJECT_DOMAIN_REQUEST,
    };
};

export const resetProjectDomainSuccess = (payload: $TSFixMe) => {
    return {
        type: types.RESET_PROJECT_DOMAIN_SUCCESS,
        payload,
    };
};

export const resetProjectDomainFailure = (error: $TSFixMe) => {
    return {
        type: types.RESET_PROJECT_DOMAIN_FAILURE,
        payload: error,
    };
};

export const resetProjectDomainOnMount = () => {
    return {
        type: types.RESET_PROJECT_DOMAIN_ON_MOUNT,
    };
};

export const resetProjectDomain = (projectId: string, domainId: $TSFixMe) => {
    return async function (dispatch: Dispatch) {
        dispatch(resetProjectDomainRequest());

        const promise = BackendAPI.put(
            `domainVerificationToken/${projectId}/resetDomain/${domainId}`
        );
        promise.then(
            function (response) {
                dispatch(resetProjectDomainSuccess(response.data));
            },
            function (error) {
                const errorMessage =
                    error.response && error.response.data
                        ? error.response.data
                        : error.data
                        ? error.data
                        : error.message
                        ? error.message
                        : 'Network Error';
                dispatch(resetProjectDomainFailure(errorMessage));
            }
        );
        return promise;
    };
};