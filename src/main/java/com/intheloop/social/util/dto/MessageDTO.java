package com.intheloop.social.util.dto;

import com.intheloop.social.domain.Message;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MessageDTO {
    private Long id;
    private PublicUserDTO user;
    private String content;

    public MessageDTO(Message message) {
        this.id = message.getId();
        this.user = new PublicUserDTO(message.getUser());
        this.content = message.getContent();
    }
}
