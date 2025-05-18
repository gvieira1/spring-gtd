package com.model.dto;

public record ResetPasswordRequestDTO(String token, String newPassword) {}
