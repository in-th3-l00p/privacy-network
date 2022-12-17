import {User} from "../util/serverTypes";
import axios from "axios";
import {getAuthenticationHeader} from "../util/authentication";

export interface UserService {
    getPublicUser(userId: number): Promise<User>;

    getCurrentUser(token: string): Promise<User>;

    searchUsers(token: string, username: string): Promise<User[]>;
}

export class UserServiceImpl implements UserService {
    private buildUser(user: any) {
        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: new Date(user.birthDate),
            registrationDate: new Date(user.registrationDate)
        }
    }

    async getPublicUser(userId: number): Promise<User> {
        const response = await axios.get(
            "/api/public/user",
            {params: {userId}}
        );
        return this.buildUser(response.data);
    }

    async getCurrentUser(token: string): Promise<User> {
        const response = await axios.get(
            "/api/public/user/current",
            {headers: getAuthenticationHeader(token)}
        );

        return this.buildUser(response.data);
    }

    async searchUsers(token: string, username: string): Promise<User[]> {
        const response = await axios.get(
            "/api/search/users",
            {
                headers: getAuthenticationHeader(token),
                params: {username}
            }
        );

        return response.data.map(this.buildUser);
    }
}

const userService = new UserServiceImpl();
export default userService;