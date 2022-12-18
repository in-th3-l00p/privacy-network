package com.intheloop.social.service;

import com.intheloop.social.domain.Post;
import com.intheloop.social.domain.User;
import com.intheloop.social.repository.PostRepository;
import com.intheloop.social.util.dto.PostDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(
            PostRepository postRepository
    ) {
        this.postRepository = postRepository;
    }

    public void createPost(User user, PostDTO postDTO) throws Exception {
        Post post = new Post();
        post.setText(postDTO.getText());
        post.setPostDate(LocalDateTime.now());
        post.setLikes(0L);
        post.setDislikes(0L);
        post.setUser(user);
        if (Objects.equals(postDTO.getVisibility(), "public"))
            post.setVisibility(Post.Visibility.PUBLIC);
        else if (Objects.equals(postDTO.getVisibility(), "private"))
            post.setVisibility(Post.Visibility.PRIVATE);
        else
            throw new Exception("Invalid visibility.");

        postRepository.save(post);
    }

    public List<Post> getPublicUserPosts(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return postRepository
                .findAllByVisibilityAndUser(Post.Visibility.PUBLIC, user, pageable)
                .toList();
    }

    public int countPublicUserPosts(User user) {
        return postRepository.countAllByVisibilityAndUser(Post.Visibility.PUBLIC, user);
    }

    public Collection<Post> getUserFeed(User user) {
        return postRepository.findAllByUserId(user.getId());
    }
}
