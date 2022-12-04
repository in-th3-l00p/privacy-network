package com.intheloop.social.security.authentication;

import io.jsonwebtoken.lang.Strings;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class AuthorizationFilter extends GenericFilter {
    private final static String AUTHORIZATION_HEADER = "Authorization";
    private final TokenManager tokenManager;

    public AuthorizationFilter(TokenManager tokenManager) {
        this.tokenManager = tokenManager;
    }

    @Override
    public void doFilter(
            ServletRequest servletRequest,
            ServletResponse servletResponse,
            FilterChain chain
    ) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        String authorizationHeader = request.getHeader(AUTHORIZATION_HEADER);
        if (Strings.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            Authentication authentication = tokenManager.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        chain.doFilter(servletRequest, servletResponse);
    }
}
