package com.model.dto.project;

import java.util.List;

import com.model.dto.task.SimpleUserDTO;
import com.model.dto.task.TaskSummaryDTO;

import lombok.Data;

@Data
public class ProjectResponseDTO {
    private Long id;
    private String description;
    private Boolean done;
    private SimpleUserDTO user;
    private List<TaskSummaryDTO> tasks;
}
