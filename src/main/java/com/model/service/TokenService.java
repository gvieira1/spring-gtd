package com.model.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.model.entity.User;

@Service
public class TokenService {

    
    private final JwtEncoder encoder;
    
    public TokenService(JwtEncoder encoder) {
        this.encoder = encoder;
    }

    public String generateToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plus(1, ChronoUnit.HOURS);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("spring-gtd")
                .issuedAt(now)
                .expiresAt(expiry)
                .subject(user.getId().toString())
                .build();

        JwsHeader headers = JwsHeader.with(() -> "HS256").build(); 
        return encoder.encode(JwtEncoderParameters.from(headers, claims)).getTokenValue();
    
    }


}
