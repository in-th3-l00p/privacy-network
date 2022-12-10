import React, {useContext, useState} from "react";
import {Alert, Button, Container, Form} from "react-bootstrap";
// @ts-ignore
import style from "../styles/form.module.scss";
import {useLocation} from "react-router-dom";
import axios from "axios";
import ErrorAlert from "../util/components/alerts";
import {ErrorType} from "../util/errorHandling";
import {AuthenticationContext, setAuthentication} from "../util/authentication";

const Login = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const authentication = useContext(AuthenticationContext);

    const location = useLocation();
    const [showRegistered, setShowRegistered] = useState<boolean>(location.search === "?registered");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorType | null>();

    return (
        <Container
            style={{ backgroundColor: "#f5f5f5" }}
            className={"pt-4"}
            fluid
        >
            <h1 className={"text-center mb-4"}>Login into your account</h1>
            <Form
                className={style.form}
                onSubmit={(event) => {
                    event.preventDefault();
                    setLoading(true);
                    axios.post("/api/login", {username, password})
                        .then(resp => {
                            setAuthentication(true, resp.data);
                            window.location.href = "/";
                        })
                        .catch(err => setError(err));
                }}
            >
                {showRegistered && (
                    <Alert variant={"success"} onClose={() => setShowRegistered(false)} dismissible>
                        <h4>Your account is registered</h4>
                        <p>Activate your account using the mail sent to your email address.</p>
                    </Alert>
                )}
                <ErrorAlert error={error} setError={setError} />
                <Form.Group className={style.formGroup}>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </Form.Group>
                <Form.Group className={style.formGroup}>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type={"password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </Form.Group>
                <Alert>
                    Don't have an account. <a href={"/"}>Register instead</a>.
                </Alert>
                <div className={"d-flex w-100 justify-content-center"}>
                    <Button
                        type={"submit"}
                        disabled={!(username && password)}
                    >
                        Login
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default Login;