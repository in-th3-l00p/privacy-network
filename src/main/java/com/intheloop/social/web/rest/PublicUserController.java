package com.intheloop.social.web.rest;

import com.intheloop.social.domain.User;
import com.intheloop.social.service.UserService;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.PublicUserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/public/user")
public class PublicUserController {
    private final UserService userService;

    public PublicUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getUserDetails(@RequestParam("userId") Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        return ResponseEntity.ok(new PublicUserDTO(user.get()));
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUserDetails() {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.unauthorizedError);
        Optional<User> user = userService.getUserByUsername(username.get());
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        return ResponseEntity.ok(new PublicUserDTO(user.get()));
    }
}
