package com.intheloop.social.repository;

import com.intheloop.social.domain.Conversation;
import org.springframework.data.repository.CrudRepository;

public interface ConversationRepository extends CrudRepository<Conversation, Long> {

}
