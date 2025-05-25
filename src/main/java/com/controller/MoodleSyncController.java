package com.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.dto.task.TaskResponseDTO;
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
    public ResponseEntity<String> syncUserWithMoodle() {
        User user = userService.getAuthenticatedUser();
        Long moodleId = moodleService.findMoodleUserIdByEmail(user.getEmail()).block();
        userService.saveMoodleUser(user, moodleId);
        return ResponseEntity.ok("Usuário sincronizado com o Moodle! ID: " + moodleId);
    }
	
    @Operation(summary = "Synchronize pending tasks from Moodle with the system")
    @ApiResponses(value = {
                    @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
	@GetMapping("/sync-tasks")
    public ResponseEntity<Page<TaskResponseDTO>> syncTasks(Pageable pageable) {
		User user = userService.getAuthenticatedUser();
        return ResponseEntity.ok(moodleService.syncPendingTasksFromMoodle(user, pageable));
    }
    

    @Operation(summary = "Check moodle sync")
    @ApiResponses(value = {
                    @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    @GetMapping("/check-moodle-sync")
    public ResponseEntity<Boolean> checkMoodleSyncStatus() {
        User user = userService.getAuthenticatedUser();
        boolean isSynced = user.getMoodleUserId() != null;
        return ResponseEntity.ok(isSynced);
    }

}