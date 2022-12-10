import React, {useContext, useState} from "react";
import {Button, Container, FloatingLabel, Form} from "react-bootstrap";
import {ErrorType} from "../util/errorHandling";
import axios from "axios";
import {AuthenticationContext, getAuthenticationHeader} from "../util/authentication";
import ErrorAlert from "../util/components/alerts";

const PostForm = () => {
    const [text, setText] = useState<string>("");
    const [visibility, setVisibility] = useState<"public" | "private">("public");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorType | null>(null);

    const authentication = useContext(AuthenticationContext);

    return (
        <Container className={"my-4 p-3 border"}>
            <h4 className={"mb-3"}>Create some content</h4>
            <ErrorAlert error={error} setError={setError}/>
            <Form
                className={"d-flex flex-column gap-3"}
                onSubmit={(event) => {
                    event.preventDefault();
                    setLoading(true);
                    if (authentication.token) {
                        axios.post(
                            "/api/post",
                            {text, visibility},
                            {
                                headers: getAuthenticationHeader(authentication.token),
                                params: {userId: authentication.userId}
                            }
                        )
                            .then(() => setLoading(false))
                            .catch((error: ErrorType) => {
                                setError(error);
                                setLoading(false);
                            });
                    }
                }}
            >
                <FloatingLabel
                    controlId={"postText"}
                    label={"Inspire others..."}
                    className={"w-100"}
                >
                    <Form.Control
                        as={"textarea"}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        style={{height: "100px"}}
                    />
                </FloatingLabel>
                <Form.Select onChange={(event) => setVisibility(
                    event.target.value.toLowerCase() as "public" | "private"
                )}>
                    <option>Public</option>
                    <option>Private</option>
                </Form.Select>
                <Button
                    type={"submit"}
                    variant={"primary"}
                    disabled={!text || loading}
                >
                    Post
                </Button>
            </Form>
        </Container>
    );
}

const Feed = () => {
    return (
        <div>
            <PostForm/>
        </div>
    )
}

export default Feed;