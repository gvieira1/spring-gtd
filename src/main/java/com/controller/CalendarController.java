package com.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.dto.CalendarEventDTO;
import com.model.dto.TaskResponseDTO;
import com.model.service.CalendarService;
import com.model.service.TaskService;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {
	
	private final TaskService taskService;
	private final CalendarService calendarService;
	
	public CalendarController(TaskService taskService, CalendarService calendarService) {
		this.taskService = taskService;
		this.calendarService = calendarService;
	}


	@GetMapping
	public ResponseEntity<List<CalendarEventDTO>> getCalendarTasks() {
	    List<TaskResponseDTO> allTasks = taskService.getTasksByUserId(); 
	    List<CalendarEventDTO> calendarEvents = calendarService.getCalendarEvents(allTasks);
	    return ResponseEntity.ok(calendarEvents);
	}
	
	
}
