package com.model.dto.task;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequestDTO {
	
    @NotBlank
    private String description;
    
    private Boolean priority;
    
    @FutureOrPresent
    private LocalDate deadline;
    private Long estimatedTimeId;
    private String subject;
    private Boolean delegated;
    private Long userId;
    private Long categoryId;
    private Long projectId;
    private List<Long> contextIds;

}
