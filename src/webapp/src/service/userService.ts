import {User} from "../components/serverTypes";
import axios from "axios";
import {getAuthenticationHeader} from "../util/authentication";

export interface UserService {
    getPublicUser(userId: number): Promise<User>;

    getCurrentUser(token: string): Promise<User>;
}

export class UserServiceImpl implements UserService {
    async getPublicUser(userId: number): Promise<User> {
        const response = await axios.get(
            "/api/public/user",
            {params: {userId}}
        );
        return {
            id: response.data.userId,
            username: response.data.username,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            birthDate: new Date(response.data.birthDate),
            registrationDate: new Date(response.data.registrationDate)
        };
    }

    async getCurrentUser(token: string): Promise<User> {
        const response = await axios.get(
            "/api/public/user/current",
            {headers: getAuthenticationHeader(token)}
        );
        return {
            id: response.data.userId,
            username: response.data.username,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            birthDate: new Date(response.data.birthDate),
            registrationDate: new Date(response.data.registrationDate)
        };
    }
}

const userService = new UserServiceImpl();
export default userService;