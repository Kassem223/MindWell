package com.example.eureka_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer // ⬅️ Enables the Eureka Discovery Server
public class EurekaServerApplicationTests {
	public static void main(String[] args) {
		SpringApplication.run(EurekaServerApplicationTests.class, args);
	}
}