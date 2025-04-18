package com.controller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.entity.Project;
import com.model.entity.Task;
import com.model.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/project")
@Validated
public class ProjectController {

	private final ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@Operation(summary = "Get all projects")
	@GetMapping
	public ResponseEntity<Page<Project>> GetAllProjects(Pageable pageable) {
		return ResponseEntity.ok(projectService.getAllProjects(pageable));
	}
	
	@Operation(summary = "List all tasks by their Project")
	@GetMapping("/{id}/tasks")
	public ResponseEntity<Page<Task>> getTasksByProject(@PathVariable Long id, Pageable pageable) {
		return ResponseEntity.ok(projectService.getTasksByProject(id, pageable));
	}

	@Operation(summary = "Get the project by its ID")
	@GetMapping("/{id}")
	public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
		return ResponseEntity.ok(projectService.getProjectById(id));
	}
	
	@Operation(summary = "Create a new Project")
	@PostMapping
	public ResponseEntity<Project> createProject(@RequestBody Project project) {
		return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(project));
	}
	
	@Operation(summary = "Add Task to a Project")
	@PostMapping("/{id}/tasks")
	public ResponseEntity<Task> addTaskToProject(@PathVariable Long id, @RequestBody Task task) {
		return ResponseEntity.status(HttpStatus.CREATED).body(projectService.addTaskToProject(id, task));
	}

	@Operation(summary = "Update a Project")
	@PutMapping("/{id}")
	public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
		return ResponseEntity.ok(projectService.updateProject(id, updatedProject));
	}
	
	@Operation(summary = "Delete a project with its tasks")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		projectService.deleteProject(id);
		return ResponseEntity.noContent().build();
	}

}
