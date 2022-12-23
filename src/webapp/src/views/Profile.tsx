import React, {useContext, useEffect, useRef, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import {Post, User} from "../util/serverTypes";
import LoadingPage from "../components/LoadingPage";
import userService from "../service/userService";
import {ErrorType, getErrorDescription, getErrorTitle} from "../util/errorHandling";
import {Button, Container} from "react-bootstrap";
import postService from "../service/postService";
import PostDisplay from "../components/PostDisplay";
import {AuthenticationContext} from "../util/authentication";
import friendshipService from "../service/friendshipService";
import RemoveFriendModal from "../components/RemoveFriendModal";

const ActionButtons: React.FC<{ user: User }> = ({user}) => {
    const location = useLocation();
    const authentication = useContext(AuthenticationContext);
    const ButtonsContainer: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({children}) => {
        return (
            <div className={"ms-auto d-flex gap-3 align-items-end"}>
                {children}
            </div>
        );
    }

    if (authentication.userId === user.id)
        return (
            <ButtonsContainer>
                <Button variant={"dark"} onClick={() => window.location.href = "/settings"}>
                    Settings
                </Button>
            </ButtonsContainer>
        )
    else if (user.relationship === "RECEIVED") {
        const [requestId, setRequestId] = useState<number>();

        useEffect(() => {
            if (authentication.userId)
                friendshipService
                    .getFriendshipRequestId(user.id, authentication.userId)
                    .then(setRequestId);
        }, []);

        return (
            <ButtonsContainer>
                <Button
                    variant={"dark"}
                    disabled={typeof requestId === "undefined"}
                    onClick={() => {
                        if (typeof requestId !== "undefined")
                            friendshipService.acceptRequest(requestId)
                                .then(() => window.location.href = location.pathname);
                    }}
                >
                    Accept
                </Button>
                <Button
                    variant={"danger"}
                    disabled={typeof requestId === undefined}
                    onClick={() => {
                        if (typeof requestId !== "undefined")
                            friendshipService.rejectRequest(requestId)
                                .then(() => window.location.href = location.pathname);
                    }}
                >
                    Reject
                </Button>
            </ButtonsContainer>
        );
    } else if (user.relationship === "REQUESTED") {
        const [requestId, setRequestId] = useState<number>();

        useEffect(() => {
            if (authentication.userId)
                friendshipService
                    .getFriendshipRequestId(authentication.userId, user.id)
                    .then(setRequestId);
        }, []);

        return (
            <ButtonsContainer>
                <Button
                    variant={"secondary"}
                    disabled={typeof requestId === "undefined"}
                    onClick={() => {
                        if (typeof requestId !== "undefined")
                            friendshipService.cancelRequest(requestId)
                                .then(() => window.location.href = location.pathname);
                    }}
                >
                    Cancel
                </Button>
            </ButtonsContainer>
        )
    } else if (user.relationship === "FRIENDS") {
        const [friendshipId, setFriendshipId] = useState<number>(-1);
        const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);

        useEffect(() => {
            friendshipService
                .getFriendship(user.id)
                .then(setFriendshipId);
        }, [])

        return (
            <>
                <RemoveFriendModal
                    friend={user}
                    friendshipId={friendshipId}
                    show={showRemoveModal}
                    setShow={setShowRemoveModal}
                    redirectUrl={location.pathname}
                />
                <ButtonsContainer>
                    <Button
                        variant={"danger"}
                        onClick={() => setShowRemoveModal(true)}
                    >
                        Unfriend
                    </Button>
                </ButtonsContainer>
            </>
        );
    }
    return (
        <ButtonsContainer>
            <Button
                variant={"dark"}
                onClick={() => {
                    friendshipService
                        .sendRequest(user.id)
                        .then(() => window.location.href = location.pathname);
                }}
            >
                Add friend
            </Button>
        </ButtonsContainer>
    )
}

const Profile = () => {
    const authentication = useContext(AuthenticationContext);
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
        userService
            .getUser(Number(params["userId"]))
            .then(userData => {
                setUser(userData);
                if (authentication.token)
                    return postService.countPosts(Number(params["userId"]));
            })
            .then(setPostCount)
            .catch(setError)
    }, []);

    useEffect(() => {
        if (
            !params["userId"] ||
            typeof postCount === "undefined" ||
            posts.hasOwnProperty(currentPage)
        )
            return;
        postService.getPosts(Number(params["userId"]), currentPage)
            .then(currentPosts => {
                const postsCopy = {...posts};
                postsCopy[currentPage] = currentPosts.reverse();
                setPosts(postsCopy);
            })
            .catch(setError);
    }, [currentPage, postCount]);

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
                <ActionButtons user={user}/>
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