package com.intheloop.social.repository;

import com.intheloop.social.domain.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long>, PagingAndSortingRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User AS u WHERE u.username LIKE :username%")
    List<User> searchByUsername(@Param("username") String username);
}
