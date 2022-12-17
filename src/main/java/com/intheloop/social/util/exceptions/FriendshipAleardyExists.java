package com.intheloop.social.util.exceptions;

public class FriendshipAleardyExists extends Exception {
    public FriendshipAleardyExists() {
        super("Friendship already exists.");
    }
}
