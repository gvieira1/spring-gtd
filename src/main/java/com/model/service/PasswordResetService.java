package com.model.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.exception.UserNotFoundException;
import com.model.entity.PasswordResetToken;
import com.model.entity.User;
import com.repository.PasswordResetTokenRepository;

@Service
public class PasswordResetService {

    private final UserService userService;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(UserService userService,
                                 PasswordResetTokenRepository tokenRepository,
                                 EmailService emailService,
                                 PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public void sendPasswordResetToken(String email) {
    	User user;
		try {
			user = userService.findByEmail(email);
		} catch (UserNotFoundException e) {
			return;
		}
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);
        
        this.deleteTokens(user.getId());

        PasswordResetToken passwordResetToken = new PasswordResetToken(token, user, expiryDate);
        tokenRepository.save(passwordResetToken);

        String resetLink = "http://localhost:8080/resetPassword.html?token=" + token;
        emailService.sendEmail(user.getEmail(), "Resete sua senha", "Clique no link para resetar sua senha: " + resetLink);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken passwordResetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (passwordResetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = passwordResetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userService.saveUser(user);

        tokenRepository.delete(passwordResetToken); 
    }
    
    public void deleteTokens(Long id) {
        List<PasswordResetToken> expiredTokens = tokenRepository.findByUserId(id);
        if (!expiredTokens.isEmpty()) {
            tokenRepository.deleteAll(expiredTokens);
        }
    }


}
