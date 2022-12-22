package com.intheloop.social.repository;

import com.intheloop.social.domain.FriendshipRequest;
import com.intheloop.social.domain.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface FriendshipRequestRepository extends CrudRepository<FriendshipRequest, Long> {
    List<FriendshipRequest> findAllByReceiver(User receiver);

    List<FriendshipRequest> findAllByRequester(User requester);

    boolean existsFriendshipRequestByRequesterAndReceiver(User requester, User receiver);

    Optional<FriendshipRequest> findByRequesterAndReceiver(User requester, User receiver);
}
