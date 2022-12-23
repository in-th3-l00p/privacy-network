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
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(
            PostRepository postRepository
    ) {
        this.postRepository = postRepository;
    }

    public Post createPost(User user, PostDTO postDTO) throws Exception {
        Post post = new Post();
        post.setText(postDTO.getText());
        post.setPostDate(LocalDateTime.now());
        post.setUser(user);
        if (Objects.equals(postDTO.getVisibility(), "public"))
            post.setVisibility(Post.Visibility.PUBLIC);
        else if (Objects.equals(postDTO.getVisibility(), "private"))
            post.setVisibility(Post.Visibility.PRIVATE);
        else
            throw new Exception("Invalid visibility.");

        return postRepository.save(post);
    }

    public List<Post> getUserPosts(User user) {
        return postRepository.findAllByUser(user).stream().toList();
    }

    public List<Post> getUserPosts(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return postRepository.findAllByUser(user, pageable).toList();
    }

    public int countUserPosts(User user) {
        return postRepository.countAllByUser(user);
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

    public void likePost(User user, Post post) {
        post.getDislikes().remove(user);
        if (post.getLikes().contains(user))
            post.getLikes().remove(user);
        else
            post.getLikes().add(user);

        postRepository.save(post);
    }

    public void dislikePost(User user, Post post) {
        post.getLikes().remove(user);
        if (post.getDislikes().contains(user))
            post.getDislikes().remove(user);
        else
            post.getDislikes().add(user);

        postRepository.save(post);
    }

    public Optional<Post> getPostById(Long postId) {
        return postRepository.findById(postId);
    }
}
