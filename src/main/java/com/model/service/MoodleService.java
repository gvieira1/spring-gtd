package com.model.service;

import java.time.Duration;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.exception.UserNotFoundException;
import com.fasterxml.jackson.databind.JsonNode;
import com.model.dto.moodle.ActivityStatusDTO;
import com.model.dto.moodle.CompletionStatusResponse;
import com.model.dto.moodle.CourseDTO;
import com.model.dto.task.TaskResponseDTO;
import com.model.entity.Task;
import com.model.entity.User;
import com.model.mapper.TaskMapper;

import io.netty.handler.timeout.TimeoutException;
import reactor.core.publisher.Mono;

@Service
public class MoodleService {

    private final WebClient moodleWebClient;  
    private final TaskService taskService;
    private final TaskMapper taskMapper;
    

    public MoodleService(WebClient moodleWebClient, TaskService taskService, TaskMapper taskMapper) {
		this.moodleWebClient = moodleWebClient;
		this.taskService = taskService;
		this.taskMapper = taskMapper;
	}

	@Value("${moodle.token}") 
    private String token;
	
	public Mono<Long> findMoodleUserIdByEmail(String email) {
        return moodleWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("wstoken", token)
                        .queryParam("wsfunction", "core_user_get_users_by_field")
                        .queryParam("moodlewsrestformat", "json")
                        .queryParam("field", "email")
                        .queryParam("values[0]", email)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .timeout(Duration.ofSeconds(10)) 
                .onErrorMap(WebClientResponseException.class, ex -> {
                    return new RuntimeException("Erro na requisição ao Moodle: " + ex.getMessage());
                })
                .onErrorMap(TimeoutException.class, ex -> {
                    return new RuntimeException("Tempo limite de resposta excedido ao buscar usuário: " + ex.getMessage());
                })
                .map(json -> {
                	System.out.println("Resposta JSON: " + json.toString());
                	if (json != null && json.isArray() && json.size() > 0) {
                	    JsonNode user = json.get(0);  
                	    if (user.has("id")) {
                	        return user.get("id").asLong();  
                	    } else {
                	        throw new UserNotFoundException("Usuário não encontrado no Moodle com o email: " + email);
                	    }
                	} else {
                	    throw new UserNotFoundException("Usuário não encontrado no Moodle com o email/: " + email);
                	}

                })
                .onErrorResume(ex -> {
                    return Mono.error(ex); 
                });
    }
	

    public List<CourseDTO> getCoursesForUser(Long moodleUserId) {
        return moodleWebClient.get()
            .uri(uriBuilder -> uriBuilder
                .queryParam("wstoken", token)
                .queryParam("wsfunction", "core_enrol_get_users_courses")
                .queryParam("userid", moodleUserId)
                .queryParam("moodlewsrestformat", "json")
                .build())
            .retrieve()
            .bodyToFlux(CourseDTO.class)
            .collectList()
            .block();
    }

    public List<ActivityStatusDTO> getActivities(Long userId, Long courseId) {
        CompletionStatusResponse response = moodleWebClient.get()
            .uri(uriBuilder -> uriBuilder
                .queryParam("wstoken", token)
                .queryParam("wsfunction", "core_completion_get_activities_completion_status")
                .queryParam("userid", userId)
                .queryParam("courseid", courseId)
                .queryParam("moodlewsrestformat", "json")
                .build())
            .retrieve()
            .bodyToMono(CompletionStatusResponse.class)
            .block();

        return response.getStatuses().stream()
            .collect(Collectors.toList());
    }
    

    public Page<TaskResponseDTO> syncPendingTasksFromMoodle(User user, Pageable pageable) {
        List<CourseDTO> courses = this.getCoursesForUser(user.getMoodleUserId());

        List<TaskResponseDTO> allTasks = courses.stream().flatMap(course -> {
            List<ActivityStatusDTO> activities = this.getActivities(user.getMoodleUserId(), course.getId());

            return activities.stream().map(activity -> {
                Optional<Task> existingTaskOpt = taskService.findByUserAndMoodleInfo(user.getId(), course.getId(),
                        activity.getCmid());

                boolean isCompletedInMoodle = activity.getState() == 1;

                if (existingTaskOpt.isPresent()) {
                    Task task = existingTaskOpt.get();

                    if (isCompletedInMoodle && !Boolean.TRUE.equals(task.getDone())) {
                        taskService.markAsCompleted(task.getId());
                    }

                    return taskMapper.toDTO(task);

                } else if (!isCompletedInMoodle) {
                    return taskService.createTaskFromMoodleActivity(user, course, activity);
                }

                return null;
            }).filter(Objects::nonNull);
        }).toList();

        int total = allTasks.size();
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), total);
        List<TaskResponseDTO> paginatedList = allTasks.subList(start, end);

        return new PageImpl<>(paginatedList, pageable, total);
    }
 
}