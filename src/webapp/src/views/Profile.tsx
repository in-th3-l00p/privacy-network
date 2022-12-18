import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {Post, User} from "../util/serverTypes";
import LoadingPage from "../components/LoadingPage";
import userService from "../service/userService";
import {ErrorType, getErrorDescription, getErrorTitle} from "../util/errorHandling";
import {Button, Container} from "react-bootstrap";
import postService from "../service/postService";
import PostDisplay from "../components/PostDisplay";

const Profile = () => {
    const params = useParams();

    const [user, setUser] = useState<User>();
    const lastCurrentPage = useRef<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [postCount, setPostCount] = useState<number>();
    const [posts, setPosts] = useState<{ [page: number]: Post[] }>({});
    const [error, setError] = useState<ErrorType>();

    useEffect(() => {
        if (!params["userId"])
            return;
        userService.getPublicUser(Number(params["userId"]))
            .then(userData => {
                setUser(userData);
                return postService.countPublicPosts(Number(params["userId"]))
            })
            .then(setPostCount)
            .catch(setError)
    }, []);

    useEffect(() => {
        if (!params["userId"] || typeof postCount === "undefined" || posts.hasOwnProperty(currentPage))
            return;
        postService.getPublicPosts(Number(params["userId"]), currentPage)
            .then(currentPosts => {
                const postsCopy = {...posts};
                postsCopy[currentPage] = currentPosts.reverse();
                setPosts(postsCopy);
            })
            .catch(setError);
    }, [currentPage, postCount]);

    useEffect(() => console.log(postCount, user, posts), [postCount]);

    if (error)
        return (
            <div className={"text-center mt-5"}>
                <h1>{getErrorTitle(error)}</h1>
                <h4>{getErrorDescription(error)}</h4>
            </div>
        );
    if (!user || typeof postCount === "undefined" || Object.keys(posts).length === 0)
        return <LoadingPage/>
    return (
        <Container className={"mt-3"}>
            <div className={"d-flex gap-3 mb-3"}>
                <img
                    src={"/defaultProfilePicture.jpg"}
                    alt={"profile"}
                    className={"border"}
                    style={{
                        width: "150px",
                        aspectRatio: "1/1",
                        borderRadius: "15px"
                    }}
                />
                <h3 className={"mt-auto fw-bold"}>{user.username}</h3>
            </div>
            <div className={"p-3 border bg-white"}>
                <h5>Informations:</h5>
                <div className={"d-flex"}>
                    <p>Name: {user.firstName} {user.lastName}</p>
                </div>
                <p>Birth date: {user.birthDate.toLocaleDateString()}</p>
                <p>Joined at: {user.registrationDate.toLocaleDateString()}</p>
            </div>
            <div className={"d-flex flex-column gap-3 py-3 mt-3"}>
                <h2>User's activity:</h2>
                {postCount === 0 && <p className={"text-center"}>This user didn't posted anything yet.</p>}
                {
                    posts.hasOwnProperty(currentPage) ?
                        posts[currentPage].map((post, index) => (
                            <PostDisplay key={index} post={post}/>)
                        ) :
                        posts[lastCurrentPage.current].reverse().map((post, index) => (
                            <PostDisplay key={index} post={post}/>
                        ))
                }

                <div className={"d-flex gap-3 w-100 justify-content-center"}>
                    {Array.apply(0, Array(Math.floor(postCount / 5)))
                        .map((value, index) => (
                            <Button
                                key={index}
                                variant={"dark"}
                                disabled={index === currentPage}
                                onClick={() => {
                                    lastCurrentPage.current = currentPage;
                                    setCurrentPage(index);
                                }}
                            >
                                {index + 1}
                            </Button>
                        ))
                    }
                </div>
            </div>
        </Container>
    );
}

export default Profile;