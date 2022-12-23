package com.intheloop.social.web.rest;

import com.intheloop.social.domain.User;
import com.intheloop.social.service.FriendshipService;
import com.intheloop.social.service.UserService;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.PublicUserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final UserService userService;
    private final FriendshipService friendshipService;

    public SearchController(
            UserService userService,
            FriendshipService friendshipService
    ) {
        this.userService = userService;
        this.friendshipService = friendshipService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> searchUsers(@RequestParam("username") String username) {
        Optional<User> currentUser = SecurityUtils.getInstance().getCurrentUser();
        if (currentUser.isEmpty())
            return ResponseEntity.ok(
                    userService
                            .searchUser(username)
                            .stream()
                            .map(PublicUserDTO::new)
                            .toList()
            );
        return ResponseEntity.ok(
                userService
                        .searchUser(username)
                        .stream()
                        .map((user) -> new PublicUserDTO(
                                user,
                                friendshipService.getRelationship(user, currentUser.get()))
                        )
        );
    }
}
