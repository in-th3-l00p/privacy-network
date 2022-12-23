import React, {useContext, useEffect, useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import {Friendship, ReceivedFriendRequest, SentFriendRequest} from "../util/serverTypes";
import {AuthenticationContext} from "../util/authentication";
import LoadingPage from "../components/LoadingPage";
import friendshipService, {getFriend} from "../service/friendshipService";
import {ErrorType, getErrorDescription, getErrorTitle, ServerError} from "../util/errorHandling";
import ErrorAlert from "../components/alerts";
import {AxiosError} from "axios";
import RemoveFriendModal from "../components/RemoveFriendModal";

export const FriendshipContext = React.createContext<Friendship>({} as Friendship);
const SentFriendshipRequestContext = React.createContext<SentFriendRequest>({} as SentFriendRequest);
const ReceivedFriendshipRequestContext = React.createContext<ReceivedFriendRequest>({} as ReceivedFriendRequest);

const FriendDisplay: React.FC<{ request?: "sent" | "received" }> = ({request}) => {
    const authentication = useContext(AuthenticationContext);
    const [error, setError] = useState<ErrorType>();

    useEffect(() => {
        if (
            error instanceof AxiosError<ServerError, any> &&
            typeof error.response !== "undefined"
        ) {
            error.response.data.description += " Refresh the page."
            setError(error);
        }
    }, [error])

    if (request === "sent") {
        const request = useContext(SentFriendshipRequestContext);
        return (
            <div className={"border bg-white p-3"}>
                <ErrorAlert error={error} setError={setError}/>
                <Row>
                    <Col>
                        <Link to={`/profile/${request.receiver.id}`} className={"text-black"}>
                            <h4>{request.receiver.username}</h4>
                        </Link>
                        <span>{request.receiver.firstName} {request.receiver.lastName}<br/></span>
                    </Col>
                    <Col className={"d-flex w-100 justify-content-end"}>
                        <Button
                            variant={"danger"}
                            onClick={() => {
                                friendshipService
                                    .cancelRequest(request.id)
                                    .then(() => window.location.href = "/friends/requests")
                                    .catch(setError);
                            }}
                        >
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }

    if (request === "received") {
        const request = useContext(ReceivedFriendshipRequestContext);
        return (
            <div className={"border bg-white p-3"}>
                <ErrorAlert error={error} setError={setError}/>
                <Row>
                    <Col>
                        <Link to={`/profile/${request.requester.id}`} className={"text-black"}>
                            <h4>{request.requester.username}</h4>
                        </Link>
                        <span>{request.requester.firstName} {request.requester.lastName}<br/></span>
                    </Col>
                    <Col className={"d-flex w-100 justify-content-end align-items-center gap-2"}>
                        <Button
                            variant={"dark"}
                            onClick={() => {
                                friendshipService
                                    .acceptRequest(request.id)
                                    .then(() => window.location.href = "/friends")
                                    .catch(setError);
                            }}
                        >
                            Accept
                        </Button>
                        <Button
                            variant={"danger"}
                            onClick={() => {
                                friendshipService
                                    .rejectRequest(request.id)
                                    .then(() => window.location.href = "/friends/requests")
                                    .catch(setError);
                            }}
                        >
                            Reject
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }

    const friendship = useContext(FriendshipContext);
    const friend = getFriend(authentication.userId, friendship);
    const [showRemove, setShowRemove] = useState<boolean>(false);
    return (
        <>
            <div className={"border bg-white p-3"}>
                <Row>
                    <Col>
                        <Link to={`/profile/${friend.id}`} className={"text-black"}>
                            <h4>{friend.username}</h4>
                        </Link>
                        <span>{friend.firstName} {friend.lastName}<br/></span>
                        {(typeof request === "undefined" && friendship.creationDate) && (
                            <span>Friends since: {friendship.creationDate.toLocaleDateString()}</span>
                        )}
                    </Col>
                    <Col className={"d-flex w-100 justify-content-end align-items-center gap-2"}>
                        <Button variant={"dark"}>Chat</Button>
                        <Button
                            variant={"danger"}
                            onClick={() => setShowRemove(true)}
                        >
                            Remove
                        </Button>
                    </Col>
                </Row>
            </div>
            <RemoveFriendModal
                friend={friend}
                friendshipId={friendship.id}
                show={showRemove}
                setShow={setShowRemove}
                redirectUrl={"/friends"}
            />
        </>
    );
}

const FriendList = () => {
    const [friends, setFriends] = useState<Friendship[]>();
    const [error, setError] = useState<ErrorType>();

    useEffect(() => {
        friendshipService.getFriendships()
            .then(setFriends)
            .catch(setError);
    }, []);

    if (error)
        return (
            <div className={"text-center"}>
                <h1 className={"mt-4"}>{getErrorTitle(error)}</h1>
                <p>{getErrorDescription(error)}</p>
            </div>
        );
    if (typeof friends === "undefined")
        return <LoadingPage whiteBackground={true}/>
    return (
        <div className={"d-flex flex-column gap-3 pb-3"}>
            {friends.length === 0 && <h4 className={"py-5 text-center"}>You have no friends</h4>}
            {friends.map((friendship, index) => (
                <FriendshipContext.Provider value={friendship}>
                    <FriendDisplay key={index}/>
                </FriendshipContext.Provider>
            ))}
        </div>
    );
}

const FriendRequests = () => {
    const [receivedRequests, setReceivedRequests] = useState<ReceivedFriendRequest[]>();
    const [sentRequests, setSentRequests] = useState<SentFriendRequest[]>();
    const [error, setError] = useState<ErrorType>();

    useEffect(() => {
        friendshipService.getReceivedFriendshipRequests()
            .then(setReceivedRequests)
            .catch(setError);
        friendshipService.getSentFriendshipRequests()
            .then(setSentRequests)
            .catch(setError);
    }, []);

    return (
        <div className={"d-flex flex-column gap-3 pb-3"}>
            <ErrorAlert error={error} setError={setError}/>
            {(receivedRequests?.length === 0 && sentRequests?.length === 0) && (
                <h4 className={"py-5 text-center"}>You have no friend requests</h4>
            )}
            {receivedRequests?.map((request, index) => (
                <ReceivedFriendshipRequestContext.Provider key={index} value={request}>
                    <FriendDisplay request={"received"}/>
                </ReceivedFriendshipRequestContext.Provider>
            ))}
            {sentRequests?.map((request, index) => (
                <SentFriendshipRequestContext.Provider key={index} value={request}>
                    <FriendDisplay request={"sent"}/>
                </SentFriendshipRequestContext.Provider>
            ))}
        </div>
    );
}

const Friends = () => {
    const location = useLocation();

    return (
        <Container className={"border bg-white mt-3"}>
            <Row className={"mb-3"}>
                <Col>
                    <Link to={"/friends"}>
                        <Button
                            variant={"dark"}
                            disabled={location.pathname === "/friends"}
                            className={"w-100"}
                        >
                            Friend list
                        </Button>
                    </Link>
                </Col>
                <Col>
                    <Link to={"/friends/requests"}>
                        <Button
                            variant={"dark"}
                            disabled={location.pathname === "/friends/requests"}
                            className={"w-100"}
                        >
                            Friend requests
                        </Button>
                    </Link>
                </Col>
            </Row>
            {location.pathname === "/friends" ? <FriendList/> : <FriendRequests/>}
        </Container>
    );
}

export default Friends;