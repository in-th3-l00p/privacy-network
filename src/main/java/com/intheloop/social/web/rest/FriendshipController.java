package com.intheloop.social.web.rest;

import com.intheloop.social.domain.Friendship;
import com.intheloop.social.domain.FriendshipRequest;
import com.intheloop.social.domain.User;
import com.intheloop.social.service.FriendshipService;
import com.intheloop.social.service.UserService;
import com.intheloop.social.service.feed.FeedService;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.FriendshipDTO;
import com.intheloop.social.util.dto.FriendshipRequestDTO;
import com.intheloop.social.util.exceptions.FriendshipAleardyExists;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/friend")
public class FriendshipController {
    private final FriendshipService friendshipService;
    private final UserService userService;
    private final FeedService feedService;

    public FriendshipController(
            FriendshipService friendshipService,
            UserService userService,
            FeedService feedService
    ) {
        this.friendshipService = friendshipService;
        this.userService = userService;
        this.feedService = feedService;
    }

    @GetMapping
    public ResponseEntity<?> getFriends() {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        return ResponseEntity.ok(
                friendshipService
                        .getFriendships(user.get())
                        .stream()
                        .map(FriendshipDTO::new)
                        .toList()
        );
    }

    @GetMapping("/id")
    public ResponseEntity<?> getFriendship(
            @RequestParam("friendId") Long friendId
    ) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> friend = userService.getUserById(friendId);
        if (friend.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        Optional<Friendship> friendship = friendshipService.getFriendship(
                user.get(), friend.get()
        );
        if (friendship.isEmpty())
            return ResponseEntity
                    .badRequest()
                    .body(RestErrors.friendshipDoesntExistError);
        return ResponseEntity.ok(friendship.get().getId());
    }

    @GetMapping("/request/sent")
    public ResponseEntity<?> getSentRequests() {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        return ResponseEntity.ok(
                friendshipService
                        .getRequestedRequests(user.get())
                        .stream()
                        .map(FriendshipRequestDTO::new)
                        .toList()
        );
    }

    @GetMapping("/request/received")
    public ResponseEntity<?> getReceivedRequests() {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        return ResponseEntity.ok(
                friendshipService
                        .getReceivedRequests(user.get())
                        .stream()
                        .map(FriendshipRequestDTO::new)
                        .toList()
        );
    }

    @GetMapping("/request")
    public ResponseEntity<?> getRequestId(
            @RequestParam("requesterId") Long requesterId,
            @RequestParam("receiverId") Long receiverId
    ) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        if (
                !Objects.equals(user.get().getId(), requesterId) &&
                !Objects.equals(user.get().getId(), receiverId)
        )
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Optional<User> otherUser;
        Optional<FriendshipRequest> optionalFriendshipRequest;
        if (Objects.equals(user.get().getId(), requesterId)) {
            otherUser = userService.getUserById(receiverId);
            if (otherUser.isEmpty())
                return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
            optionalFriendshipRequest = friendshipService
                    .getFriendshipRequest(user.get(), otherUser.get());
        } else {
            otherUser = userService.getUserById(requesterId);
            if (otherUser.isEmpty())
                return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
            optionalFriendshipRequest = friendshipService
                    .getFriendshipRequest(otherUser.get(), user.get());
        }

        if (optionalFriendshipRequest.isEmpty())
            return ResponseEntity
                    .badRequest()
                    .body(RestErrors.friendshipRequestDoesntExistError);
        return ResponseEntity.ok(optionalFriendshipRequest.get().getId());
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestFriend(@RequestParam("userId") Long userId) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);

        Optional<User> receiver = userService.getUserById(userId);
        if (receiver.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        if (friendshipService.getFriendship(user.get(), receiver.get()).isPresent())
            return ResponseEntity.badRequest().body(RestErrors.friendshipAlreadyExistsError);

        try {
            friendshipService.request(user.get(), receiver.get());
        } catch (FriendshipAleardyExists ignored) {
            return ResponseEntity.badRequest().body(RestErrors.friendshipRequestAlreadyExistsError);
        }

        return ResponseEntity.ok("Requested");
    }

    @PutMapping("/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestParam("requestId") Long requestId) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);

        Optional<FriendshipRequest> friendshipRequest = friendshipService.getFriendshipRequest(requestId);
        if (
                friendshipRequest.isEmpty() ||
                        !Objects.equals(friendshipRequest.get().getReceiver(), user.get())
        )
            return ResponseEntity.badRequest().body(RestErrors.friendshipRequestDoesntExistError);
        Friendship friendship = friendshipService.acceptRequest(friendshipRequest.get());
        feedService.updateFeedOnNewFriendship(friendship);
        return ResponseEntity.ok("Friend accepted");
    }

    @PutMapping("/reject")
    public ResponseEntity<?> rejectFriendRequest(@RequestParam("requestId") Long requestId) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);

        Optional<FriendshipRequest> friendshipRequest = friendshipService.getFriendshipRequest(requestId);
        if (
                friendshipRequest.isEmpty() ||
                        !Objects.equals(friendshipRequest.get().getReceiver(), user.get())
        )
            return ResponseEntity.badRequest().body(RestErrors.friendshipRequestDoesntExistError);
        friendshipService.rejectRequest(friendshipRequest.get());
        return ResponseEntity.ok("Friend rejeceted");
    }

    @DeleteMapping("/request")
    public ResponseEntity<?> cancelRequest(@RequestParam("requestId") Long requestId) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);

        Optional<FriendshipRequest> friendshipRequest = friendshipService.getFriendshipRequest(requestId);
        if (
                friendshipRequest.isEmpty() ||
                        !Objects.equals(user.get(), friendshipRequest.get().getRequester())
        )
            return ResponseEntity.badRequest().body(RestErrors.friendshipRequestDoesntExistError);
        friendshipService.cancelRequest(friendshipRequest.get());
        return ResponseEntity.ok("Friend request cancelled");
    }

    @DeleteMapping
    public ResponseEntity<?> deleteFriend(@RequestParam("friendshipId") Long friendshipId) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);

        Optional<Friendship> friendship = friendshipService.getFriendship(friendshipId);
        if (
                friendship.isEmpty() ||
                        !Objects.equals(friendship.get().getUser1(), user.get()) &&
                                !Objects.equals(friendship.get().getUser2(), user.get())
        )
            return ResponseEntity.badRequest().body(RestErrors.friendshipDoesntExistError);
        friendshipService.deleteFriendship(friendship.get());
        feedService.updateFeedOnDeletedFriendship(friendship.get());
        return ResponseEntity.ok("Friend deleted");
    }
}
