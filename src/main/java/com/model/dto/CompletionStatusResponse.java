package com.model.dto;

import java.util.List;

import lombok.Data;

@Data
public class CompletionStatusResponse {
    private List<ActivityStatusDTO> statuses;
}