package com.model.dto.auth;

public record ResetPasswordRequestDTO(String token, String newPassword) {}
