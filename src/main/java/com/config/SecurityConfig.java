package com.config;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.security.CustomJwtAuthenticationConverter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Value("${api.security.token.secret}")
    private String secret;
	
	private final JwtCookieToHeaderFilter jwtCookieFilter;
	private final CustomJwtAuthenticationConverter customJwtAuthenticationConverter;
	
	public SecurityConfig(JwtCookieToHeaderFilter jwtCookieFilter, CustomJwtAuthenticationConverter customJwtAuthenticationConverter) {
		this.jwtCookieFilter = jwtCookieFilter;
		this.customJwtAuthenticationConverter =  customJwtAuthenticationConverter;
	}

	@Bean
	 SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    return http
	        .csrf(csrf -> csrf.disable())
	        .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .authorizeHttpRequests(auth -> auth
	            .requestMatchers("/index.html", "/auth/**", "/resetPassword**", "/swagger-ui/**", "/css/**", "/scripts/**", "/").permitAll()
	            .anyRequest().authenticated()
	        )
	        .addFilterBefore(jwtCookieFilter, UsernamePasswordAuthenticationFilter.class)
	        .oauth2ResourceServer(oauth2 -> oauth2
	            .jwt(jwt -> jwt
	                .decoder(jwtDecoder(secret))
	                .jwtAuthenticationConverter(customJwtAuthenticationConverter)
	            )
	        )
	        .build();
	}

	 
	@Bean
	JwtDecoder jwtDecoder(@Value("${api.security.token.secret}") String secret) {
	    SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
	    return NimbusJwtDecoder.withSecretKey(key).build();
	}

	@Bean
	JwtEncoder jwtEncoder(@Value("${api.security.token.secret}") String secret) {
	   SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
	   return new NimbusJwtEncoder(new ImmutableSecret<>(key));
	}

    @Bean
     AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
     PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
}