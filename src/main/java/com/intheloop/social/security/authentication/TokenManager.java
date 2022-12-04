package com.intheloop.social.security.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.lang.Strings;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TokenManager {
    private static final String DEFAULT_SECRET = "secretthelloworld6969helloworldhelloworld";
    private static final long DEFAULT_VALIDITY = 604800; // in seconds
    private static final String AUTHORITIES_KEY = "authorities";

    private final Key key;
    private final JwtParser tokenParser;
    private final long validity;

    public TokenManager() {
        // TODO: get the secret from the configuration
        this.validity = DEFAULT_VALIDITY * 1000;
        this.key = Keys.hmacShaKeyFor(DEFAULT_SECRET.getBytes());
        this.tokenParser = Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build();
    }

    public String createJWT(Authentication authentication) {
        String joinnedAuthorities = authentication
                .getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        long now = (new Date()).getTime();
        Date expiration = new Date(now + validity);
        return Jwts
                .builder()
                .signWith(key)
                .setSubject(authentication.getName())
                .claim(AUTHORITIES_KEY, joinnedAuthorities)
                .setExpiration(expiration)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        try {
            Claims claims = tokenParser.parseClaimsJws(token).getBody();
            List<SimpleGrantedAuthority> authorities = Arrays.stream(
                        claims.get(AUTHORITIES_KEY).toString().split(",")
                    )
                    .filter(Strings::hasText)
                    .map(SimpleGrantedAuthority::new)
                    .toList();
            User user = new User(claims.getSubject(), "", authorities);
            return new UsernamePasswordAuthenticationToken(user, token, authorities);
        } catch (Exception e) {
            return null;
        }
    }
}
