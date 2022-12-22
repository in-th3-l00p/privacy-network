import axios from "axios";
import {getAuthenticationHeader} from "../util/authentication";
import {Friendship, ReceivedFriendRequest, SentFriendRequest, User} from "../util/serverTypes";
import {buildUser} from "./userService";

export interface FriendshipService {
    getFriendships(token: string): Promise<Friendship[]>;

    getSentFriendshipRequests(token: string): Promise<SentFriendRequest[]>;

    removeFriendship(token: string, friendshipId: number): Promise<void>;

    getReceivedFriendshipRequests(token: string): Promise<ReceivedFriendRequest[]>;

    sendRequest(token: string, userId: number): Promise<void>;

    cancelRequest(token: string, requestId: number): Promise<void>;

    acceptRequest(token: string, requestId: number): Promise<void>;

    rejectRequest(token: string, requestId: number): Promise<void>;
}

class FriendshipServiceImpl implements FriendshipService {
    async getFriendships(token: string): Promise<Friendship[]> {
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

    async removeFriendship(token: string, friendshipId: number): Promise<void> {
        await axios.delete("/api/friend", {
            headers: getAuthenticationHeader(token),
            params: {friendshipId}
        });
    }

    async getReceivedFriendshipRequests(token: string): Promise<ReceivedFriendRequest[]> {
        const resp = await axios.get("/api/friend/request/received", {
            headers: getAuthenticationHeader(token)
        });
        const requests: ReceivedFriendRequest[] = resp.data;

        return requests.map(request => {
            request.requester = buildUser(request.requester);
            return request;
        });
    }

    async getSentFriendshipRequests(token: string): Promise<SentFriendRequest[]> {
        const resp = await axios.get("/api/friend/request/sent", {
            headers: getAuthenticationHeader(token)
        });
        const requests: SentFriendRequest[] = resp.data;

        return requests.map(request => {
            request.receiver = buildUser(request.receiver);
            return request;
        });
    }

    async sendRequest(token: string, userId: number): Promise<void> {
        await axios.post("/api/friend/request", {}, {
            headers: getAuthenticationHeader(token),
            params: {userId}
        });
    }

    async cancelRequest(token: string, requestId: number): Promise<void> {
        await axios.delete("/api/friend/request", {
            headers: getAuthenticationHeader(token),
            params: {requestId}
        })
    }

    async acceptRequest(token: string, requestId: number): Promise<void> {
        await axios.put("/api/friend/accept", {}, {
            headers: getAuthenticationHeader(token),
            params: {requestId}
        });
    }

    async rejectRequest(token: string, requestId: number): Promise<void> {
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