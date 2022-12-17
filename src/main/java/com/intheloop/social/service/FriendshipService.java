package com.intheloop.social.service;

import com.intheloop.social.domain.Conversation;
import com.intheloop.social.domain.Friendship;
import com.intheloop.social.domain.FriendshipRequest;
import com.intheloop.social.domain.User;
import com.intheloop.social.repository.ConversationRepository;
import com.intheloop.social.repository.FriendshipRepository;
import com.intheloop.social.repository.FriendshipRequestRepository;
import com.intheloop.social.util.exceptions.FriendshipAleardyExists;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final FriendshipRequestRepository friendshipRequestRepository;
    private final ConversationRepository conversationRepository;

    public FriendshipService(
            FriendshipRepository friendshipRepository,
            FriendshipRequestRepository friendshipRequestRepository,
            ConversationRepository conversationRepository
    ) {
        this.friendshipRepository = friendshipRepository;
        this.friendshipRequestRepository = friendshipRequestRepository;
        this.conversationRepository = conversationRepository;
    }

    public void request(User requester, User receiver) throws FriendshipAleardyExists {
        if (friendshipRequestRepository.existsFriendshipRequestByRequesterAndReceiver(requester, receiver))
            throw new FriendshipAleardyExists();
        FriendshipRequest request = new FriendshipRequest();
        request.setRequester(requester);
        request.setReceiver(receiver);
        friendshipRequestRepository.save(request);
    }

    public void acceptRequest(FriendshipRequest request) {
        Conversation conversation = new Conversation();
        conversation.setName(String.format(
                "%s and %s conversation",
                request.getRequester().getUsername(),
                request.getReceiver().getUsername()
        ));
        conversation = conversationRepository.save(conversation);
        Friendship friendship = new Friendship(
                request.getRequester(),
                request.getReceiver(),
                conversation
        );
        friendshipRepository.save(friendship);
        friendshipRequestRepository.delete(request);
    }

    public void rejectRequest(FriendshipRequest friendshipRequest) {
        friendshipRequestRepository.delete(friendshipRequest);
    }

    public List<FriendshipRequest> getRequestedRequests(User user) {
        return friendshipRequestRepository.findAllByRequester(user);
    }

    public List<FriendshipRequest> getReceivedRequests(User user) {
        return friendshipRequestRepository.findAllByReceiver(user);
    }

    public List<Friendship> getFriendships(User user) {
        return friendshipRepository.findAllByUserId(user.getId());
    }

    public void deleteFriendship(Friendship friendship) {
        friendshipRepository.delete(friendship);
        conversationRepository.delete(friendship.getConversation());
    }

    public Optional<Friendship> getFriendship(Long friendshipId) {
        return friendshipRepository.findById(friendshipId);
    }

    public Optional<FriendshipRequest> getFriendshipRequest(Long friendshipRequestId) {
        return friendshipRequestRepository.findById(friendshipRequestId);
    }
}
