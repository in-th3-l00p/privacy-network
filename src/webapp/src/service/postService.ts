import {Post, ServerPost} from "../util/serverTypes";
import {Authentication, getAuthenticationHeader} from "../util/authentication";
import axios from "axios";
import userService from "./userService";

export interface PostService {
    countPublicPosts(userId: number): Promise<number>;

    getPublicPosts(userId: number, page: number): Promise<Post[]>;

    getFeed(authentication: Authentication): Promise<Post[]>;

    likePost(token: string, postId: number): Promise<void>;

    dislikePost(token: string, postId: number): Promise<void>;
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

        return serverPosts.sort().reverse().map(serverPost => {
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

    async getFeed(authentication: Authentication): Promise<Post[]> {
        if (!authentication.token)
            return [];
        const resp = await axios.get("/api/post/feed", {
            headers: getAuthenticationHeader(authentication.token),
            params: {userId: authentication.userId}
        });
        if (!Array.isArray(resp.data))
            throw {
                name: "Failed getting the feed",
                message: "Invalid data received from the server. Try reloading."
            };
        return await this.parsePosts(resp.data);
    }

    async countPublicPosts(userId: number): Promise<number> {
        const resp = await axios.get("/api/public/post/count", {params: {userId}});
        return Number(resp.data);
    }

    async getPublicPosts(userId: number, page: number): Promise<Post[]> {
        const resp = await axios.get("/api/public/post", {params: {userId, page}});
        if (!Array.isArray(resp.data))
            throw {
                name: "Failed getting the user's posts",
                message: "Invalid data received from the server. Try reloading."
            };
        return await this.parsePosts(resp.data);
    }

    async likePost(token: string, postId: number): Promise<void> {
        await axios.put(
            "/api/post/like",
            {},
            {
                headers: getAuthenticationHeader(token),
                params: {postId}
            }
        );
    }

    async dislikePost(token: string, postId: number): Promise<void> {
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