package com.model.dto;
import java.time.LocalDate;

import lombok.Data;

@Data
public class TaskResponseDTO {
    private Long id;
    private String description;
    private Boolean priority;
    private LocalDate deadline;
    private String subject;
    private Boolean done;
    private Boolean delegated;

    private SimpleUserDTO user;
    private SimpleCategoryDTO category;
    private SimpleProjectDTO project;
}
