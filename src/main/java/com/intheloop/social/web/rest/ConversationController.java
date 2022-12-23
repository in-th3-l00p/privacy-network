package com.intheloop.social.web.rest;

import com.intheloop.social.domain.Conversation;
import com.intheloop.social.domain.Friendship;
import com.intheloop.social.domain.User;
import com.intheloop.social.service.ConversationService;
import com.intheloop.social.service.FriendshipService;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.MessageDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/conversation")
public class ConversationController {
    private final ConversationService conversationService;
    private final FriendshipService friendshipService;

    public ConversationController(
            ConversationService conversationService,
            FriendshipService friendshipService
    ) {
        this.conversationService = conversationService;
        this.friendshipService = friendshipService;
    }

    @GetMapping
    public ResponseEntity<?> getConversationId(@RequestParam("friendshipId") Long friendshipId) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<Friendship> friendship = friendshipService.getFriendship(friendshipId);
        if (
                friendship.isEmpty() ||
                !Objects.equals(friendship.get().getUser1().getId(), user.get().getId()) &&
                !Objects.equals(friendship.get().getUser2().getId(), user.get().getId())
        )
            return ResponseEntity.badRequest().body(RestErrors.friendshipDoesntExistError);
        return ResponseEntity.ok(friendship.get().getConversation().getId());
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getMessages(
            @RequestParam("conversationId") Long conversationId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<Conversation> conversation = conversationService.getConversation(conversationId);
        if (conversation.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.conversationDoesntExistError);
        if (!conversationService.checkUserAccess(user.get(), conversation.get()))
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        return ResponseEntity.ok(
            conversationService
                .getMessages(conversation.get(), page, size)
                .stream()
                .map(MessageDTO::new)
                .toList()
        );
    }
}
