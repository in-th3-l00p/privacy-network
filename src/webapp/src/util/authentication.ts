import React from "react";
import axios from "axios";

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
        const userDetails = await axios.get(
            "/api/public/user",
            {headers: getAuthenticationHeader(token)}
        );
        localStorage.setItem("userId", String(userDetails.data.id));
        localStorage.setItem("username", userDetails.data.username);
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

export const getAuthenticationHeader = (token: string) => {
    return {Authorization: `Bearer ${token}`};
}
