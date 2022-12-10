package com.intheloop.social.domain;

import jakarta.persistence.*;

import java.time.LocalDate;

@Table
@Entity
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user1_id")
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id")
    private User user2;

    @Column(nullable = false)
    private boolean close;

    @Column(nullable = false)
    private LocalDate creationDate;

    @OneToOne
    private Conversation conversation;

    public Friendship() {
        creationDate = LocalDate.now();
        close = false;
    }

    public Friendship(User user1, User user2, Conversation conversation) {
        creationDate = LocalDate.now();
        close = false;
        this.user1 = user1;
        this.user2 = user2;
        this.conversation = conversation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser1() {
        return user1;
    }

    public void setUser1(User user1) {
        this.user1 = user1;
    }

    public User getUser2() {
        return user2;
    }

    public void setUser2(User user2) {
        this.user2 = user2;
    }

    public boolean isClose() {
        return close;
    }

    public void setClose(boolean close) {
        this.close = close;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }
}
