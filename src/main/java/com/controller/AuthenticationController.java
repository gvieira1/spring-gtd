package com.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.dto.AuthenticationDTO;
import com.model.dto.RegisterDTO;
import com.model.entity.User;
import com.model.service.TokenService;
import com.model.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserService userService;
    
    public AuthenticationController(AuthenticationManager authenticationManager, TokenService tokenService, UserService userService) {
		this.authenticationManager = authenticationManager;
		this.tokenService = tokenService;
		this.userService = userService;
	}

	@PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO data, HttpServletResponse response) {
		
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(data.email(), data.password());

        Authentication authentication = authenticationManager.authenticate(auth);
        User user = (User) authentication.getPrincipal();

        String token = tokenService.generateToken(user);

        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(2 * 60 * 60); 
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }

	@PostMapping("/register")
	public ResponseEntity<Void> register(@RequestBody RegisterDTO registerDTO) {
		userService.register(registerDTO);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	
	
}