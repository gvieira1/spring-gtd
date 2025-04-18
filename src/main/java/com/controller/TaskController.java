package com.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.model.entity.Task;
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
	public ResponseEntity<Page<Task>> getTasks(
			@RequestParam(value = "withoutProject", required = false) Boolean withoutProject, Pageable pageable) {
		return ResponseEntity.ok(taskService.getFilteredTasks(withoutProject, pageable));
	}
    
    @Operation(summary = "Get task by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
		return ResponseEntity.ok(taskService.getTaskById(id));
	}

	@Operation(summary = "Get tasks order by category")
	@GetMapping("/grouped/{id}")
	public ResponseEntity<Map<String, Object>> getGroupedTasks(@PathVariable Long userId,
			@PageableDefault(size = 10, page = 0, sort = "category.name") Pageable pageable) {
		
		return ResponseEntity.ok(taskService.getTasksGroupedByCategory(userId, pageable));
	}

	@Operation(summary = "Create a task just with description and done")
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Task> createTaskWithDescription(@Valid @RequestBody Task task) { 
		Task savedTask = taskService.save(task);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
	}

	@Operation(summary = "Update a task")
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody Task updatedTask) {
		return ResponseEntity.ok(taskService.updateTask(id, updatedTask));      
    }
	
	@PatchMapping("/{id}/remove-project")
	public ResponseEntity<Task> removeProject(@PathVariable Long id) {
	    return ResponseEntity.ok(taskService.removeProjectFromTask(id));
	}
	
	@PatchMapping("/{id}/complete")
	public ResponseEntity<Task> markTaskAsComplete(@PathVariable Long id) {
	    return ResponseEntity.ok(taskService.markAsCompleted(id));
	}

	
	@Operation(summary = "Delete a task by its ID")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
	    taskService.deleteTask(id);
	    return ResponseEntity.noContent().build();
	}

}
