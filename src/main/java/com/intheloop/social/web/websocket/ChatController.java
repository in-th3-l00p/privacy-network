package com.intheloop.social.web.websocket;

import com.intheloop.social.domain.User;
import com.intheloop.social.service.ConversationService;
import com.intheloop.social.service.UserService;
import com.intheloop.social.util.dto.MessageDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller
public class ChatController {
    private final UserService userService;
    private final ConversationService conversationService;

    public ChatController(
            UserService userService,
            ConversationService conversationService
    ) {
        this.userService = userService;
        this.conversationService = conversationService;
    }

    @MessageMapping("/chat/send/{chatId}")
    @SendTo("/topic/{chatId}")
    public MessageDTO sendMessage(
            @DestinationVariable("chatId") Long chatId,
            @Payload InputMessageDTO inputMessageDTO
    ) {
        Optional<User> user = userService.getUserById(inputMessageDTO.getUserId());
        return user.map(value -> new MessageDTO(conversationService.addMessage(
                value,
                inputMessageDTO.getContent()
        ))).orElse(null);
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    private static class InputMessageDTO {
        private String content;
        private Long userId;
    }
}
