package com.intheloop.social.web.rest;

import com.intheloop.social.domain.Friendship;
import com.intheloop.social.domain.FriendshipRequest;
import com.intheloop.social.domain.User;
import com.intheloop.social.service.FriendshipService;
import com.intheloop.social.service.UserService;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.FriendshipDTO;
import com.intheloop.social.util.dto.FriendshipRequestDTO;
import com.intheloop.social.util.exceptions.FriendshipAleardyExists;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/friend")
public class FriendshipController {
    private final FriendshipService friendshipService;
    private final UserService userService;

    public FriendshipController(
            FriendshipService friendshipService,
            UserService userService
    ) {
        this.friendshipService = friendshipService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getFriends() {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        return ResponseEntity.ok(
                friendshipService
                        .getFriendships(user.get())
                        .stream()
                        .map(FriendshipDTO::new)
                        .toList()
        );
    }

    @GetMapping("/request/sent")
    public ResponseEntity<?> getSentRequests() {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
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
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        return ResponseEntity.ok(
                friendshipService
                        .getReceivedRequests(user.get())
                        .stream()
                        .map(FriendshipRequestDTO::new)
                        .toList()
        );
    }

    @PostMapping("/request")
    public ResponseEntity<?> requestFriend(@RequestParam("userId") Long userId) {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

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
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

        Optional<FriendshipRequest> friendshipRequest = friendshipService.getFriendshipRequest(requestId);
        if (
                friendshipRequest.isEmpty() ||
                        !Objects.equals(friendshipRequest.get().getReceiver(), user.get())
        )
            return ResponseEntity.badRequest().body(RestErrors.friendshipRequestDoesntExistError);
        friendshipService.acceptRequest(friendshipRequest.get());
        return ResponseEntity.ok("Friend accepted");
    }

    @PutMapping("/reject")
    public ResponseEntity<?> rejectFriendRequest(@RequestParam("requestId") Long requestId) {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

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
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

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
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);

        Optional<Friendship> friendship = friendshipService.getFriendship(friendshipId);
        if (
                friendship.isEmpty() ||
                        !Objects.equals(friendship.get().getUser1(), user.get()) &&
                                !Objects.equals(friendship.get().getUser2(), user.get())
        )
            return ResponseEntity.badRequest().body(RestErrors.friendshipDoesntExistError);
        friendshipService.deleteFriendship(friendship.get());
        return ResponseEntity.ok("Friend deleted");
    }
}
