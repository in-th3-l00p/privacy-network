package com.intheloop.social.web.rest;

import com.intheloop.social.domain.User;
import com.intheloop.social.service.FriendshipService;
import com.intheloop.social.service.UserService;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.PublicUserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/public/user")
public class PublicUserController {
    private final UserService userService;
    private final FriendshipService friendshipService;

    public PublicUserController(
            UserService userService,
            FriendshipService friendshipService
    ) {
        this.userService = userService;
        this.friendshipService = friendshipService;
    }

    @GetMapping
    public ResponseEntity<?> getUserDetails(@RequestParam("userId") Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        Optional<User> optionalCurrentUser = SecurityUtils.getInstance().getCurrentUser();
        return optionalCurrentUser.map(currentUser -> ResponseEntity.ok(
                new PublicUserDTO(
                    user.get(),
                    friendshipService.getRelationship(user.get(), currentUser)
                )
        )).orElseGet(() -> ResponseEntity.ok(
                new PublicUserDTO(user.get())
        ));
    }
}
