package com.intheloop.social.repository;

import com.intheloop.social.domain.Post;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;

public interface PostRepository extends CrudRepository<Post, Long> {
    Collection<Post> findAllByUserId(@Param("userId") Long userId);
}
