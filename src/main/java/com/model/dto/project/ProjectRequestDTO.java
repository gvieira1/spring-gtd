package com.model.dto.project;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectRequestDTO {
    @NotBlank
    private String description;
    
    private Long userId;
}
