package com.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.model.entity.Task;
import com.model.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long> {
	Page<Task> findByUserIdOrderByCategoryName(Long userId, Pageable pageable);
	
	Page<Task> findByUserIdAndProjectIsNull(Long userId, Pageable pageable);

	Page<Task> findByUserId(Long userId, Pageable pageable);

	Page<Task> findByUserIdAndProjectId(Long userId, Long projectId, Pageable pageable);

	List<Task> findByProjectId(Long id);
	
	List<Task> findByUserId(Long id);

	Optional<Task> findByUserIdAndId(Long userId, Long taskId);

	Optional<Task> findByUserIdAndMoodleCourseIdAndMoodleCmid(Long userId, Long courseId, Long cmid);

	List<Task> findAllByUserAndDeadlineIsNotNull(User user);

	List<Task> findAllByUserAndDoneTrueAndCompletionDateAfter(User user, LocalDateTime sevenDaysAgo);

}
