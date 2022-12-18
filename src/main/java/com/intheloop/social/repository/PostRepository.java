package com.intheloop.social.repository;

import com.intheloop.social.domain.Post;
import com.intheloop.social.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

public interface PostRepository extends CrudRepository<Post, Long>, PagingAndSortingRepository<Post, Long> {
    Collection<Post> findAllByUserId(Long userId);

    Page<Post> findAllByVisibilityAndUser(Post.Visibility visibility, User user, Pageable pageable);

    int countAllByVisibilityAndUser(Post.Visibility visibility, User user);
}
