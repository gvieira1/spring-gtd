package com.model.mapper;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.exception.ResourceNotFoundException;
import com.model.dto.ContextDTO;
import com.model.dto.EstimatedTimeDTO;
import com.model.dto.SimpleCategoryDTO;
import com.model.dto.TaskRequestDTO;
import com.model.dto.TaskResponseDTO;
import com.model.entity.CategoryEntity;
import com.model.entity.Context;
import com.model.entity.EstimatedTime;
import com.model.entity.Task;
import com.repository.CategoryRepository;
import com.repository.ContextRepository;
import com.repository.EstimatedTimeRepository;

@Component
public class TaskMapper {
	
	 
	private final ModelMapper modelMapper;
	private final CategoryRepository categoryRepository;
	private final EstimatedTimeRepository estTimeRepository;   
	private final ContextRepository contextRepository;

	public TaskMapper(ModelMapper modelMapper, CategoryRepository categoryRepository, EstimatedTimeRepository estTimeRepository, ContextRepository contextRepository) {
			this.modelMapper = modelMapper;
			this.categoryRepository = categoryRepository;
			this.estTimeRepository = estTimeRepository;
			this.contextRepository = contextRepository;
		}


	public TaskResponseDTO toDTO(Task task) {
		TaskResponseDTO responseDTO = modelMapper.map(task, TaskResponseDTO.class);

		CategoryEntity category = categoryRepository.findById(task.getCategory().getId())
				.orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

		SimpleCategoryDTO categoryDTO = responseDTO.getCategory();
		categoryDTO.setName(category.getName());

		EstimatedTime estTime = estTimeRepository.findById(task.getEstimatedTime().getId())
				.orElseThrow(() -> new ResourceNotFoundException("Categoria de tempo não encontrada"));

		EstimatedTimeDTO estTimeDTO = responseDTO.getEstimatedTime();
		estTimeDTO.setTime(estTime.getTime());

		List<ContextDTO> contexts = task.getContexts().stream().map(c -> new ContextDTO(c.getId(), c.getName())).toList();
		responseDTO.setContexts(contexts);

		return responseDTO;
	}


    public Task toEntity(TaskRequestDTO taskRequestDTO) {
    	Task task =  modelMapper.map(taskRequestDTO, Task.class);
        
        if (taskRequestDTO.getContextIds() != null && !taskRequestDTO.getContextIds().isEmpty()) {
            List<Context> contexts = taskRequestDTO.getContextIds().stream()
                    .map(id -> contextRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Contexto não encontrado: " + id)))
                    .toList();
            task.setContexts(contexts);
        }
        
        return task;
    }
    
}
