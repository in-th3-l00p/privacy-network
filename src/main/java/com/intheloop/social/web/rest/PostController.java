package com.intheloop.social.web.rest;

import com.intheloop.social.domain.Post;
import com.intheloop.social.domain.User;
import com.intheloop.social.service.FriendshipService;
import com.intheloop.social.service.PostService;
import com.intheloop.social.service.UserService;
import com.intheloop.social.service.feed.FeedService;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.PostDTO;
import com.intheloop.social.util.dto.PublicUserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/post")
public class PostController {
    private final PostService postService;
    private final UserService userService;
    private final FriendshipService friendshipService;
    private final FeedService feedService;

    public PostController(
            PostService postService,
            UserService userService,
            FriendshipService friendshipService,
            FeedService feedService
    ) {
        this.postService = postService;
        this.userService = userService;
        this.friendshipService = friendshipService;
        this.feedService = feedService;
    }

    @GetMapping
    public ResponseEntity<?> getUserPosts(
            @RequestParam("userId") Long userId,
            @RequestParam(value = "page", defaultValue = "0") int currentPage,
            @RequestParam(value = "size", defaultValue = "5") int pageSize
    ) {
        Optional<User> currentUser = SecurityUtils.getInstance().getCurrentUser();
        if (currentUser.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserById(userId);
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

        PublicUserDTO.Relationship relationship = friendshipService
                .getRelationship(user.get(), currentUser.get());
        if (
                relationship == PublicUserDTO.Relationship.FRIENDS ||
                Objects.equals(user.get().getId(), currentUser.get().getId())
        )
            return ResponseEntity.ok(
                    postService.getUserPosts(user.get(), currentPage, pageSize)
                            .stream()
                            .map(PostDTO::new)
                            .toList()
            );
        return ResponseEntity.ok(
                postService.getPublicUserPosts(user.get(), currentPage, pageSize)
                        .stream()
                        .map(PostDTO::new)
                        .toList()
        );
    }

    @GetMapping("/count")
    public ResponseEntity<?> countUserPosts(@RequestParam("userId") Long userId) {
        Optional<User> currentUser = SecurityUtils.getInstance().getCurrentUser();
        if (currentUser.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserById(userId);
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

        PublicUserDTO.Relationship relationship = friendshipService
                .getRelationship(user.get(), currentUser.get());
        if (
                relationship == PublicUserDTO.Relationship.FRIENDS ||
                Objects.equals(user.get().getId(), currentUser.get().getId())
        )
            return ResponseEntity.ok(postService.countUserPosts(user.get()));
        return ResponseEntity.ok(postService.countPublicUserPosts(user.get()));
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostDTO postDTO) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        try {
            Post post = postService.createPost(user.get(), postDTO);
            feedService.updateFeedOnPost(user.get(), post);
        } catch (Exception ignored) {
            return ResponseEntity
                    .badRequest()
                    .body(RestErrors.invalidPostError);
        }

        return ResponseEntity.ok("Posted");
    }

    @GetMapping("/feed")
    public ResponseEntity<?> getFeed(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);

        return ResponseEntity.ok(
                feedService.
                        getUserFeed(user.get(), page, size)
                        .stream()
                        .map(PostDTO::new)
                        .toList()
        );
    }

    @GetMapping("/feed/count")
    public ResponseEntity<?> getFeed() {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        return ResponseEntity.ok(feedService.countUserFeed(user.get()));
    }

    @PutMapping("/like")
    public ResponseEntity<?> likePost(@RequestParam("postId") Long postId) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);

        Optional<Post> post = postService.getPostById(postId);
        if (post.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.postDoesntExistError);
        postService.likePost(user.get(), post.get());
        return ResponseEntity.ok("Post liked");
    }

    @PutMapping("/dislike")
    public ResponseEntity<?> dislikePost(@RequestParam("postId") Long postId) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);

        Optional<Post> post = postService.getPostById(postId);
        if (post.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.postDoesntExistError);
        postService.dislikePost(user.get(), post.get());
        return ResponseEntity.ok("Post disliked");
    }
}
