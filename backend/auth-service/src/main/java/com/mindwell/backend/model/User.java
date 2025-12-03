package com.mindwell.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;
    @JsonIgnore
    private String password;

    private String name;

    private String phone;

    private String avatar;

    private Set<Role> roles; // USER, ADMIN, PSYCHOLOGIST

    private boolean notificationEnabled = true;

    private int notificationInterval = 4; // hours

    private String googleId;

    private String facebookId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public enum Role {
        USER,
        ADMIN,
        PSYCHOLOGIST;

        // This allows MongoDB to have lowercase "admin" and convert it to ADMIN
        // automatically
        @JsonCreator
        public static Role fromString(String value) {
            if (value == null) {
                return null;
            }
            return Role.valueOf(value.toUpperCase());
        }

        @JsonValue
        public String toJson() {
            return this.name();
        }
    }
}