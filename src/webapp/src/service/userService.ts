import {User} from "../util/serverTypes";
import axios from "axios";
import {getAuthenticationHeader, getToken} from "../util/authentication";
import {UnauthenticatedError} from "../util/errorHandling";

export interface UserService {
    getPublicUser(userId: number): Promise<User>;

    getUser(userId: number): Promise<User>;

    getCurrentUser(): Promise<User>;

    searchUsers(username: string): Promise<User[]>;
}

export function buildUser(user: any) {
    return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: new Date(user.birthDate),
        registrationDate: new Date(user.registrationDate),
        relationship: user.relationship
    }
}

export class UserServiceImpl implements UserService {
    async getPublicUser(userId: number): Promise<User> {
        const response = await axios.get(
            "/api/public/user",
            {params: {userId}}
        );
        return buildUser(response.data);
    }

    async getUser(userId: number) {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const response = await axios.get(
            "/api/public/user",
            {
                headers: getAuthenticationHeader(token),
                params: {userId}
            }
        );
        return buildUser(response.data);
    }

    async getCurrentUser(): Promise<User> {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const response = await axios.get(
            "/api/user",
            {headers: getAuthenticationHeader(token)}
        );

        return buildUser(response.data);
    }

    async searchUsers(username: string): Promise<User[]> {
        const token = getToken();
        if (token === null)
            throw UnauthenticatedError;
        const response = await axios.get(
            "/api/search/users",
            {
                headers: getAuthenticationHeader(token),
                params: {username}
            }
        );

        return response.data.map(buildUser);
    }
}

const userService = new UserServiceImpl();
export default userService;