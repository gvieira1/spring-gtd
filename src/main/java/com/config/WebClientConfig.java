package com.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import java.time.Duration;

@Configuration
public class WebClientConfig {

	@Value("${moodle.api.url}")
	private String moodleApiUrl;
	
    @Bean
    WebClient moodleWebClient() {
    	HttpClient httpClient = HttpClient.create()
                .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000) 
                .responseTimeout(Duration.ofSeconds(10));
		
        return WebClient.builder()
                .baseUrl(moodleApiUrl)
	            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	            .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}