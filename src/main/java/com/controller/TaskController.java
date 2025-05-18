package com.controller;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.model.dto.GroupedTasksResponseDTO;
import com.model.dto.TaskRequestDTO;
import com.model.dto.TaskResponseDTO;
import com.model.dto.WeeklyReportDTO;
import com.model.entity.User;
import com.model.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
@Validated
public class TaskController {
    
	private final TaskService taskService;
	
    public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}

	@Operation(summary = "Get tasks accepting a filter")
    @GetMapping
	public ResponseEntity<Page<TaskResponseDTO>> getTasks(
			@RequestParam(value = "withoutProjects", required = false) Boolean withoutProject,
			@RequestParam(value = "category", required = false) String category,
			Pageable pageable) {
		return ResponseEntity.ok(taskService.getFilteredTasks(withoutProject, category, pageable));
	}
    
    @Operation(summary = "Get task by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id) {
		return ResponseEntity.ok(taskService.getTaskById(id));
	}

	@Operation(summary = "Get tasks order by category")
	@GetMapping("/grouped")
	public ResponseEntity<GroupedTasksResponseDTO> getGroupedTasks(@PageableDefault(size = 10, page = 0, sort = "category.name") Pageable pageable) {
		
		return ResponseEntity.ok(taskService.getTasksGroupedByCategory(pageable));
	}
	
	@Operation(summary = "Get tasks Weekly Report")
	@GetMapping("/weekly-report")
	public ResponseEntity<WeeklyReportDTO> getWeeklyReport(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(taskService.generateWeeklyReport(user));
	}
	
	@Operation(summary = "Get distinct subjects from tasks")
	@GetMapping("/subjects")
	public ResponseEntity<List<String>> getSubjects() {
	    List<String> subjects = taskService.returnDistinctSubjects();
	    return ResponseEntity.ok(subjects);
	}
	
	@Operation(summary = "Get tasks by context")
	@GetMapping("/by-contexts")
	public ResponseEntity<List<TaskResponseDTO>> findByContexts(@RequestParam List<Long> contextIds) {
	    List<TaskResponseDTO> dtos = taskService.findDTOsByUserAndContexts(contextIds);
	    return ResponseEntity.ok(dtos);
	}

	@Operation(summary = "Create a task just with description")
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<TaskResponseDTO> createTaskWithDescription(@Valid @RequestBody TaskRequestDTO dto) { 
		TaskResponseDTO savedTask = taskService.save(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
	}

	@Operation(summary = "Update a task")
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequestDTO updatedDTO) {
		return ResponseEntity.ok(taskService.updateTask(id, updatedDTO));      
    }
	
	@Operation(summary = "Remove Project from Task")
	@PatchMapping("/{id}/remove-project")
	public ResponseEntity<TaskResponseDTO> removeProject(@PathVariable Long id) {
	    return ResponseEntity.ok(taskService.removeProjectFromTask(id));
	}
	
	@Operation(summary = "Mark Task as complete")
	@PatchMapping("/{id}/complete")
	public ResponseEntity<TaskResponseDTO> markTaskAsComplete(@PathVariable Long id) {
	    return ResponseEntity.ok(taskService.markAsCompleted(id));
	}
	
	@Operation(summary = "Reopen a task")
	@PutMapping("/{id}/reopen")
	public ResponseEntity<Void> reopenTask(@PathVariable Long id) {
	    taskService.reopenTask(id);
	    return ResponseEntity.noContent().build();
	}
	
	@Operation(summary = "Delete a task by its ID")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
	    taskService.deleteTask(id);
	    return ResponseEntity.noContent().build();
	}


}
