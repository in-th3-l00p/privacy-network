package com.intheloop.social.domain;

import jakarta.persistence.*;

@Entity
@Table
public class FriendshipRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    public FriendshipRequest() {
    }

    public FriendshipRequest(User requester, User receiver) {
        this.requester = requester;
        this.receiver = receiver;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User creator) {
        this.requester = creator;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User questioned) {
        this.receiver = questioned;
    }
}
