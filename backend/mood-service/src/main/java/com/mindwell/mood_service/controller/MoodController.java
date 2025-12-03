package com.mindwell.mood_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mindwell.mood_service.dto.CreateMoodRequest;
import com.mindwell.mood_service.model.Mood;
import com.mindwell.mood_service.service.MoodService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mood")
public class MoodController {

    private final MoodService moodService;

    public MoodController(MoodService moodService) {
        this.moodService = moodService;
    }

    // Public test endpoint (keeps previous behavior)
    @GetMapping("/test")
    public ResponseEntity<String> testProtectedEndpoint(
            @RequestHeader(value = "X-Auth-User-ID", required = false) String userId) {

        System.out.println("LOG: Authenticated Mood Request from User ID: " + userId);

        return ResponseEntity.ok("SUCCESS: MOOD-SERVICE accessed by authenticated user ID: " + userId);
    }

    @GetMapping
    public ResponseEntity<List<Mood>> listMoods() {
        return ResponseEntity.ok(moodService.listAll());
    }

    @PostMapping
    public ResponseEntity<Mood> createMood(@RequestHeader(value = "X-Auth-User-ID", required = false) String userId,
                                           @RequestBody CreateMoodRequest req) {
        Mood created = moodService.create(userId != null ? userId : "anonymous", req);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMood(@PathVariable String id, @RequestBody CreateMoodRequest req) {
        return moodService.update(id, req)
                .map(m -> ResponseEntity.ok(m))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMood(@PathVariable String id) {
        boolean deleted = moodService.delete(id);
        if (deleted) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> analytics(@RequestParam(required = false) String range) {
        return ResponseEntity.ok(moodService.analytics(range));
    }
}