package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.entity.EstimatedTime;

public interface EstimatedTimeRepository extends JpaRepository<EstimatedTime, Long> {

}
