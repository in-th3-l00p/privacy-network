package com.intheloop.social.util;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@ToString
public class ServerError {
    private String name;
    private String description;
    private LocalDateTime dateTime;

    public ServerError(String name, String description) {
        this.name = name;
        this.description = description;
        this.dateTime = LocalDateTime.now();
    }
}
