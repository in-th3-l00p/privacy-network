package com.intheloop.social.service.feed;

import com.intheloop.social.domain.Friendship;
import com.intheloop.social.domain.Post;
import com.intheloop.social.domain.User;
import com.intheloop.social.service.FriendshipService;
import com.intheloop.social.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FeedServiceImpl implements FeedService {
    @AllArgsConstructor
    private static class PostIdTuple implements ZSetOperations.TypedTuple<Object> {
        private Long id;

        @Override
        public Object getValue() {
            return id;
        }

        @Override
        public Double getScore() {
            return Double.valueOf(id);
        }

        @Override
        public int compareTo(ZSetOperations.TypedTuple<Object> other) {
            long otherId = Long.parseLong(String.valueOf(other.getValue()));
            return Long.compare(this.id, otherId);
        }
    }

    private static final String KEY = "feed";
    private final ZSetOperations<String, Object> zSetOperations;

    private final PostService postService;
    private final FriendshipService friendshipService;

    public FeedServiceImpl(
            RedisTemplate<String, Object> redisTemplate,
            PostService postService,
            FriendshipService friendshipService
    ) {
        this.zSetOperations = redisTemplate.opsForZSet();
        this.postService = postService;
        this.friendshipService = friendshipService;
    }

    private String getKey(User user) {
        return String.format("%s:%d", KEY, user.getId());
    }

    private Set<ZSetOperations.TypedTuple<Object>> getUserPosts(User user) {
        return postService
                .getUserPosts(user)
                .stream()
                .map(post -> new PostIdTuple(post.getId()))
                .collect(Collectors.toSet());
    }

    @Override
    public void updateFeedOnPost(User user, Post post) {
        zSetOperations.add(getKey(user), post.getId(), post.getId());
        friendshipService.getFriendships(user)
                .forEach(friendship -> {
                    User friend = friendshipService.getFriend(friendship, user);
                    zSetOperations.add(getKey(friend), post.getId(), post.getId());
                });
    }

    @Override
    public void updateFeedOnNewFriendship(Friendship friendship) {
        Set<ZSetOperations.TypedTuple<Object>> user1Posts = getUserPosts(friendship.getUser1());
        Set<ZSetOperations.TypedTuple<Object>> user2Posts = getUserPosts(friendship.getUser2());
        if (user2Posts.size() > 0)
            zSetOperations.add(getKey(friendship.getUser1()), getUserPosts(friendship.getUser2()));
        if (user1Posts.size() > 0)
            zSetOperations.add(getKey(friendship.getUser2()), getUserPosts(friendship.getUser1()));
    }

    @Override
    public void updateFeedOnDeletedFriendship(Friendship friendship) {
        Set<ZSetOperations.TypedTuple<Object>> user1Posts = getUserPosts(friendship.getUser1());
        Set<ZSetOperations.TypedTuple<Object>> user2Posts = getUserPosts(friendship.getUser2());
        if (user2Posts.size() > 0)
            zSetOperations.remove(getKey(friendship.getUser1()), getUserPosts(friendship.getUser2()));
        if (user1Posts.size() > 0)
            zSetOperations.remove(getKey(friendship.getUser2()), getUserPosts(friendship.getUser1()));
    }

    @Override
    public List<Post> getUserFeed(User user, int page, int size) {
        return Objects.requireNonNull(zSetOperations
                .reverseRange(getKey(user), (long) page * size, (long) (page + 1) * size - 1))
                .stream()
                .map(object -> Long.parseLong(String.valueOf(object)))
                .map(id -> postService.getPostById(id).orElse(null))
                .toList();
    }

    @Override
    public int countUserFeed(User user) {
        Long size = zSetOperations.size(getKey(user));
        if (size == null)
            return 0;
        return Math.toIntExact(size);
    }
}
