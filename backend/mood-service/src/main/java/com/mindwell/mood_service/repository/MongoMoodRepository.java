package com.mindwell.mood_service.repository;

import com.mindwell.mood_service.model.Mood;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MongoMoodRepository extends MongoRepository<Mood, String> {
    List<Mood> findByUserId(String userId);
}
