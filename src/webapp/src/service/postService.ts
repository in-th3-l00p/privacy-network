import {Post, ServerPost} from "../util/serverTypes";
import {getAuthentication, getAuthenticationHeader, getToken} from "../util/authentication";
import axios from "axios";
import userService from "./userService";
import {UnauthenticatedError} from "../util/errorHandling";

export interface PostService {
    countPosts(userId: number): Promise<number>;

    getPosts(userId: number, page: number): Promise<Post[]>;

    countFeed(): Promise<number>;

    getFeed(page: number): Promise<Post[]>;

    likePost(postId: number): Promise<void>;

    dislikePost(postId: number): Promise<void>;
}

class PostServiceImpl implements PostService {
    private async parsePosts(serverPosts: ServerPost[]): Promise<Post[]> {
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

        return serverPosts.sort().map(serverPost => {
            const post: Post = {
                id: serverPost.id,
                text: serverPost.text,
                likes: serverPost.likes,
                dislikes: serverPost.dislikes,
                visibility: serverPost.visibility,
                postDate: new Date(serverPost.postDate),
                user: users[serverPost.userId],
                liked: serverPost.liked,
                disliked: serverPost.disliked
            };

            return post;
        })
    }

    async countFeed() {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const resp = await axios.get("/api/post/feed/count", {
            headers: getAuthenticationHeader(token)
        });
        return Number(resp.data);
    }

    async getFeed(page: number) {
        const authentication = getAuthentication();
        if (!authentication.authenticated || !authentication.token)
            throw  UnauthenticatedError
        const resp = await axios.get("/api/post/feed", {
            headers: getAuthenticationHeader(authentication.token),
            params: {
                userId: authentication.userId,
                page: page
            }
        });
        if (!Array.isArray(resp.data))
            throw {
                name: "Failed getting the feed",
                message: "Invalid data received from the server. Try reloading."
            };
        return await this.parsePosts(resp.data);
    }

    async countPosts(userId: number): Promise<number> {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const resp = await axios.get("/api/post/count", {
            headers: getAuthenticationHeader(token),
            params: {userId}
        });
        return Number(resp.data);
    }

    async getPosts(userId: number, page: number): Promise<Post[]> {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const resp = await axios.get("/api/post", {
            headers: getAuthenticationHeader(token),
            params: {userId, page}
        });
        if (!Array.isArray(resp.data))
            throw {
                name: "Failed getting the user's posts",
                message: "Invalid data received from the server. Try reloading."
            };
        return await this.parsePosts(resp.data);
    }

    async likePost(postId: number): Promise<void> {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        await axios.put(
            "/api/post/like",
            {},
            {
                headers: getAuthenticationHeader(token),
                params: {postId}
            }
        );
    }

    async dislikePost(postId: number): Promise<void> {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        await axios.put(
            "/api/post/dislike",
            {},
            {
                headers: getAuthenticationHeader(token),
                params: {postId}
            }
        );
    }
}

const postService = new PostServiceImpl();
export default postService;