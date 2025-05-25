package com.model.service;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.exception.ResourceNotFoundException;
import com.model.dto.project.ProjectRequestDTO;
import com.model.dto.project.ProjectResponseDTO;
import com.model.dto.task.TaskRequestDTO;
import com.model.dto.task.TaskResponseDTO;
import com.model.entity.CategoryEntity;
import com.model.entity.EstimatedTime;
import com.model.entity.Project;
import com.model.entity.Task;
import com.model.entity.User;
import com.model.mapper.TaskMapper;
import com.repository.ProjectRepository;
import com.repository.TaskRepository;

@Service
public class ProjectService {

	private final TaskMapper taskMapper;
	private final ProjectRepository projectRepository;
	private final TaskRepository taskRepository;
	private final ModelMapper modelMapper;
	private final UserService userService;

	public ProjectService(ProjectRepository projectRepository, TaskRepository taskRepository, ModelMapper modelMapper, UserService userService, TaskMapper taskMapper) {
		this.projectRepository = projectRepository;
		this.taskRepository = taskRepository;
		this.modelMapper = modelMapper;
		this.userService = userService;
		this.taskMapper = taskMapper;
	}


	public Page<ProjectResponseDTO> getAllProjects(Pageable pageable){
		User user = userService.getAuthenticatedUser();
		return projectRepository.findByUserId(user.getId(), pageable).map(this::toDTO);
	}
	
	
	public Page<TaskResponseDTO> getTasksByProject(Long projectId, Pageable pageable) {
		User user = userService.getAuthenticatedUser();	
	    Page<Task> taskPage = taskRepository.findByUserIdAndProjectId(user.getId(), projectId, pageable);

	    List<TaskResponseDTO> taskResponseDTOs = taskPage.getContent().stream()
	    	.map(taskMapper::toDTO)
	        .collect(Collectors.toList());
	    
	    return new PageImpl<>(taskResponseDTOs, pageable, taskPage.getTotalElements());
	}
	
	public ProjectResponseDTO getProjectById(Long id) {
		User user = userService.getAuthenticatedUser();	
	    Project project =  projectRepository.findByUserIdAndId(user.getId(), id)
	            .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));
	    
	    return toDTO(project);
	}
	
	public ProjectResponseDTO createProject(ProjectRequestDTO projectDTO, Principal principal) {
		
		User user = userService.getAuthenticatedUser();
		
		Project project = toEntity(projectDTO);
		project.setUser(user);
		project.setDone(false);
		Project savedProject = projectRepository.save(project);
	    return toDTO(savedProject);
	}
	
	public TaskResponseDTO addTaskToProject(Long idProject, TaskRequestDTO taskDTO) {
		User user = userService.getAuthenticatedUser();	
	    Project project =  projectRepository.findByUserIdAndId(user.getId(), idProject)
	    		.orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + idProject));
	    CategoryEntity category = new CategoryEntity();
	    category.setId(6L);
	    EstimatedTime estTime = new EstimatedTime();
		estTime.setId(9L);
	    Task task = modelMapper.map(taskDTO, Task.class);
	    task.setProject(project);
	    task.setCategory(category);
	    task.setUser(user);
	    task.setEstimatedTime(estTime);
		Task saved = taskRepository.save(task);
		
		if (project.getDone()) {
			reopenProject(project);
		}

		return modelMapper.map(saved, TaskResponseDTO.class);
	}
	
	public TaskResponseDTO addExistingTaskToProject(Long projectId, Long taskId) {
		User user = userService.getAuthenticatedUser();	
	    Project project =  projectRepository.findByUserIdAndId(user.getId(), projectId)
	    		.orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + projectId));
		
		Task existingTask = taskRepository.findByUserIdAndId(user.getId(),taskId)
				.orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada: " + taskId));
		
		existingTask.setProject(project);
		taskRepository.save(existingTask);
		return modelMapper.map(existingTask, TaskResponseDTO.class);
		
	}
	
	public ProjectResponseDTO updateProject(Long id, ProjectRequestDTO updatedProjectDTO) {
		User user = userService.getAuthenticatedUser();	
	    Project existing =  projectRepository.findByUserIdAndId(user.getId(), id)
	            .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));
	    
	    existing.setDescription(updatedProjectDTO.getDescription());
	    updateProjectStatus(existing);
	    Project savedProject = projectRepository.save(existing);
	    return toDTO(savedProject);
	}
	
	public void deleteProject(Long id) {		
		User user = userService.getAuthenticatedUser();	
	    Project existing =  projectRepository.findByUserIdAndId(user.getId(), id)
	            .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));
	    projectRepository.delete(existing);
	}

	public void updateProjectStatus(Project project) {
		
	    List<Task> tasks = taskRepository.findByProjectId(project.getId());
	    boolean allDone = !tasks.isEmpty() && tasks.stream().allMatch(Task::getDone);

	    if (!Objects.equals(project.getDone(), allDone)) {
	        project.setDone(allDone);
	        projectRepository.save(project);
	    }
	}
	
	public void reopenProject(Project project) {
	    if (project.getDone()) {
	        project.setDone(false);
	        projectRepository.save(project);
	    }
	}

	
	public Project toEntity(ProjectRequestDTO dto) {
        return modelMapper.map(dto, Project.class);
    }

    public ProjectResponseDTO toDTO(Project project) {
    	return  modelMapper.map(project, ProjectResponseDTO.class);
    }

}
