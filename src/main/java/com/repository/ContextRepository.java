package com.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.entity.Context;

public interface ContextRepository extends JpaRepository<Context, Long> {
	
	List<Context> findByNameContainingIgnoreCase(String term);
	
}
