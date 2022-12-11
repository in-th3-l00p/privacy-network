package com.intheloop.social.service;

import com.intheloop.social.domain.Post;
import com.intheloop.social.domain.User;
import com.intheloop.social.repository.PostRepository;
import com.intheloop.social.repository.UserRepository;
import com.intheloop.social.util.dto.PostDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Objects;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository
    ) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
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

    public Collection<Post> getUserPosts(User user) {
        return postRepository.findAllByUserId(user.getId());
    }

    public Collection<Post> getUserFeed(User user) {
        return getUserPosts(user);
    }
}
