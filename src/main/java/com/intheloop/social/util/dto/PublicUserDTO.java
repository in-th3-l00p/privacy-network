package com.intheloop.social.util.dto;

import com.intheloop.social.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PublicUserDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private LocalDate registrationDate;
    private Relationship relationship = Relationship.NOTHING;

    public enum Relationship {
        NOTHING,
        REQUESTED,
        RECEIVED,
        FRIENDS
    }

    public PublicUserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.birthDate = user.getBirthDate();
        this.registrationDate = user.getRegistrationDate();
    }

    public PublicUserDTO(User user, Relationship relationship) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.birthDate = user.getBirthDate();
        this.registrationDate = user.getRegistrationDate();
        this.relationship = relationship;
    }
}
