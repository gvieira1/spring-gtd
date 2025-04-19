package com.model.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.exception.ResourceNotFoundException;
import com.model.dto.GroupedTasksResponseDTO;
import com.model.dto.TaskRequestDTO;
import com.model.dto.TaskResponseDTO;
import com.model.entity.CategoryEntity;
import com.model.entity.Project;
import com.model.entity.Task;
import com.repository.TaskRepository;

@Service
public class TaskService {

	private final TaskRepository taskRepository;
	private final CategoryEntity category;
	private final ProjectService projectService;
	private final ModelMapper modelMapper;
	
	public TaskService(TaskRepository taskRepository, CategoryEntity category, ProjectService projectService, ModelMapper modelMapper) {
		this.taskRepository = taskRepository;
		this.category = category;
		this.projectService = projectService;
		this.modelMapper = modelMapper;
	}
	

	public Page<TaskResponseDTO> getFilteredTasks(Boolean withoutProject, Pageable pageable) {
		Page<Task> tasks = Boolean.TRUE.equals(withoutProject) ? taskRepository.findByProjectIsNull(pageable)
				: taskRepository.findAll(pageable);

		return tasks.map(this::toDTO);
	}

	public TaskResponseDTO save(TaskRequestDTO dto) {
		Task task = toEntity(dto);
		Task saved = taskRepository.save(task);

		if (saved.getProject() != null) {
			projectService.updateProjectStatus(saved.getProject());
		}

		return toDTO(saved);
	}

	public TaskResponseDTO getTaskById(Long id) {
		Task task = taskRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada: " + id));
		return toDTO(task);
	}

	public TaskResponseDTO updateTask(Long id, TaskRequestDTO updatedDTO) {
		Task existingTask = taskRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada: " + id));

		if (updatedDTO.getDescription() != null) {
			existingTask.setDescription(updatedDTO.getDescription());
		}

		if (updatedDTO.getDelegated() != null) {
			existingTask.setDelegated(updatedDTO.getDelegated());
		}

		if (updatedDTO.getPriority() != null) {
			existingTask.setPriority(updatedDTO.getPriority());
		}

		if (updatedDTO.getDeadline() != null) {
			existingTask.setDeadline(updatedDTO.getDeadline());
		}

		//getDone só pode ser definido por método específico, que deve chegar aqui já ok
		if (existingTask.getDone() == null || !existingTask.getDone()) {
			defineCategory(existingTask);
		}
		
		Task saved = taskRepository.save(existingTask);

	    if (saved.getProject() != null) {
	        projectService.updateProjectStatus(saved.getProject());
	    }

	    return toDTO(saved);
	}

	private void defineCategory(Task task) {
		category.setId(5L);

		if (Boolean.TRUE.equals(task.getDelegated())) {
			category.setId(4L);
		} else if (Boolean.TRUE.equals(task.getPriority())) {
			category.setId(1L);
		} else if (task.getDeadline() != null) {
			category.setId(2L);
		}

		task.setCategory(category);
	}

	public void deleteTask(Long id) {
		Task task = taskRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + id));
		Project project = task.getProject();

		taskRepository.delete(task);

		if (project != null) {
			projectService.updateProjectStatus(project);
		}
	}

	public GroupedTasksResponseDTO getTasksGroupedByCategory(Long userId, Pageable pageable) {
	    Page<Task> tasksPage = taskRepository.findByUserIdOrderByCategoryName(userId, pageable);

	    Map<String, List<TaskResponseDTO>> groupedTasks = tasksPage
	    															.getContent()
	    															.stream()
	    															.map(task -> modelMapper.map(task, TaskResponseDTO.class)) 
	    															.collect(Collectors.groupingBy(taskDTO -> taskDTO.getCategory().getName()));

	    GroupedTasksResponseDTO response = new GroupedTasksResponseDTO();
	    response.setTasksByCategory(groupedTasks);
	    response.setCurrentPage(tasksPage.getNumber());
	    response.setTotalPages(tasksPage.getTotalPages());
	    response.setTotalElements(tasksPage.getTotalElements());
	    response.setSize(tasksPage.getSize());

	    return response;
	}

	
	public TaskResponseDTO removeProjectFromTask(Long taskId) {
	    Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + taskId));

	    Project previousProject = task.getProject();
	    task.setProject(null); 

	    Task saved = taskRepository.save(task);
	    if (previousProject != null) {
	        projectService.updateProjectStatus(previousProject);
	    }

	    return toDTO(saved);
	}

	public TaskResponseDTO markAsCompleted(Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + taskId));

		if (Boolean.TRUE.equals(task.getDone())) {
			return toDTO(task);
		}

		task.setDone(true);
		Task saved = taskRepository.save(task);

		if (task.getProject() != null) {
			projectService.updateProjectStatus(task.getProject());
		}

		return toDTO(saved);
	}
	
    public TaskResponseDTO toDTO(Task task) {
        return modelMapper.map(task, TaskResponseDTO.class);
    }

    public Task toEntity(TaskRequestDTO taskRequestDTO) {
        return modelMapper.map(taskRequestDTO, Task.class);
    }

}
