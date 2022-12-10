package com.intheloop.social.util.dto;

import com.intheloop.social.domain.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostDTO {
    private Long id;
    private String text;
    private LocalDateTime postDate;
    private Long likes = 0L;
    private Long dislikes = 0L;
    private Long userId;
    private String visibility;

    public PostDTO(Post post) {
        this.id = post.getId();
        this.text = post.getText();
        this.postDate = post.getPostDate();
        this.likes = post.getLikes();
        this.dislikes = post.getDislikes();
        this.visibility = String.valueOf(post.getVisibility()).toLowerCase();
        this.userId = post.getUser().getId();
    }
}
