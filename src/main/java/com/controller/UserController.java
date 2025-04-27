package com.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.dto.NotificationPreferenceDTO;
import com.model.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/notification-preference")
    public ResponseEntity<Void> updateNotificationPreference(@RequestBody NotificationPreferenceDTO preferenceDTO) {
    	userService.setNotificationDaysBefore(preferenceDTO.notificationDaysBeforeDefault());
    	return ResponseEntity.noContent().build();
    }
}