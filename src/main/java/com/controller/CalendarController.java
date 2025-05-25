package com.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.dto.CalendarEventDTO;
import com.model.dto.task.TaskResponseDTO;
import com.model.service.CalendarService;
import com.model.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {
	
	private final TaskService taskService;
	private final CalendarService calendarService;
	
	public CalendarController(TaskService taskService, CalendarService calendarService) {
		this.taskService = taskService;
		this.calendarService = calendarService;
	}

	@Operation(summary = "Fetch the task list to populate the calendar")
			@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Fetched list"),
			@ApiResponse(responseCode = "403", description = "Access denied", content = @Content) })
	@GetMapping
	public ResponseEntity<List<CalendarEventDTO>> getCalendarTasks() {
	    List<TaskResponseDTO> allTasks = taskService.getTasksByUserId(); 
	    List<CalendarEventDTO> calendarEvents = calendarService.getCalendarEvents(allTasks);
	    return ResponseEntity.ok(calendarEvents);
	}
	
	
}
