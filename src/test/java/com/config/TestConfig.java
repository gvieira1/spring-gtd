package com.config;

import static org.mockito.Mockito.mock;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import com.model.service.TaskService;
import com.model.service.UserService;

@TestConfiguration 
public class TestConfig {
    @Bean
    TaskService taskService() {
        return mock(TaskService.class);
    }
    
    @Bean
    UserService userService() {
        return mock(UserService.class);
    }
}
