import React, {Dispatch, SetStateAction} from "react";
import {Alert} from "react-bootstrap";
import {ErrorType, getErrorDescription, getErrorTitle} from "../util/errorHandling";
import {AxiosError} from "axios";


interface ErrorAlertProps {
    title?: string;
    error: ErrorType;
    setError: Dispatch<SetStateAction<ErrorType>>;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({title, error, setError}) => {
    if (error === null || error === undefined)
        return <></>;
    if (error instanceof AxiosError)
        return (
            <Alert variant={"danger"} onClose={() => setError(null)} dismissible>
                <h4>{title ? title : getErrorTitle(error)}</h4>
                <p>{getErrorDescription(error)}</p>
            </Alert>
        )
    return (
        <Alert variant={"danger"} onClose={() => setError(null)} dismissible>
            <h4>{title ? title : error.name}</h4>
            <p>{error.message}</p>
        </Alert>
    )
}

export default ErrorAlert;