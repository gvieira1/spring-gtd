package com.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.dto.TaskResponseDTO;
import com.model.entity.User;
import com.model.service.MoodleService;
import com.model.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/moodle")
public class MoodleSyncController {

    private final MoodleService moodleService;
    private final UserService userService;

    public MoodleSyncController(MoodleService moodleService, UserService userService) {
		this.moodleService = moodleService;
		this.userService = userService;
	}

    @Operation(summary = "Synchronize user email with Moodle ID")
    @ApiResponses(value = {
                    @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
	@PostMapping("/sync")
    public ResponseEntity<String> syncUserWithMoodle(Authentication auth) {
        User user = userService.getAuthenticatedUser();
        Long moodleId = moodleService.findMoodleUserIdByEmail(user.getEmail()).block();
        userService.saveMoodleUser(user, moodleId);
        return ResponseEntity.ok("Usuário sincronizado com o Moodle! ID: " + moodleId);
    }
	
    @Operation(summary = "Synchronize pending tasks from Moodle with the system")
    @ApiResponses(value = {
                    @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
	@PostMapping("/sync-tasks")
    public ResponseEntity<List<TaskResponseDTO>> syncTasks(Authentication auth) {
		User user = userService.getAuthenticatedUser();
        return ResponseEntity.ok(moodleService.syncPendingTasksFromMoodle(user));
    }
}