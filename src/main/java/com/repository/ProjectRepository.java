package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.model.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

}
