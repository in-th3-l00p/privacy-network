package com.intheloop.social.service.feed;

import com.intheloop.social.domain.Friendship;
import com.intheloop.social.domain.Post;
import com.intheloop.social.domain.User;

import java.util.List;

public interface FeedService {
    void updateFeedOnPost(User user, Post post);
    void updateFeedOnNewFriendship(Friendship friendship);
    void updateFeedOnDeletedFriendship(Friendship friendship);

    List<Post> getUserFeed(User user, int page, int size);
    int countUserFeed(User user);
}
