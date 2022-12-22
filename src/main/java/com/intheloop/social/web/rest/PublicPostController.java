package com.intheloop.social.web.rest;

import com.intheloop.social.domain.User;
import com.intheloop.social.service.PostService;
import com.intheloop.social.service.UserService;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.PostDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/public/post")
public class PublicPostController {
    private final UserService userService;
    private final PostService postService;

    public PublicPostController(
            UserService userService,
            PostService postService
    ) {
        this.userService = userService;
        this.postService = postService;
    }

    @GetMapping("/count")
    public ResponseEntity<?> getPublicPostsCount(@RequestParam("userId") Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        return ResponseEntity.ok(postService.countPublicUserPosts(user.get()));
    }

    @GetMapping
    public ResponseEntity<?> getPublicPosts(
            @RequestParam("userId") Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

        Optional<String> username = SecurityUtils.getCurrentUsername();
        Optional<User> currentUser;
        if (username.isPresent()) {
            currentUser = userService.getUserByUsername(username.get());
            if (currentUser.isPresent()) {
                User finalCurrentUser = currentUser.get();
                return ResponseEntity.ok(
                        postService
                                .getPublicUserPosts(user.get(), page, size)
                                .stream()
                                .map(post -> new PostDTO(post, finalCurrentUser))
                                .toList()
                );
            }
        }

        return ResponseEntity.ok(
                postService
                        .getPublicUserPosts(user.get(), page, size)
                        .stream()
                        .map(PostDTO::new)
                        .toList()
        );
    }
}
