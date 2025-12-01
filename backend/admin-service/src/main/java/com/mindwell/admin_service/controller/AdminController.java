package com.mindwell.admin_service.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @GetMapping("/dashboard")
    public ResponseEntity<String> testAdminEndpoint(
            // Reads the header injected by the API Gateway after JWT validation
            @RequestHeader("X-Auth-User-ID") String userId) {

        System.out.println("LOG: Authenticated Admin Request from User ID: " + userId);

        // NOTE: In a real app, you would perform an additional check for ADMIN role here.

        return ResponseEntity.ok("ACCESS GRANTED to Admin Dashboard for user: " + userId);
    }
}