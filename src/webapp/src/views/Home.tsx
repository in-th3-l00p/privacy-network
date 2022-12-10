import React, {useContext, useEffect, useState} from "react";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
// @ts-ignore
import style from "../styles/form.module.scss";
import LoadingPage from "../util/components/loading/LoadingPage";
import axios from "axios";
import {ErrorType} from "../util/errorHandling";
import ErrorAlert from "../util/components/alerts";
import {AuthenticationContext, IAuthenticationContext} from "../util/authentication";

const Home = () => {
    const [username, setUsername] = useState<string>("intheloop");
    const [firstName, setFirstName] = useState<string>("Tisca");
    const [lastName, setLastName] = useState<string>("Catalin");
    const [birthDate, setBirthDate] = useState<string>("2006-03-03");
    const [email, setEmail] = useState<string>("tiscacatalin@gmail.com");
    const [password, setPassword] = useState<string>("test12345");
    const [confirmPassword, setConfirmPassword] = useState<string>("test12345");

    const authentication = useContext<IAuthenticationContext>(AuthenticationContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType | null>();

    useEffect(() => {
        if (authentication.authenticated)
            window.location.href = "/feed";
        else
            setLoading(false);
    }, [])

    const checkValid = () => {
        return (
            username &&
            firstName &&
            lastName &&
            birthDate &&
            email &&
            password &&
            password === confirmPassword
        );
    }

    if (loading)
        return <LoadingPage />
    return (
        <Container
            style={{ backgroundColor: "#f5f5f5" }}
            className={"pt-4"}
            fluid
        >
            <h1 className={"text-center mb-4"}>Create your account</h1>
            <Form
                className={style.form}
                onSubmit={(event) => {
                    event.preventDefault();
                    setLoading(true);
                    axios
                        .post("/api/register", {username, password, firstName, lastName, birthDate})
                        .then(() => window.location.href = "/login?registered")
                        .catch((error) => { setError(error); setLoading(false); });
                }}
            >
                <ErrorAlert error={error} setError={setError} />
                <Form.Group className={style.formGroup}>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group className={style.formGroup}>
                            <Form.Label>First name:</Form.Label>
                            <Form.Control
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className={style.formGroup}>
                            <Form.Label>Last name:</Form.Label>
                            <Form.Control
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className={style.formGroup}>
                    <Form.Label>Birth date:</Form.Label>
                    <Form.Control
                        type={"date"}
                        onChange={(event) => setBirthDate(event.target.value)}
                    />
                </Form.Group>
                <Form.Group className={style.formGroup}>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                        type={"email"}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
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
                <Form.Group className={style.formGroup}>
                    <Form.Label>Confirm password:</Form.Label>
                    <Form.Control
                        type={"password"}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                </Form.Group>
                <Alert>
                    Already have an account. <a href={"/login"}>Login instead</a>.
                </Alert>
                <div className={"d-flex w-100 justify-content-center"}>
                    <Button
                        type={"submit"}
                        disabled={!checkValid()}
                    >
                        Confirm
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default Home;