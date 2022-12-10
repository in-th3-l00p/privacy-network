package com.intheloop.social.web.rest;

import com.intheloop.social.service.UserService;
import com.intheloop.social.util.dto.UserDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/user")
public class PublicUserController {
    private final UserService userService;

    public PublicUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserDTO getUserDetails(@RequestParam("userId") Long userId) {
        return null;
    }
}
