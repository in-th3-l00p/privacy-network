package com.intheloop.social.util.exceptions;

public class UserNotFoundException extends Exception {
    public UserNotFoundException() {
        super("User not found");
    }
}
