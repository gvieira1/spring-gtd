package com.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.entity.EstimatedTime;
import com.repository.EstimatedTimeRepository;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/estimated-times")
public class EstimatedTimeController {

    @Autowired
    private EstimatedTimeRepository estimatedTimeRepository;

    @Operation(summary = "Get all Estimated Time options")
    @GetMapping
    public ResponseEntity<List<EstimatedTime>> getAllEstimatedTimes() {
        return ResponseEntity.ok(estimatedTimeRepository.findAll());
    }
}
