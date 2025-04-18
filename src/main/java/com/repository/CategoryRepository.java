package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.model.entity.CategoryEntity;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long>{

}
