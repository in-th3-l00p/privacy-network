package com.intheloop.social.web.rest;

import com.intheloop.social.domain.Post;
import com.intheloop.social.domain.User;
import com.intheloop.social.service.PostService;
import com.intheloop.social.service.UserService;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.PostDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/post")
public class PostController {
    private final PostService postService;
    private final UserService userService;

    public PostController(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostDTO postDTO) {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

        try {
            postService.createPost(user.get(), postDTO);
        } catch (Exception ignored) {
            return ResponseEntity
                    .badRequest()
                    .body(RestErrors.invalidPostError);
        }

        return ResponseEntity.ok("Posted");
    }

    @GetMapping("/feed")
    public ResponseEntity<?> getFeed() {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

        List<PostDTO> posts = postService
                .getUserFeed(user.get())
                .stream()
                .map((post) -> new PostDTO(post, user.get()))
                .toList();
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/like")
    public ResponseEntity<?> likePost(@RequestParam("postId") Long postId) {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        Optional<Post> post = postService.getPostById(postId);
        if (post.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.postDoesntExistError);
        postService.likePost(user.get(), post.get());
        return ResponseEntity.ok("Post liked");
    }

    @PutMapping("/dislike")
    public ResponseEntity<?> dislikePost(@RequestParam("postId") Long postId) {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        Optional<Post> post = postService.getPostById(postId);
        if (post.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.postDoesntExistError);
        postService.dislikePost(user.get(), post.get());
        return ResponseEntity.ok("Post disliked");
    }
}
