package com.mindwell.backend.service;

// ... imports for all classes, including PasswordEncoder
import com.mindwell.backend.dto.LoginRequest;
import com.mindwell.backend.dto.RegisterRequest;
import com.mindwell.backend.exception.ResourceNotFoundException; // Create this later
import com.mindwell.backend.model.User;
import com.mindwell.backend.repository.UserRepository;
import com.mindwell.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    // --- Registration ---
    public User registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(User.Role.USER));
        user.setCreatedAt(LocalDateTime.now());
        // Set other default fields

        return userRepository.save(user);
    }

    public String generateToken(String email, Set<User.Role> roles) {
        return jwtUtils.generateToken(email, roles);
    }

    // --- Login ---
    public String authenticateUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password.");
        }

        // Generate and return JWT token
        return jwtUtils.generateToken(user.getEmail(), user.getRoles());
    }
    /**
     * NEW METHOD: Get user by username
     * Used by the /me endpoint
     */
    public User getUserByUsername(String username) {
        return userRepository.findByname(username)
                .orElse(null);
    }

}