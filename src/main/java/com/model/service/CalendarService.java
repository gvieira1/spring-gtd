package com.model.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.model.dto.CalendarEventDTO;
import com.model.dto.TaskResponseDTO;

@Service
public class CalendarService {
	
	public List<CalendarEventDTO> getCalendarEvents(List<TaskResponseDTO> tasks) {
	    return tasks.stream()
	        .filter(task -> task.getDeadline() != null) 
	        .map(this::convertToCalendarEvent)
	        .collect(Collectors.toList());
	}

	private CalendarEventDTO convertToCalendarEvent(TaskResponseDTO task) {
	    CalendarEventDTO event = new CalendarEventDTO();
	    event.setId(task.getId().toString());
	    event.setCalendarId("2"); 
	    event.setTitle(task.getDescription());

	    event.setCategory("allday"); 
	    
	    LocalDate deadline = task.getDeadline();
	    LocalDateTime start = deadline.atStartOfDay();
	    LocalDateTime end = start.plusHours(1); 

	    event.setStart(start.toString()); 
	    event.setEnd(end.toString());

	    return event;
	}
	
}
