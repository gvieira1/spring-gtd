package com.model.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.repository.UserRepository;

@Service
public class AuthorizationService implements UserDetailsService{

	private final UserRepository userRepository;	
	
	public AuthorizationService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		UserDetails user = userRepository.findByEmail(email);
		if (user == null) {
		    throw new UsernameNotFoundException("Credenciais Inválidas");
		}
		return user;
	}


}
