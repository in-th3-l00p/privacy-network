export type UserRelationship = "NOTHING" | "REQUESTED" | "RECEIVED" | "FRIENDS";

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    registrationDate: Date;
    relationship: UserRelationship;
}

export interface PostDetails {
    id: number;
    text: string;
    likes: number;
    dislikes: number;
    visibility: string;
    liked: boolean;
    disliked: boolean;
}

export interface ServerPost extends PostDetails {
    postDate: string;
    userId: number;
}

export interface Post extends PostDetails {
    postDate: Date;
    user?: User;
}

export interface SentFriendRequest {
    id: number;
    receiver: User;
}

export interface ReceivedFriendRequest {
    id: number;
    requester: User;
}

export interface Friendship {
    id: number;
    user1: User;
    user2: User;
    creationDate: Date;
}