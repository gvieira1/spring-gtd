package com.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.model.entity.User;

public interface UserRepository extends JpaRepository<User, Long >{

	UserDetails findByEmail(String email);
	
	Optional<User> findUserByEmail(String email);

}
