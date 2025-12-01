package com.mindwell.mood_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
@SpringBootApplication
@EnableEurekaClient
public class MoodServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoodServiceApplication.class, args);
	}

}
