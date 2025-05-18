package com.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.dto.NotificationPreferenceDTO;
import com.model.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @Operation(summary = "Update user notification preference")
    @ApiResponses(value = {
                    @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    @PostMapping("/notification-preference")
    public ResponseEntity<Void> updateNotificationPreference(@RequestBody NotificationPreferenceDTO preferenceDTO) {
    	userService.setNotificationDaysBefore(preferenceDTO.notificationDaysBeforeDefault());
    	return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "Return user notification preference")
    @ApiResponses(value = {
                    @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    @GetMapping("/notification-preference")
    public ResponseEntity<NotificationPreferenceDTO> getNotificationPreference() {
    	return ResponseEntity.ok(userService.getNotificationDaysBefore());
    }
    
    
}