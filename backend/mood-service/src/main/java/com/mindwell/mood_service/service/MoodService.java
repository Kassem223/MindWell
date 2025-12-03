package com.mindwell.mood_service.service;

import com.mindwell.mood_service.model.Mood;
import com.mindwell.mood_service.dto.CreateMoodRequest;
import com.mindwell.mood_service.repository.MongoMoodRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class MoodService {

    private final MongoMoodRepository repository;

    public MoodService(MongoMoodRepository repository) {
        this.repository = repository;
    }

    public List<Mood> listAll() {
        return repository.findAll();
    }

    public Mood create(String userId, CreateMoodRequest req) {
        Mood m = new Mood();
        m.setUserId(userId);
        m.setScore(req.getScore());
        m.setNote(req.getNote());
        m.setCreatedAt(Instant.now());
        return repository.save(m);
    }

    public Optional<Mood> findById(String id) {
        return repository.findById(id);
    }

    public Optional<Mood> update(String id, CreateMoodRequest req) {
        Optional<Mood> existing = repository.findById(id);
        if (existing.isEmpty()) return Optional.empty();
        Mood m = existing.get();
        m.setScore(req.getScore());
        m.setNote(req.getNote());
        repository.save(m);
        return Optional.of(m);
    }

    public boolean delete(String id) {
        Optional<Mood> existing = repository.findById(id);
        if (existing.isEmpty()) return false;
        repository.deleteById(id);
        return true;
    }

    public Map<String, Object> analytics(String range) {
        // Simple analytics: average score and count over stored moods.
        List<Mood> all = repository.findAll();
        Map<String, Object> result = new HashMap<>();
        if (all.isEmpty()) {
            result.put("average", 0);
            result.put("count", 0);
            return result;
        }
        double avg = all.stream().collect(Collectors.averagingInt(Mood::getScore));
        result.put("average", avg);
        result.put("count", all.size());
        return result;
    }
}
