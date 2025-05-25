package com.model.dto.task;
import java.time.LocalDate;
import java.util.List;

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
    
    private List<ContextDTO> contexts;
    private EstimatedTimeDTO estimatedTime;
    private SimpleUserDTO user;
    private SimpleCategoryDTO category;
    private SimpleProjectDTO project;
}
