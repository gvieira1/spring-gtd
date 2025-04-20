package com.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.entity.User;

public interface UserRepository extends JpaRepository<User, Long >{

}
