// File: mindwell/api-gateway/src/main/java/com/mindwell/apigateway/config/ApiGatewaySecurityConfig.java

package com.mindwell.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class ApiGatewaySecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        // 1. Disable CSRF protection because we are using JWT/token-based authentication, 
        // which is stateless and protects against CSRF already.
        http.csrf(csrf -> csrf.disable());

        // 2. We allow all requests for now. 
        // Later, we will use a custom filter to validate JWTs for protected routes.
        http.authorizeExchange(exchange -> exchange.anyExchange().permitAll());

        return http.build();
    }
}