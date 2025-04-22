package com.model.service;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.exception.UserNotFoundException;
import com.fasterxml.jackson.databind.JsonNode;

import io.netty.handler.timeout.TimeoutException;
import reactor.core.publisher.Mono;

@Service
public class MoodleService {

    private final WebClient moodleWebClient;  

    public MoodleService(WebClient moodleWebClient) {
		this.moodleWebClient = moodleWebClient;
	}

	@Value("${moodle.token}") 
    private String token;
	
	public Mono<Long> findMoodleUserIdByEmail(String email) {
        return moodleWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("wstoken", token)
                        .queryParam("wsfunction", "core_user_get_users_by_field")
                        .queryParam("moodlewsrestformat", "json")
                        .queryParam("field", "email")
                        .queryParam("values[0]", email)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .timeout(Duration.ofSeconds(10)) 
                .onErrorMap(WebClientResponseException.class, ex -> {
                    return new RuntimeException("Erro na requisição ao Moodle: " + ex.getMessage());
                })
                .onErrorMap(TimeoutException.class, ex -> {
                    return new RuntimeException("Tempo limite de resposta excedido ao buscar usuário: " + ex.getMessage());
                })
                .map(json -> {
                	System.out.println("Resposta JSON: " + json.toString());
                	if (json != null && json.isArray() && json.size() > 0) {
                	    JsonNode user = json.get(0);  
                	    if (user.has("id")) {
                	        return user.get("id").asLong();  
                	    } else {
                	        throw new UserNotFoundException("Usuário não encontrado no Moodle com o email: " + email);
                	    }
                	} else {
                	    throw new UserNotFoundException("Usuário não encontrado no Moodle com o email/: " + email);
                	}

                })
                .onErrorResume(ex -> {
                    return Mono.error(ex); 
                });
    }
}