export interface User {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
    registrationDate: Date
}

export interface PostDetails {
    id: number;
    text: string;
    likes: number;
    dislikes: number;
    visibility: string;
}

export interface ServerPost extends PostDetails {
    postDate: string;
    userId: number;
}

export interface Post extends PostDetails {
    postDate: Date;
    user?: User;
}

