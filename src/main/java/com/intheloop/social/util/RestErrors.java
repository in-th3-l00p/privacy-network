package com.intheloop.social.util;

public class RestErrors {
    public static ServerError disabledAccount = new ServerError(
            "Account is disabled",
            "Activate your account through the email sent on your mail address."
    );

    public static ServerError lockedError = new ServerError(
        "Account is locked",
        "Your account is locked. Contact the administrator for further details."
    );

    public static ServerError badCredentialsError = new ServerError(
        "Bad credentials",
        "The username or password is wrong."
    );

    public static ServerError authenticationError = new ServerError(
            "Authentication failed",
            "Server error. Contact the administrator for further details."
    );

    public static ServerError userNotFoundError = new ServerError(
        "User not found",
        "The user doesn't exist."
    );
}
