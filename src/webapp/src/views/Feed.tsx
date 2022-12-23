import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Container, FloatingLabel, Form} from "react-bootstrap";
import {ErrorType} from "../util/errorHandling";
import axios from "axios";
import {AuthenticationContext, getAuthenticationHeader} from "../util/authentication";
import ErrorAlert from "../components/alerts";
import LoadingPage from "../components/LoadingPage";
import {Post} from "../util/serverTypes";
import PostDisplay from "../components/PostDisplay";
import postService from "../service/postService";

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
                    variant={"dark"}
                    disabled={!text || loading}
                >
                    Post
                </Button>
            </Form>
        </Container>
    );
}

const Feed = () => {
    const pageSize = 5;
    const currentPage = useRef(0);
    const [scrollPosition, setScrollPosition] = useState<number>(window.scrollY);
    const [feedSize, setFeedSize] = useState<number>(0);
    const [posts, setPosts] = useState<Post[]>([]);

    const [reload, setReload] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>();

    useEffect(() => {
        setLoading(true);
        postService
            .countFeed()
            .then((feedSize) => {
                setFeedSize(feedSize);
                return postService.getFeed(currentPage.current);
            })
            .then(setPosts)
            .catch(setError)
            .finally(() => setLoading(false));

        const handleScroll = () => setScrollPosition(window.scrollY);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [reload])

    useEffect(() => {
        if (
            scrollPosition + window.innerHeight === document.body.scrollHeight &&
            currentPage.current * pageSize < feedSize
        ) {
            currentPage.current = currentPage.current + 1;
            postService.getFeed(currentPage.current)
                .then(newPosts => {
                    const currentPosts = [...posts];
                    currentPosts.push(...newPosts);
                    setPosts(currentPosts);
                })
                .catch(setError);
        }
    }, [scrollPosition])

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