import includes from 'lodash/includes';

export function getUri<T>(uri): Promise<T> {
    const params: RequestInit = {
        method: 'GET'
    };
    // mergeRequestOptions(params, baseParams);
    // extraParams && mergeRequestOptions(params, extraParams);
    return callFetchAndHandleJwt(uri, params);
}

export function postUri<T>(uri, body?: any): Promise<T> {
    const params: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(body)
    };
    // mergeRequestOptions(params, baseParams);
    // extraParams && mergeRequestOptions(params, extraParams);
    return callFetchAndHandleJwt(uri, params);
}

export function putUri<T>(uri, body: any): Promise<T> {
    const params: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(body)
    };
    return callFetchAndHandleJwt(uri, params);
}

export function patchUri<T>(uri, body: any): Promise<T> {
    const params: RequestInit = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(body)
    };
    return callFetchAndHandleJwt(uri, params);
}

export function deleteUri<T>(uri, extraParams?: RequestInit): Promise<T> {
    const params: RequestInit = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    };
    return callFetchAndHandleJwt(uri, params);
}

async function callFetchAndHandleJwt<T>(uri, params: RequestInit): Promise<T> {
    // params.headers['Authorization'] = '';
    return new Promise((resolve, reject) => {
        fetch(uri.toString(), params)
            .then(responseHandler)
            .then((output: T) => {
                console.log('resolve', output);
                resolve(output as any);
            })
            .catch(error => {
                console.log('rreject', error);
                reject(error);
            });
    });
}

function responseHandler<T>(response: Response): Promise<T | string> {
    try {
        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && includes(contentType, 'json')) {
                return response
                    .json()
                    .then(j => Promise.resolve(j))
                    .catch(e => Promise.resolve({}));
            } else if (contentType && includes(contentType, 'text')) {
                return response.text();
            } else {
                // Defaulting to text if content type cannot be determined
                // https://github.com/github/fetch/issues/268#issuecomment-176544728
                return response
                    .text()
                    .then(j => Promise.resolve(j ? JSON.parse(j) : {}))
                    .catch(e => Promise.resolve({}));
            }
        } else {
            return errorHandler(response);
        }
    } catch (error) {
        console.log('error calling api', error);
    }
}

function errorHandler(response: Response) {
    return response.text().then(body => {
        if (body == null || body === '') {
            const error = new Error(body);
            Object.assign(error, { status: response.status }, { statusText: response.statusText });
            throw error;
        }
        let parsedError;
        try {
            parsedError = JSON.parse(body);
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error(e);
        }
        if (parsedError) {
            const error = new Error((parsedError && parsedError.message) || body);
            Object.assign(
                error,
                parsedError,
                { isApiError: true },
                { status: response.status },
                { statusText: response.statusText }
            );
            throw error;
        } else {
            const error = new Error(body);
            Object.assign(error, { status: response.status }, { statusText: response.statusText });
            throw error;
        }
    });
}
