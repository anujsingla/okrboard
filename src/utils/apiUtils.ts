import { IApiResponseDetails } from "../models/shared";

export function getApiResourceObject<T>(
    data: T = undefined,
    isFetching: boolean = false,
    isError: boolean = false,
    errorMessage: string = '',
    error: Error = null
): IApiResponseDetails<T> {
    return { data, isFetching, isError, errorMessage, error };
}