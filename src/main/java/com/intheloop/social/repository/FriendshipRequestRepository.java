package com.intheloop.social.repository;

import com.intheloop.social.domain.FriendshipRequest;
import com.intheloop.social.domain.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FriendshipRequestRepository extends CrudRepository<FriendshipRequest, Long> {
    List<FriendshipRequest> findAllByReceiver(User receiver);

    List<FriendshipRequest> findAllByRequester(User requester);

    boolean existsFriendshipRequestByRequesterAndReceiver(User requester, User receiver);
}
