import React, { useContext, useReducer } from 'react';
import { applicationReducer, IApplicationState, initialApplicationState } from '../reducers/ApplicationReducer';

export interface IApplicationStateContext {
  applicationState: IApplicationState;
}
const initialStateContext: IApplicationStateContext = {
  applicationState: initialApplicationState
};
const initalDispatchContext = null;

export const ApplicationStateContext = React.createContext(initialStateContext);
export const ApplicationDispatchContext = React.createContext(initalDispatchContext);

export const useApplicationStateContext = () => useContext(ApplicationStateContext);
export const useApplicationDispatchContext = () => useContext(ApplicationDispatchContext);

export function ApplicationContextProvider({ children }) {
  const [applicationState, dispatch] = useReducer(applicationReducer, initialApplicationState);
  return (
    <ApplicationStateContext.Provider value={{ applicationState }}>
      <ApplicationDispatchContext.Provider value={dispatch}>{children}</ApplicationDispatchContext.Provider>
    </ApplicationStateContext.Provider>
  );
}
