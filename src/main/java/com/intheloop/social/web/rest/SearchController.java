package com.intheloop.social.web.rest;

import com.intheloop.social.service.UserService;
import com.intheloop.social.util.dto.PublicUserDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final UserService userService;

    public SearchController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<PublicUserDTO> searchUsers(@RequestParam("username") String username) {
        return userService
                .searchUser(username)
                .stream()
                .map(PublicUserDTO::new)
                .toList();
    }
}
