export interface ILabel {
  label: string;
  value: string;
  key?: string;
}

export interface IAction<T> {
  type: T;
  payload?: any;
}

export interface IApiErrorState {
  isError: boolean;
  errorMessage: string;
  error?: any;
}
export interface IApiResponseDetails<T> extends IApiErrorState {
  data: T;
  isFetching: boolean;
}
