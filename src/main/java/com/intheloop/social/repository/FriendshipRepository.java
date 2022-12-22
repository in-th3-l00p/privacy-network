package com.intheloop.social.repository;

import com.intheloop.social.domain.Friendship;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends CrudRepository<Friendship, Long> {
    @Query("SELECT f FROM Friendship AS f WHERE f.user1.id = :userId OR f.user2.id = :userId")
    List<Friendship> findAllByUserId(@Param("userId") Long userId);

    @Query(
            "SELECT f FROM Friendship AS f WHERE " +
                    "f.user1.id = :userId1 AND f.user2.id = :userId2 OR " +
                    "f.user1.id = :userId2 AND f.user2.id = :userId1")
    Optional<Friendship> findByUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
