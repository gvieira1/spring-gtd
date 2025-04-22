package com.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.entity.User;
import com.model.service.MoodleService;
import com.model.service.UserService;

@RestController
@RequestMapping("/api/moodle")
public class MoodleSyncController {

    private final MoodleService moodleService;
    private final UserService userService;

    public MoodleSyncController(MoodleService moodleService, UserService userService) {
		this.moodleService = moodleService;
		this.userService = userService;
	}


	@PostMapping("/sync")
    public ResponseEntity<String> syncUserWithMoodle(Authentication auth) {
        User user = userService.getAuthenticatedUser();
        Long moodleId = moodleService.findMoodleUserIdByEmail(user.getEmail()).block();
        userService.saveMoodleUser(user, moodleId);
        return ResponseEntity.ok("Usuário sincronizado com o Moodle! ID: " + moodleId);
    }
}