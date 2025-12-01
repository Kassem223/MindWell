package com.mindwell.mood_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mood")
public class MoodController {
    @GetMapping("/test")
    public ResponseEntity<String> testProtectedEndpoint(
            // Reads the header injected by the API Gateway after JWT validation
            @RequestHeader("X-Auth-User-ID") String userId) {

        System.out.println("LOG: Authenticated Mood Request from User ID: " + userId);

        return ResponseEntity.ok("SUCCESS: MOOD-SERVICE accessed by authenticated user ID: " + userId);
    }
}