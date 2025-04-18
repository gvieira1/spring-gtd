package com.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.model.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
	Page<Task> findByUserIdOrderByCategoryName(Long userId, Pageable pageable);
	
	Page<Task> findByProjectId(Long userId, Pageable pageable);

	List<Task> findByProjectId(Long id);
	
	Page<Task> findByProjectIsNull(Pageable pageable);

}
