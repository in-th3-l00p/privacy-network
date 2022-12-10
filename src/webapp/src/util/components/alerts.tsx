import React, {Dispatch, SetStateAction} from "react";
import {Alert} from "react-bootstrap";
import {ErrorType} from "../errorHandling";
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
                <h4>{title ? title : (error.response?.data.name ? error.response.data.name : error.name)}</h4>
                <p>{error.response?.data.description ? error.response.data.description : error.message}</p>
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