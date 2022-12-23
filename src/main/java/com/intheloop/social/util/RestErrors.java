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

    public static ServerError unauthorizedError = new ServerError(
            "Unauthorized",
            "Your authorization session is bad."
    );

    public static ServerError invalidPostError = new ServerError(
            "Post creation failed",
            "The given post data are bad."
    );

    public static ServerError friendshipRequestAlreadyExistsError = new ServerError(
            "Friendship request already exists",
            "You've already sent a friend request to that person."
    );

    public static ServerError friendshipAlreadyExistsError = new ServerError(
            "Friendship already exists",
            "You're already friends with that person."
    );

    public static ServerError friendshipRequestDoesntExistError = new ServerError(
            "Friendship request doesn't exist",
            "The request doesn't exist."
    );

    public static ServerError friendshipDoesntExistError = new ServerError(
            "Friendship doesn't exist",
            "The friendship doesn't exist."
    );

    public static ServerError postDoesntExistError = new ServerError(
            "Post not found",
            "The given post doesn't exist."
    );

    public static ServerError conversationDoesntExistError = new ServerError(
            "Conversation not found",
            "The given friendship has no conversation."
    );
}
