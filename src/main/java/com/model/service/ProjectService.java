package com.model.service;

import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.exception.ResourceNotFoundException;
import com.model.entity.Project;
import com.model.entity.Task;
import com.repository.ProjectRepository;
import com.repository.TaskRepository;

@Service
public class ProjectService {

	private final ProjectRepository projectRepository;
	private final TaskRepository taskRepository;

	public ProjectService(ProjectRepository projectRepository, TaskRepository taskRepository) {
		this.projectRepository = projectRepository;
		this.taskRepository = taskRepository;
	}


	public Page<Project> getAllProjects(Pageable pageable){
		return projectRepository.findAll(pageable);
	}
	
	public Page<Task> getTasksByProject(Long id, Pageable pageable) {
	    return taskRepository.findByProjectId(id, pageable);
	}
	
	public Project getProjectById(Long id) {
	    return projectRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));
	}
	
	public Project createProject(Project project) {
	    return projectRepository.save(project);
	}
	
	public Task addTaskToProject(Long id, Task task) {
	    Project project = projectRepository.findById(id)
	    		.orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));
	    
	    task.setProject(project);
	    return taskRepository.save(task);
	}
	
	public Project updateProject(Long id, Project updatedProject) {
	    Project existing = projectRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));
	    
	    existing.setDescription(updatedProject.getDescription());
	    updateProjectStatus(existing);
	    return projectRepository.save(existing);
	}
	
	public void deleteProject(Long id) {		
		Project existing = projectRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));
	    projectRepository.delete(existing);
	}

	public void updateProjectStatus(Project project) {
	    List<Task> tasks = taskRepository.findByProjectId(project.getId());

	    boolean allDone = !tasks.isEmpty() && tasks.stream()
	        .allMatch(Task::getDone);

	    if (!Objects.equals(project.getDone(), allDone)) {
	        project.setDone(allDone);
	        projectRepository.save(project);
	    }
	}

}
