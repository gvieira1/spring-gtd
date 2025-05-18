package com.model.dto;

import java.util.Map;

public record WeeklyReportDTO(
	    int totalTasks,
	    double dailyAverage,
	    Map<String, Long> tasksBySubject,
	    Map<Boolean, Long> tasksByPriority,
	    Map<String, Long> tasksByEstimatedTime,
	    Map<String, Long> tasksCompletedByDay
	) {}