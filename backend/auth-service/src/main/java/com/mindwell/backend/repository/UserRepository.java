package com.mindwell.backend.repository;

import com.mindwell.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Finds a User document by their unique email address.
     * Used during login and registration to check for existence.
     * Spring Data automatically implements this based on the method name.
     * @param email The user's email address.
     * @return An Optional containing the User if found, or empty otherwise.
     */
    /**
     * Finds a user by email. Let Spring Data derive the query from the method name.
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds a user by name.
     */
    Optional<User> findByName(String name);

    /**
     * Finds a User document by their Google ID.
     * Useful for implementing Google Sign-In.
     * @param googleId The unique identifier provided by Google OAuth.
     * @return An Optional containing the User if found, or empty otherwise.
     */
    Optional<User> findByGoogleId(String googleId);
    boolean existsByName(String name);

    boolean existsByEmail(String email);
    // Find all users with ADMIN role
    @Query("{ 'roles': 'ADMIN' }")
    java.util.List<User> findAllAdmins();
}