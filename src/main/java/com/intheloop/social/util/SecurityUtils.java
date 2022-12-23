package com.intheloop.social.util;

import com.intheloop.social.domain.User;
import com.intheloop.social.service.UserService;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityUtils implements ApplicationContextAware {
    private final UserService userService;
    private static ApplicationContext applicationContext;

    public SecurityUtils(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SecurityUtils.applicationContext = applicationContext;
    }

    public static SecurityUtils getInstance() {
        return applicationContext.getBean(SecurityUtils.class);
    }

    public static Optional<String> getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null)
            return Optional.empty();
        return Optional.of(authentication.getName());
    }

    public Optional<User> getCurrentUser() {
        Optional<String> username = SecurityUtils.getCurrentUsername();
        if (username.isEmpty())
            return Optional.empty();
        return userService.getUserByUsername(username.get());
    }
}
