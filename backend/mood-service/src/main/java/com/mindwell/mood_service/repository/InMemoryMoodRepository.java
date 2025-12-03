package com.mindwell.mood_service.repository;

import com.mindwell.mood_service.model.Mood;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

@Repository
public class InMemoryMoodRepository {
    private final Map<String, Mood> store = new ConcurrentHashMap<>();

    public List<Mood> findAll() {
        return new ArrayList<>(store.values()).stream()
                .sorted(Comparator.comparing(Mood::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public Optional<Mood> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public Mood save(Mood mood) {
        store.put(mood.getId(), mood);
        return mood;
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public List<Mood> findByUserId(String userId) {
        return store.values().stream()
                .filter(m -> m.getUserId() != null && m.getUserId().equals(userId))
                .sorted(Comparator.comparing(Mood::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }
}
