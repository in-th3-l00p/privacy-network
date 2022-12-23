package com.intheloop.social.web.rest;

import com.intheloop.social.domain.User;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.PublicUserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @GetMapping
    public ResponseEntity<?> getCurrentUserDetails() {
        Optional<User> user = SecurityUtils.getInstance().getCurrentUser();
        if (user.isEmpty())
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        return ResponseEntity.ok(new PublicUserDTO(user.get()));
    }
}
