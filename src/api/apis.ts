import { getUri, postUri, deleteUri, putUri } from '../utils/fetch';

const prefixUrl = 'http://abhiskum-rdu-2.usersys.redhat.com:8181/okr/api';

export async function getAllDepartments(): Promise<any> {
    const uri = `${prefixUrl}/departments`;
    return getUri<any>(uri);
}

export async function addDepartment(payload): Promise<any> {
    const uri = `${prefixUrl}/departments`;
    return postUri<any>(uri, payload);
}

export async function createObjective(payload): Promise<any> {
    const uri = `${prefixUrl}/objectives`;
    return postUri<any>(uri, payload);
}

export async function deleteObjective({ id }): Promise<any> {
    const uri = `${prefixUrl}/objectives/${id}`;
    return deleteUri<any>(uri);
}

export async function editObjective({ id, payload }): Promise<any> {
    const uri = `${prefixUrl}/objectives/${id}`;
    return await putUri<any>(uri, payload);
}

export async function getObjectives(): Promise<any> {
    const uri = `${prefixUrl}/objectives`;
    return getUri<any>(uri);
}

export async function createKeyResult(payload): Promise<any> {
    const uri = `${prefixUrl}/keyresults`;
    return await postUri<any>(uri, payload);
}

export async function getKeyResult(): Promise<any> {
    const uri = `${prefixUrl}/keyresults`;
    return getUri<any>(uri);
}

export async function getUsers(): Promise<any> {
    const uri = `${prefixUrl}/users`;
    return getUri<any>(uri);
}

export async function createUsers(payload): Promise<any> {
    const uri = `${prefixUrl}/users`;
    return await postUri<any>(uri, payload);
}
