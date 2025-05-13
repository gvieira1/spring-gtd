package com.model.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.exception.ResourceNotFoundException;
import com.model.dto.ActivityStatusDTO;
import com.model.dto.CourseDTO;
import com.model.dto.GroupedTasksResponseDTO;
import com.model.dto.TaskRequestDTO;
import com.model.dto.TaskResponseDTO;
import com.model.dto.WeeklyReportDTO;
import com.model.entity.CategoryEntity;
import com.model.entity.Context;
import com.model.entity.EstimatedTime;
import com.model.entity.Project;
import com.model.entity.Task;
import com.model.entity.User;
import com.model.mapper.TaskMapper;
import com.repository.ContextRepository;
import com.repository.TaskRepository;
@Service
public class TaskService {

	private final TaskRepository taskRepository;
	private final ProjectService projectService;
	private final UserService userService;
	private final TaskMapper taskMapper;
	private final ContextRepository contextRepository;
	
	public TaskService(TaskRepository taskRepository, ProjectService projectService, UserService userService, TaskMapper taskMapper, ContextRepository contextRepository) {
		this.taskRepository = taskRepository;
		this.projectService = projectService;
		this.userService = userService;
		this.taskMapper = taskMapper;
		this.contextRepository = contextRepository;
	}

	public Page<TaskResponseDTO> getFilteredTasks(Boolean withoutProject, String category, Pageable pageable) {
		User user = userService.getAuthenticatedUser();	

		Page<Task> tasks;
		if (Boolean.TRUE.equals(withoutProject)) {
		    tasks = taskRepository.findByUserIdAndProjectIsNull(user.getId(), pageable);
		} else {
		    if (category != null && !category.isEmpty()) {
		        tasks = taskRepository.findByUserIdAndCategory_Name(user.getId(), category, pageable);
		    } else {
		        tasks = taskRepository.findByUserId(user.getId(), pageable); 
		    }
		}
		
		return tasks.map(taskMapper::toDTO);
	}

	public List<TaskResponseDTO> getTasksByUserId(){
		User user = userService.getAuthenticatedUser();	
		List<Task> tasks = taskRepository.findByUserId(user.getId());
		return tasks.stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
	}

	
	public TaskResponseDTO save(TaskRequestDTO dto) {
		
		CategoryEntity category = new CategoryEntity();
		category.setId(6L);
		
		EstimatedTime estTime = new EstimatedTime();
		estTime.setId(9L);
	
		User user = userService.getAuthenticatedUser();	

		Task task = taskMapper.toEntity(dto);
		task.setCategory(category);
		task.setUser(user);
		task.setEstimatedTime(estTime);
		task.setPriority(dto.getPriority() != null ? dto.getPriority() : false);
		Task saved = taskRepository.save(task);

		if (saved.getProject() != null) {
			projectService.updateProjectStatus(saved.getProject());
		}

		return taskMapper.toDTO(saved);
	}

	public TaskResponseDTO getTaskById(Long id) {
		User user = userService.getAuthenticatedUser();	
		Task task = taskRepository.findByUserIdAndId(user.getId(), id)
				.orElseThrow(() -> new ResourceNotFoundException("Tarefa não encontrada: " + id));
		return taskMapper.toDTO(task);
	}

	public TaskResponseDTO updateTask(Long id, TaskRequestDTO updatedDTO) {
		User user = userService.getAuthenticatedUser();	
		Task existingTask = taskRepository.findByUserIdAndId(user.getId(), id)
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

		existingTask.setDeadline(updatedDTO.getDeadline());
		

		if (updatedDTO.getSubject() != null) {
			existingTask.setSubject(updatedDTO.getSubject());
		}
		
		if (updatedDTO.getEstimatedTimeId() != null) {
			EstimatedTime estTime = new EstimatedTime();
			estTime.setId(updatedDTO.getEstimatedTimeId());
			existingTask.setEstimatedTime(estTime);
		}
		
		if (updatedDTO.getProjectId() != null) {
			projectService.addExistingTaskToProject(updatedDTO.getProjectId(), id);
		}
		
		if (updatedDTO.getContextIds() != null) {
			List<Context> contexts = contextRepository.findAllById(updatedDTO.getContextIds());
			existingTask.setContexts(contexts);
		}
		
		
		//getDone só pode ser definido por método específico, que deve chegar aqui já ok
		if (existingTask.getDone() == null || !existingTask.getDone()) {
			defineCategory(existingTask);
		}
		
		Task saved = taskRepository.save(existingTask);

	    if (saved.getProject() != null) {
	        projectService.updateProjectStatus(saved.getProject());
	    }

	    return taskMapper.toDTO(saved);
	}

	private void defineCategory(Task task) {
		CategoryEntity category = new CategoryEntity();

		if (Boolean.TRUE.equals(task.getDelegated())) {
			category.setId(4L);
		} else if (Boolean.TRUE.equals(task.getPriority())) {
			category.setId(1L);
		} else if (task.getDeadline() != null) {
			category.setId(2L);
		}else {
			category.setId(5L);
		}

		task.setCategory(category);
	}

	public void deleteTask(Long id) {
		User user = userService.getAuthenticatedUser();	
		Task task = taskRepository.findByUserIdAndId(user.getId(), id)
				.orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + id));
		Project project = task.getProject();

		taskRepository.delete(task);

		if (project != null) {
			projectService.updateProjectStatus(project);
		}
	}

	public GroupedTasksResponseDTO getTasksGroupedByCategory(Pageable pageable) {
		User user = userService.getAuthenticatedUser();	
	    Page<Task> tasksPage = taskRepository.findByUserIdOrderByCategoryName(user.getId(), pageable);

	    Map<String, List<TaskResponseDTO>> groupedTasks = tasksPage
	    															.getContent()
	    															.stream()
	    															.map(taskMapper::toDTO) 
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
		User user = userService.getAuthenticatedUser();	
		Task task = taskRepository.findByUserIdAndId(user.getId(), taskId)
				.orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + taskId));

	    Project previousProject = task.getProject();
	    task.setProject(null); 

	    Task saved = taskRepository.save(task);
	    if (previousProject != null) {
	        projectService.updateProjectStatus(previousProject);
	    }

	    return taskMapper.toDTO(saved);
	}

	public TaskResponseDTO markAsCompleted(Long taskId) {
		User user = userService.getAuthenticatedUser();	
		Task task = taskRepository.findByUserIdAndId(user.getId(), taskId)
				.orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + taskId));

		if (Boolean.TRUE.equals(task.getDone())) {
			return taskMapper.toDTO(task);
		}

		task.setDone(true);
		task.setCompletionDate(LocalDateTime.now());
		Task saved = taskRepository.save(task);	
		
		if (task.getProject() != null) {
			projectService.updateProjectStatus(task.getProject());
		}

		return taskMapper.toDTO(saved);
	}
	
	public void reopenTask(Long taskId) {
		User user = userService.getAuthenticatedUser();	
	    Task task = taskRepository.findByUserIdAndId(user.getId(), taskId)
	        .orElseThrow(() -> new ResourceNotFoundException("task não encontrada: " + taskId));

	    task.setDone(false);
	    task.setCompletionDate(null);
	    
	    if (task.getDeadline() != null && task.getDeadline().isBefore(LocalDate.now())) {
	        task.setDeadline(null);
	    }

	    taskRepository.save(task);
	    
	    if (task.getProject() != null) {
			projectService.reopenProject(task.getProject());
		}

	}

	public TaskResponseDTO createTaskFromMoodleActivity(User user, CourseDTO course, ActivityStatusDTO activity) {
		Optional<Task> existingTask = taskRepository.findByUserIdAndMoodleCourseIdAndMoodleCmid(user.getId(), course.getId(), (long) activity.getCmid());

		if (existingTask.isPresent()) {
			return taskMapper.toDTO(existingTask.get());
		} else {
			Task task = this.toTaskFromMoodle(course, activity, user);
			taskRepository.save(task);
			return taskMapper.toDTO(task);
		}
	
	}
	
	public Task toTaskFromMoodle(CourseDTO course, ActivityStatusDTO activity, User user) {
        Task task = new Task();
        CategoryEntity category = new CategoryEntity();
        category.setId(6L);
        EstimatedTime estTime = new EstimatedTime();
		estTime.setId(9L);
	
        
        task.setDescription("Moodle: " + activity.getModname() + " no curso " + course.getFullname());
        task.setSubject(course.getFullname());
        task.setUser(user);
        task.setDone(false);
        task.setDelegated(false);
        task.setPriority(false);
        task.setDeadline(null); 
        task.setCategory(category);
        task.setEstimatedTime(estTime);
        task.setMoodleCourseId(course.getId());
        task.setMoodleCmid((long) activity.getCmid());
   
        return task;
    }
	
	public Optional<Task> findByUserAndMoodleInfo(Long userId, Long courseId, int cmid) {
	    return taskRepository.findByUserIdAndMoodleCourseIdAndMoodleCmid(userId, courseId, (long) cmid);
	}

	public WeeklyReportDTO generateWeeklyReport(User user) {
		LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
		List<Task> completedTasks = taskRepository.findAllByUserAndDoneTrueAndCompletionDateAfter(user, sevenDaysAgo);

		int totalTasks = completedTasks.size();
		double dailyAverage = totalTasks / 7.0;

		Map<String, Long> tasksBySubject = groupBySubject(completedTasks);
		Map<Boolean, Long> tasksByPriority = groupByPriority(completedTasks);
		Map<String, Long> tasksByEstimatedTime = groupByEstimatedTime(completedTasks);
		Map<String, Long> tasksCompletedByDay = groupTasksCompletedByDay(completedTasks);

		return new WeeklyReportDTO(totalTasks, dailyAverage, tasksBySubject, tasksByPriority, tasksByEstimatedTime, tasksCompletedByDay);
	}
	
	private Map<String, Long> groupBySubject(List<Task> tasks) {
	    return tasks.stream()
	        .collect(Collectors.groupingBy(
	            task -> Optional.ofNullable(task.getSubject()).orElse("Sem assunto"),
	            Collectors.counting()
	        ));
	}

	private Map<Boolean, Long> groupByPriority(List<Task> tasks) {
		return tasks.stream()
				.collect(Collectors.groupingBy(task -> Optional.ofNullable(task.getPriority()).orElse(false), Collectors.counting()));
	}

	private Map<String, Long> groupByEstimatedTime(List<Task> tasks) {
		return tasks.stream().filter(task -> task.getEstimatedTime() != null)
				.collect(Collectors.groupingBy(task -> task.getEstimatedTime().getTime(), Collectors.counting()));
	}
	
	private Map<String, Long> groupTasksCompletedByDay(List<Task> tasks) {
	    return tasks.stream()
	        .collect(Collectors.groupingBy(task -> task.getCompletionDate().toLocalDate().toString(), Collectors.counting()));
	}
	
	public List<String> returnDistinctSubjects(){
		User user = userService.getAuthenticatedUser();	
		return taskRepository.findDistinctSubjectsByUser(user);
	}

	public List<String> findDistinctContexts() {
		User user = userService.getAuthenticatedUser();	
		return taskRepository.findDistinctContextsByUser(user);
	}
	
	public List<TaskResponseDTO> findDTOsByUserAndContexts(List<Long> contextIds) {
	    User user = userService.getAuthenticatedUser();
	    if (contextIds == null || contextIds.isEmpty()) {
	        return Collections.emptyList();
	    }

	    List<Task> tasks = taskRepository.findDistinctByUserAndContextsIdIn(user, contextIds);
	    return tasks.stream()
	    		.map(taskMapper::toDTO)
	    		.toList();
	}
	


}
