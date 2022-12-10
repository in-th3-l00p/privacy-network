import {AxiosError} from "axios";

export interface ServerError {
    name: string,
    description: string
}

export type ErrorType = AxiosError<ServerError, any> | Error | null | undefined;
