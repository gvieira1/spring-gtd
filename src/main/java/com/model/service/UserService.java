package com.model.service;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.exception.UserNotFoundException;
import com.model.dto.NotificationPreferenceDTO;
import com.model.dto.auth.RegisterDTO;
import com.model.entity.User;
import com.repository.UserRepository;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public void register(RegisterDTO dto) {
		Optional<User> existing = userRepository.findUserByEmail(dto.email());
		if (existing.isPresent()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail já registrado.");
		}

		User user = new User();
		user.setName(dto.name());
		user.setEmail(dto.email());
		user.setPassword(passwordEncoder.encode(dto.password()));
		userRepository.save(user);
	}
	
	public void saveMoodleUser(User user, Long moodleId) {
		user.setMoodleUserId(moodleId);
		userRepository.save(user);
	}
	
	public void saveUser(User user) {
		userRepository.save(user);
	}
	
	public User findByEmail(String email) {
	    return userRepository.findUserByEmail(email)
	        .orElseThrow(() -> new UserNotFoundException("Usuário não existe!"));
	}

	
	public User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
        	throw new UserNotFoundException("Usuário não encontrado!");
        }

        return user;
    }

	public void setNotificationDaysBefore(Integer notificationDaysBeforeDefault) {
		User user = this.getAuthenticatedUser();
		user.setNotificationDaysBeforeDefault(notificationDaysBeforeDefault);
        userRepository.save(user);	
	}
	
	public NotificationPreferenceDTO getNotificationDaysBefore() {
		User user = this.getAuthenticatedUser();
		NotificationPreferenceDTO dto = new NotificationPreferenceDTO(user.getNotificationDaysBeforeDefault());
		return dto;
	}
}
