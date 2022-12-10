package com.intheloop.social.util.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long id;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private LocalDate registrationDate;
}
