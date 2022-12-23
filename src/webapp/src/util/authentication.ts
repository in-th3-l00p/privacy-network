import React from "react";
import userService from "../service/userService";

export interface Authentication {
    authenticated: boolean;
    token: string | null;
    userId: number | null;
    username: string | null;
}

export interface IAuthenticationContext extends Authentication {
}

export const AuthenticationContext = React.createContext<IAuthenticationContext>({} as IAuthenticationContext);

export const setAuthentication = async (authenticated: boolean, token: string | null) => {
    localStorage.setItem("authenticated", token ? "true" : "false");
    if (authenticated && token) {
        localStorage.setItem("token", token);
        const userDetails = await userService.getCurrentUser();
        localStorage.setItem("userId", String(userDetails.id));
        localStorage.setItem("username", userDetails.username);
    } else
        localStorage.setItem("authenticated", "false");
}

export const getAuthentication = (): Authentication => {
    return {
        authenticated: localStorage.getItem("authenticated") == "true",
        token: localStorage.getItem("token"),
        userId: Number(localStorage.getItem("userId")),
        username: localStorage.getItem("username")
    };
}

export const getToken = (): string | null => {
    const token = localStorage.getItem("token");
    return token ? token : null;
}

export const getAuthenticationHeader = (token: string) => {
    return {Authorization: `Bearer ${token}`};
}
