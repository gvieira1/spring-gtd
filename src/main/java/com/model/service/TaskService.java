package com.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.exception.ResourceNotFoundException;
import com.model.entity.CategoryEntity;
import com.model.entity.Project;
import com.model.entity.Task;
import com.repository.TaskRepository;

@Service
public class TaskService {

	private final TaskRepository taskRepository;
	private final CategoryEntity category;
	private final ProjectService projectService;

	public TaskService(TaskRepository taskRepository, CategoryEntity category, ProjectService projectService) {
		this.taskRepository = taskRepository;
		this.category = category;
		this.projectService = projectService;
	}
	
	public Page<Task> getFilteredTasks(Boolean withoutProject, Pageable pageable) {
	    if (Boolean.TRUE.equals(withoutProject)) {
	        return taskRepository.findByProjectIsNull(pageable);
	    }
	    
	    return taskRepository.findAll(pageable);
	}


	public Task save(Task task) {
		Task saved = taskRepository.save(task);

		if (saved.getProject() != null) {
			projectService.updateProjectStatus(saved.getProject());
		}

		return saved;
	}

	public Task getTaskById(Long id) {
		Task task = taskRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + id));
		return task;
	}

	public Task updateTask(Long id, Task updatedTask) {
		Task existingTask = taskRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada: " + id));

		if (updatedTask.getDescription() != null) {
			existingTask.setDescription(updatedTask.getDescription());
		}

		if (updatedTask.getDone() != null) {
			existingTask.setDone(updatedTask.getDone());
		}

		if (updatedTask.getDelegated() != null) {
			existingTask.setDelegated(updatedTask.getDelegated());
		}

		if (updatedTask.getPriority() != null) {
			existingTask.setPriority(updatedTask.getPriority());
		}

		if (updatedTask.getDeadline() != null) {
			existingTask.setDeadline(updatedTask.getDeadline());
		}

		if (existingTask.getDone() == null || !existingTask.getDone()) {
			definirCategoria(existingTask);
		}
		
		Task saved = taskRepository.save(existingTask);

	    if (saved.getProject() != null) {
	        projectService.updateProjectStatus(saved.getProject());
	    }

	    return saved;
	}

	private void definirCategoria(Task task) {
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

	public Map<String, Object> getTasksGroupedByCategory(Long userId, Pageable pageable) {
		Page<Task> tasksPage = taskRepository.findByUserIdOrderByCategoryName(userId, pageable);

		Map<Object, List<Task>> groupedTasks = tasksPage.getContent().stream()
				.collect(Collectors.groupingBy(task -> task.getCategory().getName()));

		Map<String, Object> response = new HashMap<>();
		response.put("tasksByCategory", groupedTasks);
		response.put("currentPage", tasksPage.getNumber());
		response.put("totalPages", tasksPage.getTotalPages());
		response.put("totalElements", tasksPage.getTotalElements());
		response.put("size", tasksPage.getSize());

		return response;
	}
	
	public Task removeProjectFromTask(Long taskId) {
	    Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + taskId));

	    Project previousProject = task.getProject();
	    task.setProject(null); 

	    Task saved = taskRepository.save(task);
	    if (previousProject != null) {
	        projectService.updateProjectStatus(previousProject);
	    }

	    return saved;
	}

	public Task markAsCompleted(Long taskId) {
		Task task = taskRepository.findById(taskId)
				.orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + taskId));

		if (Boolean.TRUE.equals(task.getDone())) {
			return task;
		}

		task.setDone(true);
		Task saved = taskRepository.save(task);

		if (task.getProject() != null) {
			projectService.updateProjectStatus(task.getProject());
		}

		return saved;
	}

}
