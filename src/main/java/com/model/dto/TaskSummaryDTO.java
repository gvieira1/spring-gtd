package com.model.dto;

import lombok.Data;

@Data
public class TaskSummaryDTO {
    private Long id;
    private String description;
    private Boolean done;
}
