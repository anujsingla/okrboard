import React, { useContext } from 'react';
import { departmentReducer } from '../reducers/DepartmentReducer';

export interface IDepartment {
  id: number;
  name: string;
}

export interface IDepartmentState {
  department: IDepartment[];
}

export const initialDepartmentState: IDepartmentState = {
  department: [{ id: 0, name: '' }]
};

export interface IDepartmentStateContext {
  departmentState: IDepartmentState;
}
const initialStateContext: IDepartmentStateContext = {
  departmentState: initialDepartmentState
};
const initalDispatchContext = null;

export const DepartmentStateContext = React.createContext(initialStateContext);
export const DepartmentDispatchContext = React.createContext(initalDispatchContext);

export const useDepartmentStateContext = () => useContext(DepartmentStateContext);
export const useDepartmentDispatchContext = () => useContext(DepartmentDispatchContext);

export function DepartmentContextProvider({ children }) {
  const [departmentState, dispatch] = React.useReducer(departmentReducer, initialDepartmentState);
  return (
    <DepartmentStateContext.Provider value={{ departmentState }}>
      <DepartmentDispatchContext.Provider value={dispatch}>{children}</DepartmentDispatchContext.Provider>
    </DepartmentStateContext.Provider>
  );
}
