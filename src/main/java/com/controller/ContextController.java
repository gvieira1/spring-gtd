package com.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.model.entity.Context;
import com.model.service.ContextService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/contexts")
public class ContextController {
	
	private final ContextService contextService;


    public ContextController(ContextService contextService) {
        this.contextService = contextService;
    }

	
	@Operation(summary = "Create a new context")
	@PostMapping
    public ResponseEntity<Void> create(@RequestBody Context context) {
        contextService.createContext(context);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

	@Operation(summary = "Get all task contexts")
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getForSelect() {
    	List<Map<String, Object>> result = contextService.getAllContexts().stream()
            .map(context -> {
                Map<String, Object> item = new HashMap<>();
                item.put("id", context.getId());
                item.put("text", context.getName());
                return item;
            })
            .toList();
        
        return ResponseEntity.ok(result);
    }
	
	@Operation(summary = "Get context select options")
	@GetMapping("/select")
	public ResponseEntity<List<Map<String, Object>>> getForSelect(@RequestParam String term) {
	    List<Map<String, Object>> result = contextService.searchContextsByName(term).stream()
	        .map(context -> {
	            Map<String, Object> item = new HashMap<>();
	            item.put("id", context.getId());
	            item.put("text", context.getName());
	            return item;
	        })
	        .toList();

	    return ResponseEntity.ok(result);
	}

}

    

    

