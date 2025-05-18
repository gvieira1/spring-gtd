package com.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.model.entity.Context;
import com.repository.ContextRepository;

@Service
public class ContextService {

    private final ContextRepository contextRepository;

    public ContextService(ContextRepository contextRepository) {
        this.contextRepository = contextRepository;
    }

    public List<Context> getAllContexts() {
        return contextRepository.findAll();
    }

    public Context createContext(Context context) {
        return contextRepository.save(context);
    }
    
    public List<Context> searchContextsByName(String term) {
        return contextRepository.findByNameContainingIgnoreCase(term);
    }

}
