package com.intheloop.social.util.dto;

import com.intheloop.social.domain.Friendship;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FriendshipDTO {
    private Long id;
    private PublicUserDTO user1;
    private PublicUserDTO user2;
    private LocalDate creationDate;

    public FriendshipDTO(Friendship friendship) {
        this.id = friendship.getId();
        this.user1 = new PublicUserDTO(friendship.getUser1());
        this.user2 = new PublicUserDTO(friendship.getUser2());
        this.creationDate = friendship.getCreationDate();
    }
}
