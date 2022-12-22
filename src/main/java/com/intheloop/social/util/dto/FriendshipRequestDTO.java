package com.intheloop.social.util.dto;

import com.intheloop.social.domain.FriendshipRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FriendshipRequestDTO {
    private Long id;
    private PublicUserDTO requester;
    private PublicUserDTO receiver;

    public FriendshipRequestDTO(FriendshipRequest friendshipRequest) {
        this.id = friendshipRequest.getId();
        this.requester = new PublicUserDTO(friendshipRequest.getRequester());
        this.receiver = new PublicUserDTO(friendshipRequest.getReceiver());
    }
}
