package com.model.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class GroupedTasksResponseDTO {
    private Map<String, List<TaskResponseDTO>> tasksByCategory;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int size;
}
