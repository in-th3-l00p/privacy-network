package com.intheloop.social.service;

import com.intheloop.social.domain.Conversation;
import com.intheloop.social.domain.Message;
import com.intheloop.social.domain.User;
import com.intheloop.social.repository.ConversationRepository;
import com.intheloop.social.repository.MessageRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ConversationService {
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    public ConversationService(
            MessageRepository messageRepository,
            ConversationRepository conversationRepository
    ) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    public Optional<Conversation> getConversation(Long conversationId) {
        return conversationRepository.findById(conversationId);
    }

    public Message addMessage(User user, String content) {
        Message message = new Message();
        message.setUser(user);
        message.setContent(content);
        return messageRepository.save(message);
    }

    public boolean checkUserAccess(User user, Conversation conversation) {
        return (
                Objects.equals(conversation.getFriendship().getUser1().getId(), user.getId()) ||
                Objects.equals(conversation.getFriendship().getUser2().getId(), user.getId())
        );
    }

    public List<Message> getMessages(Conversation conversation, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return messageRepository.findAllByConversation(conversation, pageable).toList();
    }
}
