package com.intheloop.social.repository;

import com.intheloop.social.domain.Conversation;
import com.intheloop.social.domain.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface MessageRepository extends CrudRepository<Message, Long>, PagingAndSortingRepository<Message, Long> {
    Page<Message> findAllByConversation(Conversation conversation, Pageable pageable);
}
