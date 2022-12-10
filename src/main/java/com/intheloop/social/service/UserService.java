package com.intheloop.social.service;

import com.intheloop.social.domain.User;
import com.intheloop.social.repository.AuthorityRepository;
import com.intheloop.social.repository.UserRepository;
import com.intheloop.social.util.dto.UserDTO;
import com.intheloop.social.util.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(
            UserRepository userRepository,
            AuthorityRepository authorityRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username + " not found"));
    }

    public void createUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setBirthDate(userDTO.getBirthDate());
        user.setRegistrationDate(LocalDate.now());
        user.setEnabled(true); // development purposes
        userRepository.save(user);
    }

    public void activateUser(Long userId) throws UserNotFoundException {
        User user = userRepository
                .findById(userId)
                .orElseThrow(UserNotFoundException::new);
        user.setEnabled(true);
        userRepository.save(user);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }
}
