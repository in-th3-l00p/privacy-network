package com.intheloop.social.util.dto;

import com.intheloop.social.domain.Post;
import com.intheloop.social.domain.User;
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
    private boolean liked = false;
    private boolean disliked = false;

    public PostDTO(Post post) {
        this.id = post.getId();
        this.text = post.getText();
        this.postDate = post.getPostDate();
        this.likes = (long) post.getLikes().size();
        this.dislikes = (long) post.getDislikes().size();
        this.visibility = String.valueOf(post.getVisibility()).toLowerCase();
        this.userId = post.getUser().getId();
    }

    public PostDTO(Post post, User user) {
        this(post);
        if (post.getLikes().contains(user))
            liked = true;
        else if (post.getDislikes().contains(user))
            disliked = true;
    }
}
