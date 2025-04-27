package com.model.dto;

import java.time.LocalDate;

public record TaskNotificationDTO(Long id, String description, LocalDate deadline) {}