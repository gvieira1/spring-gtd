package com.config;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.model.dto.project.ProjectRequestDTO;
import com.model.dto.project.ProjectResponseDTO;
import com.model.dto.task.EstimatedTimeDTO;
import com.model.dto.task.SimpleCategoryDTO;
import com.model.dto.task.SimpleProjectDTO;
import com.model.dto.task.SimpleUserDTO;
import com.model.dto.task.TaskRequestDTO;
import com.model.dto.task.TaskResponseDTO;
import com.model.dto.task.TaskSummaryDTO;
import com.model.entity.Project;
import com.model.entity.Task;
import com.model.entity.User;

@Configuration
public class ModelMapperConfig {

    @Bean
    ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        
        modelMapper.addMappings(new PropertyMap<TaskRequestDTO, TaskResponseDTO>() {
            @Override
            protected void configure() {
                map(source.getDescription(), destination.getDescription());
                map(source.getPriority(), destination.getPriority());
                map(source.getDeadline(), destination.getDeadline());
                map(source.getSubject(), destination.getSubject());
                map(source.getDelegated(), destination.getDelegated());
                
                using(ctx -> new EstimatedTimeDTO()).map(source.getCategoryId(), destination.getEstimatedTime());
                using(ctx -> new SimpleUserDTO()).map(source.getUserId(), destination.getUser().getId());
                using(ctx -> new SimpleCategoryDTO()).map(source.getCategoryId(), destination.getCategory().getId());
                using(ctx -> new SimpleProjectDTO()).map(source.getProjectId(), destination.getProject().getId());
                
            }
        });
       
     // ProjectRequestDTO → Project
        modelMapper.addMappings(new PropertyMap<ProjectRequestDTO, Project>() {
            @Override
            protected void configure() {
                map().setDescription(source.getDescription());
                using(ctx -> {
                    Long userId = (Long) ctx.getSource();
                    if (userId == null) return null;
                    User user = new User();
                    user.setId(userId);
                    return user;
                }).map(source.getUserId(), destination.getUser());
            }
        });

        // Project → ProjectResponseDTO
        modelMapper.addMappings(new PropertyMap<Project, ProjectResponseDTO>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setDescription(source.getDescription());
                map().setDone(source.getDone());


                // Task → TaskSummaryDTO (lista)
                using(ctx -> {
                    @SuppressWarnings("unchecked")
					List<Task> tasks = (List<Task>) ctx.getSource();
                    if (tasks == null) return null;
                    return tasks.stream()
                        .map(task -> modelMapper.map(task, TaskSummaryDTO.class))
                        .collect(Collectors.toList());
                }).map(source.getTasks(), destination.getTasks());
            }
        });

        // Task → TaskSummaryDTO
        modelMapper.addMappings(new PropertyMap<Task, TaskSummaryDTO>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setDescription(source.getDescription());
                map().setDone(source.getDone());
            }
        });

        // User → SimpleUserDTO 
        modelMapper.addMappings(new PropertyMap<User, SimpleUserDTO>() {
            @Override
            protected void configure() {
                map().setId(source.getId());
                map().setName(source.getName());
            }
        });

        return modelMapper;
    }
}
