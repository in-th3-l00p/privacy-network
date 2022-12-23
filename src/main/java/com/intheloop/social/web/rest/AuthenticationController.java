package com.intheloop.social.web.rest;

import com.intheloop.social.security.authentication.TokenManager;
import com.intheloop.social.service.UserService;
import com.intheloop.social.util.RestErrors;
import com.intheloop.social.util.SecurityUtils;
import com.intheloop.social.util.dto.UserDTO;
import com.intheloop.social.util.exceptions.UserNotFoundException;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthenticationController {
    private final UserService userService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final TokenManager tokenManager;

    public AuthenticationController(
            UserService userService,
            AuthenticationManagerBuilder authenticationManagerBuilder,
            TokenManager tokenManager
    ) {
        this.userService = userService;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.tokenManager = tokenManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody Credentials credentials) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                credentials.getUsername(),
                credentials.getPassword()
        );

        try {
            Authentication authentication = authenticationManagerBuilder
                    .getObject()
                    .authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return ResponseEntity.ok(tokenManager.createJWT(authentication));
        } catch (DisabledException exception) {
            return ResponseEntity.badRequest().body(RestErrors.disabledAccount);
        } catch (LockedException exception) {
            return ResponseEntity.badRequest().body(RestErrors.lockedError);
        } catch (BadCredentialsException exception) {
            return ResponseEntity.badRequest().body(RestErrors.badCredentialsError);
        } catch (Exception exception) {
            return ResponseEntity.badRequest().body(RestErrors.authenticationError);
        }
    }

    @Getter
    @Setter
    private static class Credentials {
        private String username;
        private String password;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        userService.createUser(userDTO);
        return ResponseEntity.ok("Registered");
    }

    @PutMapping("/activate")
    public ResponseEntity<?> activate(@RequestParam("userId") Long userId) {
        try {
            userService.activateUser(userId);
        } catch (UserNotFoundException exception) {
            return ResponseEntity.badRequest().body(RestErrors.userNotFoundError);
        }

        return ResponseEntity.ok("User activated");
    }

    @GetMapping("/auth/valid")
    public boolean valid() {
        return SecurityUtils
                .getInstance()
                .getCurrentUser()
                .isPresent();
    }
}
