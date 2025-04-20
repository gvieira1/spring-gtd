package com.model.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.exception.ResourceNotFoundException;
import com.exception.UserNotFoundException;
import com.model.dto.ProjectRequestDTO;
import com.model.dto.ProjectResponseDTO;
import com.model.dto.SimpleUserDTO;
import com.model.dto.TaskRequestDTO;
import com.model.dto.TaskResponseDTO;
import com.model.entity.CategoryEntity;
import com.model.entity.Project;
import com.model.entity.Task;
import com.model.entity.User;
import com.repository.ProjectRepository;
import com.repository.TaskRepository;
import com.repository.UserRepository;

@Service
public class ProjectService {

	private final ProjectRepository projectRepository;
	private final TaskRepository taskRepository;
	private final ModelMapper modelMapper;
	private final UserRepository userRepository;

	public ProjectService(ProjectRepository projectRepository, TaskRepository taskRepository, ModelMapper modelMapper, UserRepository userRepository) {
		this.projectRepository = projectRepository;
		this.taskRepository = taskRepository;
		this.modelMapper = modelMapper;
		this.userRepository = userRepository;
	}


	public Page<ProjectResponseDTO> getAllProjects(Pageable pageable){
		return projectRepository.findAll(pageable).map(this::toDTO);
	}
	
	
	public Page<TaskResponseDTO> getTasksByProject(Long id, Pageable pageable) {
		
	    Page<Task> taskPage = taskRepository.findByProjectId(id, pageable);

	    List<TaskResponseDTO> taskResponseDTOs = taskPage.getContent().stream()
	        .map(task -> modelMapper.map(task, TaskResponseDTO.class)) 
	        .collect(Collectors.toList());
	    
	    return new PageImpl<>(taskResponseDTOs, pageable, taskPage.getTotalElements());
	}
	
	public ProjectResponseDTO getProjectById(Long id) {
	    Project project =  projectRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));
	    
	    return toDTO(project);
	}
	
	public ProjectResponseDTO createProject(ProjectRequestDTO projectDTO) {
		Project project = toEntity(projectDTO);
		project.setDone(false);
		Project savedProject = projectRepository.save(project);
	    return toDTO(savedProject);
	}
	
	public TaskResponseDTO addTaskToProject(Long idProject, TaskRequestDTO taskDTO) {
	    Project project = projectRepository.findById(idProject)
	    		.orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + idProject));
	    CategoryEntity category = new CategoryEntity();
	    category.setId(3L);
	    Task task = modelMapper.map(taskDTO, Task.class);
	    task.setProject(project);
	    task.setCategory(category);
		Task saved = taskRepository.save(task);

		return modelMapper.map(saved, TaskResponseDTO.class);
	}
	
	public TaskResponseDTO addExistingTaskToProject(Long projectId, Long taskId) {
		Project project = projectRepository.findById(projectId)
	    		.orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + projectId));
		
		Task existingTask = taskRepository.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada: " + taskId));
		
		existingTask.setProject(project);
		taskRepository.save(existingTask);
		return modelMapper.map(existingTask, TaskResponseDTO.class);
		
	}
	
	public ProjectResponseDTO updateProject(Long id, ProjectRequestDTO updatedProjectDTO) {
	    Project existing = projectRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado: " + id));
	    
	    existing.setDescription(updatedProjectDTO.getDescription());
	    updateProjectStatus(existing);
	    Project savedProject = projectRepository.save(existing);
	    return toDTO(savedProject);
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
	
	public Project toEntity(ProjectRequestDTO dto) {
        return modelMapper.map(dto, Project.class);
    }

    public ProjectResponseDTO toDTO(Project project) {
    	ProjectResponseDTO responseDTO =  modelMapper.map(project, ProjectResponseDTO.class);
    	User user = userRepository.findById(project.getUser().getId())
    			.orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));
    	
    	SimpleUserDTO userDTO = responseDTO.getUser();
    	userDTO.setName(user.getName());
    	
    	return responseDTO;
    }

}
