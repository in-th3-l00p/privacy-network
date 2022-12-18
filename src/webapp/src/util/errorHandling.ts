import {AxiosError} from "axios";

export interface ServerError {
    name: string,
    description: string
}

export type ErrorType = AxiosError<ServerError, any> | Error | null | undefined;

export function getErrorTitle(error: ErrorType) {
    if (error === null || typeof error === "undefined")
        return "";
    if (error instanceof AxiosError)
        return error.response?.data.name ? error.response.data.name : error.name;
    return error.name;
}

export function getErrorDescription(error: ErrorType) {
    if (error === null || typeof error === "undefined")
        return "";
    if (error instanceof AxiosError)
        return error.response?.data.description ? error.response.data.description : error.message;
    return error.message;
}