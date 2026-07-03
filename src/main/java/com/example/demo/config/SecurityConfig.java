package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults()) // ✅ correct usage
            .csrf(csrf -> csrf.disable())    // disable CSRF for APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/users/**").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
