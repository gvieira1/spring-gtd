package com.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.model.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	Page<Project> findByUserId(Long id, Pageable pageable);

	Optional<Project> findByUserIdAndId(Long userId, Long projectId);

}
