package com.model.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.model.dto.TaskNotificationDTO;
import com.model.entity.Task;
import com.model.entity.User;
import com.repository.TaskRepository;

@Service
public class NotificationService {

    private final TaskRepository taskRepository;

    public NotificationService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskNotificationDTO> getUpcomingTasks(User user) {
        LocalDate now = LocalDate.now();
        List<Task> tasks = taskRepository.findAllByUserAndDeadlineIsNotNull(user);

        Integer userDefaultNotificationDays = user.getNotificationDaysBeforeDefault();

        if (userDefaultNotificationDays == null) {
            return Collections.emptyList(); 
        }

        return tasks.stream()
            .filter(task -> {
                if (task.getDeadline() == null) return false;
                long daysLeft = ChronoUnit.DAYS.between(now, task.getDeadline());
                return daysLeft == userDefaultNotificationDays;
            })
            .map(task -> new TaskNotificationDTO(task.getId(), task.getDescription(), task.getDeadline()))
            .collect(Collectors.toList());
    }
}