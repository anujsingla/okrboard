import { IDepartmentState } from '../context/DepartmentContext';
import { IAction } from '../models/shared';

// Constants
export enum DepartmentReducerConstants {
  addDepartment = 'addDepartment'
}

type IActionType = IAction<DepartmentReducerConstants>;

export const departmentReducer = (state: IDepartmentState, action: IActionType) => {
  switch (action.type) {
    case DepartmentReducerConstants.addDepartment:
      return { ...state };
    default:
      return state;
  }
};
