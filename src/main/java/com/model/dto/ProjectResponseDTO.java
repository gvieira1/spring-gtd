package com.model.dto;

import java.util.List;

import lombok.Data;

@Data
public class ProjectResponseDTO {
    private Long id;
    private String description;
    private Boolean done;
    private SimpleUserDTO user;
    private List<TaskSummaryDTO> tasks;
}
