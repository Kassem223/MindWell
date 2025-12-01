package com.mindwell.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfiguration {

    @Bean
    public CorsWebFilter corsWebFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final org.springframework.web.cors.CorsConfiguration corsConfig = new org.springframework.web.cors.CorsConfiguration();

        // Allow frontend origin
        corsConfig.setAllowedOriginPatterns(Arrays.asList("http://localhost:4200"));

        // Allow credentials (important for auth)
        corsConfig.setAllowCredentials(true);

        // Allowed methods
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers from client
        corsConfig.setAllowedHeaders(Arrays.asList("*"));

        // Expose headers to client (including Authorization)
        corsConfig.setExposedHeaders(Arrays.asList("*"));

        // Cache preflight response for 1 hour
        corsConfig.setMaxAge(3600L);

        // Apply to all paths
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}