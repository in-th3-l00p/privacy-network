import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import {SearchContext} from "../util/search";
import {User, UserRelationship} from "../util/serverTypes";
import {Button, Container} from "react-bootstrap";
import userService from "../service/userService";
import {AuthenticationContext} from "../util/authentication";
import {ErrorType} from "../util/errorHandling";
import LoadingPage from "../components/LoadingPage";
import friendshipService from "../service/friendshipService";

interface AddFriendButtonProps {
    userId: number,
    relationship: UserRelationship
}

const AddFriendButton: React.FC<AddFriendButtonProps> = ({userId, relationship}) => {
    const authentication = useContext(AuthenticationContext);
    const location = useLocation();

    if (authentication.token === null)
        return <></>
    if (relationship === "NOTHING")
        return (
            <Button
                variant={"dark"}
                style={{aspectRatio: "1/1", width: "100%"}}
                onClick={() => {
                    friendshipService
                        .sendRequest(userId)
                        .then(() => window.location.href = location.pathname);
                }}
            >
                Add friend
            </Button>
        );
    else if (relationship === "RECEIVED") {
        const [requestId, setRequestId] = useState<number>();

        useEffect(() => {
            if (authentication.userId)
                friendshipService
                    .getFriendshipRequestId(userId, authentication.userId)
                    .then(setRequestId);
        }, []);

        return (
            <>
                <Button
                    variant={"dark"}
                    style={{aspectRatio: "1/1", width: "100%"}}
                    disabled={typeof requestId === "undefined"}
                    onClick={() => {
                        if (requestId)
                            friendshipService
                                .acceptRequest(requestId)
                                .then(() => window.location.href = location.pathname);
                    }}
                >
                    Accept
                </Button>
                <Button
                    variant={"danger"}
                    style={{aspectRatio: "1/1", width: "100%"}}
                    onClick={() => {
                        if (requestId)
                            friendshipService
                                .rejectRequest(requestId)
                                .then(() => window.location.href = location.pathname);
                    }}
                >
                    Reject
                </Button>
            </>
        )
    } else if (relationship === "REQUESTED") {
        const [requestId, setRequestId] = useState<number>();

        useEffect(() => {
            if (authentication.userId)
                friendshipService
                    .getFriendshipRequestId(authentication.userId, userId)
                    .then(setRequestId);
        }, []);

        return (
            <Button
                variant={"secondary"}
                style={{aspectRatio: "1/1", width: "100%"}}
                disabled={typeof requestId === "undefined"}
                onClick={() => {
                    if (requestId)
                        friendshipService
                            .cancelRequest(requestId)
                            .then(() => window.location.href = location.pathname);
                }}
            >
                Cancel
            </Button>
        )
    }
    return <></>
}

const UserDisplay: React.FC<{ user: User }> = ({user}) => {
    return (
        <div className={"border p-3 bg-white d-flex"}>
            <div className={"me-3"}>
                <img
                    src={"/defaultProfilePicture.jpg"}
                    alt={"Profile"}
                    style={{
                        width: "100px",
                        borderRadius: "50%",
                        aspectRatio: "1/1"
                    }}
                />
            </div>
            <div className={"me-auto"}>
                <Link to={`/profile/${user.id}`} className={"text-black"}>
                    <h4>{user.username}</h4>
                </Link>
                <p>{user.firstName} {user.lastName}</p>
            </div>
            <div className={"d-flex gap-3"}>
                <Button
                    variant={"dark"}
                    style={{aspectRatio: "1/1", width: "100%"}}
                    onClick={() => window.location.href = `/profile/${user.id}`}
                >
                    View profile
                </Button>
                <AddFriendButton
                    userId={user.id}
                    relationship={user.relationship}
                />
            </div>
        </div>
    )
}

const Search = () => {
    const search = useContext(SearchContext);
    const params = useParams();
    const authentication = useContext(AuthenticationContext);
    const [results, setResults] = useState<User[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>();

    useEffect(() => {
        if (!params["query"]) {
            setLoading(false);
            return;
        }

        search.setQuery(params["query"]);
        userService.searchUsers(params.query)
            .then(users => setResults(users.filter(user => user.username !== authentication.username)))
            .catch(setError)
            .finally(() => setLoading(false));
    }, [])

    if (error)
        return (
            <h1 className={"text-center mt-5"}>
                Server side error. Contact the administrator.
            </h1>
        );
    if (loading)
        return <LoadingPage/>
    return (
        <Container className={"pt-3 d-flex flex-column gap-3"}>
            {results?.length === 0 && <h1 className={"text-center"}>No results found.</h1>}
            {results?.map((user, index) => (
                <UserDisplay key={index} user={user}/>
            ))}
        </Container>
    );
}

export default Search;