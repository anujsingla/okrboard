import { getAllDepartments, getObjectives, getKeyResult, getUsers } from '../api/apis';
import { IAction } from '../models/shared';
import { getApiResourceObject } from '../utils/apiUtils';

export interface IApplicationState {
    department?: any;
    objective?: any;
    users?: any;
    keyResults?: any;
}

export const initialApplicationState: IApplicationState = {
    department: [],
    objective: [],
    users: [],
    keyResults: []
};

// Constants
export enum ApplicationReducerConstants {
    addDepartment = 'addDepartment',
    updateAllFields = 'updateAllFields',
    fetchObjective = 'fetchObjective'
}

type IActionType = IAction<ApplicationReducerConstants>;

export const applicationReducer = (state: IApplicationState, action: IActionType) => {
    switch (action.type) {
        case ApplicationReducerConstants.fetchObjective:
            return {
                ...state,
                objective: action.payload.fields || []
            };
        case ApplicationReducerConstants.updateAllFields:
            const { department, users, objective, keyResults } = action.payload.fields.data;
            return {
                ...state,
                department: department || [],
                users: users || [],
                objective: objective || [],
                keyResults: keyResults || []
            };
        default:
            return state;
    }
};

// Actions
export const fetchAllFieldsValue = async (dispatch: any) => {
    dispatch({
        type: ApplicationReducerConstants.updateAllFields,
        payload: { fields: getApiResourceObject([], true) }
    });
    try {
        const responses = await Promise.all([getAllDepartments(), getObjectives(), getKeyResult(), getUsers()]);
        const fields = {
            department: responses[0],
            objective: responses[1],
            keyResults: responses[2],
            users: responses[3]
        };
        dispatch({
            type: ApplicationReducerConstants.updateAllFields,
            payload: { fields: getApiResourceObject(fields) }
        });
    } catch (e) {
        console.log('error', e);
        dispatch({
            type: ApplicationReducerConstants.updateAllFields,
            payload: { fields: getApiResourceObject([], false, true, e.message) }
        });
    }
};

export const fetchObjective = async (dispatch: any) => {
    try {
        const responses = await getObjectives();
        dispatch({
            type: ApplicationReducerConstants.fetchObjective,
            payload: { fields: responses || [] }
        });
    } catch (e) {
        console.log('error', e);
        dispatch({
            type: ApplicationReducerConstants.fetchObjective,
            payload: { fields: [] }
        });
    }
};
