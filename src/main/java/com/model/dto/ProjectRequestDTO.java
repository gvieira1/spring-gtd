package com.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectRequestDTO {
    @NotBlank
    private String description;
    
    private Long userId;
}
