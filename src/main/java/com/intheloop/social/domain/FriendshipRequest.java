package com.intheloop.social.domain;

import jakarta.persistence.*;

@Entity
@Table
public class FriendshipRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToOne
    @JoinColumn(name = "questioned_id")
    private User questioned;

    public FriendshipRequest() {
    }

    public FriendshipRequest(User creator, User questioned) {
        this.creator = creator;
        this.questioned = questioned;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public User getQuestioned() {
        return questioned;
    }

    public void setQuestioned(User questioned) {
        this.questioned = questioned;
    }
}
