import React, {useContext, useEffect, useState} from "react";
import {Button, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import {ErrorType} from "../util/errorHandling";
import axios from "axios";
import {AuthenticationContext, getAuthenticationHeader} from "../util/authentication";
import ErrorAlert from "../components/alerts";
import LoadingPage from "../components/loading/LoadingPage";
import {Post, ServerPost} from "../components/serverTypes";
import userService from "../service/userService";

const PostForm: React.FC<{
    reload: boolean,
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}> = ({reload, setReload}) => {
    const [text, setText] = useState<string>("");
    const [visibility, setVisibility] = useState<"public" | "private">("public");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorType | null>(null);

    const authentication = useContext(AuthenticationContext);

    return (
        <Container className={"my-4 p-3 border bg-white"}>
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
                            .then(() => setReload(!reload))
                            .catch(setError)
                            .finally(() => setLoading(false));
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

const PostDisplay: React.FC<{ post: Post }> = ({post}) => {
    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${date.getDay()}-${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`;
    }

    return (
        <div className={"border p-3 bg-white"}>
            <Row>
                <Col>
                    <h4>{typeof post.user !== "undefined" ? post.user.username : "[deleted]"}</h4>
                </Col>
                <Col>
                    <p className={"text-muted"} style={{textAlign: "right"}}>{formatDate(post.postDate)}</p>
                </Col>
            </Row>
            <p>{post.text}</p>
        </div>
    )
}

const Feed = () => {
    const [posts, setPosts] = useState<Post[]>();
    const [reload, setReload] = useState<boolean>(false);

    const authentication = useContext(AuthenticationContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            if (!authentication.token)
                return;
            const resp = await axios.get("/api/post/feed", {
                headers: getAuthenticationHeader(authentication.token),
                params: {userId: authentication.userId}
            });

            if (!Array.isArray(resp.data)) {
                setError({
                    name: "Failed getting the feed",
                    message: "Invalid data received from the server. Try reloading"
                });
            } else {
                const serverPosts: ServerPost[] = resp.data;
                let users: any = {};
                serverPosts.forEach(post => users[post.userId] = null);
                for (let strUserId of Object.keys(users)) {
                    const userId = Number(strUserId);
                    try {
                        users[userId] = await userService.getPublicUser(userId);
                    } catch (_) {
                        users[userId] = null;
                    }
                }

                setPosts(serverPosts.map(serverPost => {
                    const post: Post = {
                        id: serverPost.id,
                        text: serverPost.text,
                        likes: serverPost.likes,
                        dislikes: serverPost.dislikes,
                        visibility: serverPost.visibility,
                        postDate: new Date(serverPost.postDate),
                        user: users[serverPost.userId]
                    };

                    return post;
                }));
            }
        }

        fetchData()
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [reload])

    if (loading)
        return <LoadingPage/>
    return (
        <div>
            <PostForm reload={reload} setReload={setReload}/>
            <Container className={"d-flex flex-column gap-3 py-3"}>
                <ErrorAlert error={error} setError={setError}/>
                {posts?.map((post, index) => {
                    return <PostDisplay key={index} post={post}/>
                })}
            </Container>
        </div>
    )
}

export default Feed;