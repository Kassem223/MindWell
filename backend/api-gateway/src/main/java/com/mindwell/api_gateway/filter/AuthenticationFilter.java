package com.mindwell.api_gateway.filter;
// File: AuthenticationFilter.java


import java.nio.charset.StandardCharsets;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.security.Key;

import java.util.Arrays;
import java.util.List;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

   
    public static final List<String> OPEN_API_ENDPOINTS = Arrays.asList( // <--- Change List.of() to Arrays.asList()
            "/api/auth/register",
            "/api/auth/login"
    );
    private final String secretKey;

    public AuthenticationFilter(@Value("${jwt.secret.key}") String secretKey) {
        super(Config.class);
        this.secretKey = secretKey;
    }

    public static class Config {}

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();

            // 1. Check if the path is an open endpoint (no JWT required)
            if (OPEN_API_ENDPOINTS.contains(path)) {
                return chain.filter(exchange);
            }

            // 2. Check for Authorization header
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return this.onError(exchange, "Authorization header missing", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return this.onError(exchange, "Bearer token missing or malformed", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            // 3. Validate Token and Extract Claims
            try {
                Claims claims = this.validateToken(token);

                // 4. Inject validated claims (User ID/Username) into the request header
                ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                        .header("X-Auth-User-ID", claims.getSubject())
                        .header(HttpHeaders.AUTHORIZATION, authHeader)
                        .build();

                // Continue the chain with the modified request
                return chain.filter(exchange.mutate().request(mutatedRequest).build());
            } catch (Exception e) {
                // If validation fails (expired, invalid signature, etc.)
                return this.onError(exchange, "Token validation failed", HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    private Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        // Optional: Add logging here
        return response.setComplete();
    }
}
