package com.controller;
import java.security.Principal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

import com.model.dto.project.ProjectRequestDTO;
import com.model.dto.project.ProjectResponseDTO;
import com.model.dto.task.TaskRequestDTO;
import com.model.dto.task.TaskResponseDTO;
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
	public ResponseEntity<Page<ProjectResponseDTO>> GetAllProjects( @PageableDefault(sort = {"done"})  Pageable pageable) {
		return ResponseEntity.ok(projectService.getAllProjects(pageable));
	}
	
	@Operation(summary = "List all tasks by their Project")
	@GetMapping("/{id}/tasks")
	public ResponseEntity<Page<TaskResponseDTO>> getTasksByProject(@PathVariable Long id, @PageableDefault(sort = {"done"})  Pageable pageable) {
		return ResponseEntity.ok(projectService.getTasksByProject(id, pageable));
	}

	@Operation(summary = "Get the project by its ID")
	@GetMapping("/{id}")
	public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable Long id) {
		return ResponseEntity.ok(projectService.getProjectById(id));
	}
	
	@Operation(summary = "Create a new Project")
	@PostMapping
	public ResponseEntity<ProjectResponseDTO> createProject(@RequestBody ProjectRequestDTO projectDTO, Principal principal) {
		return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(projectDTO, principal));
	}
	
	@Operation(summary = "Add Task to a Project")
	@PostMapping("/{idProject}/tasks")
	public ResponseEntity<TaskResponseDTO> addTaskToProject(@PathVariable Long idProject, @RequestBody TaskRequestDTO taskDTO) {
		return ResponseEntity.status(HttpStatus.CREATED).body(projectService.addTaskToProject(idProject, taskDTO));
	}
	
	@Operation(summary = "Add an existing Task to a Project")
	@PutMapping("/{projectId}/tasks/{taskId}")
	public ResponseEntity<TaskResponseDTO> addExistingTaskToProject(@PathVariable Long projectId, @PathVariable Long taskId) {
		return ResponseEntity.status(HttpStatus.CREATED).body(projectService.addExistingTaskToProject(projectId, taskId));
	}

	@Operation(summary = "Update a Project")
	@PutMapping("/{id}")
	public ResponseEntity<ProjectResponseDTO> updateProject(@PathVariable Long id, @RequestBody ProjectRequestDTO updatedProjectDTO) {
		return ResponseEntity.ok(projectService.updateProject(id, updatedProjectDTO));
	}
	
	@Operation(summary = "Delete a project with its tasks")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		projectService.deleteProject(id);
		return ResponseEntity.noContent().build();
	}

}
