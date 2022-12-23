import axios from "axios";
import {getAuthenticationHeader, getToken} from "../util/authentication";
import {Friendship, ReceivedFriendRequest, SentFriendRequest, User} from "../util/serverTypes";
import {buildUser} from "./userService";
import {UnauthenticatedError} from "../util/errorHandling";

export interface FriendshipService {
    getFriendship(friendId: number): Promise<number>;

    getFriendships(): Promise<Friendship[]>;

    getFriendshipRequestId(requesterId: number, receiverId: number): Promise<number>;

    getSentFriendshipRequests(): Promise<SentFriendRequest[]>;

    getReceivedFriendshipRequests(): Promise<ReceivedFriendRequest[]>;

    removeFriendship(friendshipId: number): Promise<void>;

    sendRequest(userId: number): Promise<void>;

    cancelRequest(requestId: number): Promise<void>;

    acceptRequest(requestId: number): Promise<void>;

    rejectRequest(requestId: number): Promise<void>;
}

class FriendshipServiceImpl implements FriendshipService {
    async getFriendship(friendId: number) {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const resp = await axios.get("/api/friend/id", {
            headers: getAuthenticationHeader(token),
            params: {friendId}
        });
        return Number(resp.data);
    }

    async getFriendships() {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const resp = await axios.get("/api/friend", {
            headers: getAuthenticationHeader(token)
        });
        const friendships: Friendship[] = resp.data;

        return friendships.map(friendship => {
            friendship.user1 = buildUser(friendship.user1);
            friendship.user2 = buildUser(friendship.user2);
            friendship.creationDate = new Date(friendship.creationDate);
            return friendship;
        });
    }

    async removeFriendship(friendshipId: number) {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        await axios.delete("/api/friend", {
            headers: getAuthenticationHeader(token),
            params: {friendshipId}
        });
    }

    async getFriendshipRequestId(requesterId: number, receiverId: number) {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const resp = await axios.get("/api/friend/request", {
            headers: getAuthenticationHeader(token),
            params: {requesterId, receiverId}
        });

        return Number(resp.data);
    }

    async getReceivedFriendshipRequests() {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const resp = await axios.get("/api/friend/request/received", {
            headers: getAuthenticationHeader(token)
        });
        const requests: ReceivedFriendRequest[] = resp.data;

        return requests.map(request => {
            request.requester = buildUser(request.requester);
            return request;
        });
    }

    async getSentFriendshipRequests() {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const resp = await axios.get("/api/friend/request/sent", {
            headers: getAuthenticationHeader(token)
        });
        const requests: SentFriendRequest[] = resp.data;

        return requests.map(request => {
            request.receiver = buildUser(request.receiver);
            return request;
        });
    }

    async sendRequest(userId: number) {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        await axios.post("/api/friend/request", {}, {
            headers: getAuthenticationHeader(token),
            params: {userId}
        });
    }

    async cancelRequest(requestId: number) {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        await axios.delete("/api/friend/request", {
            headers: getAuthenticationHeader(token),
            params: {requestId}
        })
    }

    async acceptRequest(requestId: number) {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        await axios.put("/api/friend/accept", {}, {
            headers: getAuthenticationHeader(token),
            params: {requestId}
        });
    }

    async rejectRequest(requestId: number) {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        await axios.put("/api/friend/reject", {}, {
            headers: getAuthenticationHeader(token),
            params: {requestId}
        });
    }
}

export function getFriend(currentUserId: number | null, friendship: Friendship): User {
    if (currentUserId === null)
        return friendship.user1;
    return friendship.user2.id === currentUserId ? friendship.user1 : friendship.user2;
}

const friendshipService: FriendshipService = new FriendshipServiceImpl();
export default friendshipService;