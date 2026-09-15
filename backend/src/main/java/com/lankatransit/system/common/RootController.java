package com.lankatransit.system.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping({"/", "/api", "/api/", "/api/health", "/api/status"})
    public ResponseEntity<Map<String, Object>> getApiStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("success", true);
        status.put("status", "UP");
        status.put("service", "Lanka Transit Services API");
        status.put("description", "Official Web-Based Bus Scheduling & Booking System API");
        status.put("version", "1.0.0");
        status.put("timestamp", LocalDateTime.now());

        Map<String, String> endpoints = new LinkedHashMap<>();
        endpoints.put("trips", "/api/trips");
        endpoints.put("routes", "/api/routes");
        endpoints.put("fares", "/api/fares");
        endpoints.put("authLogin", "/api/auth/login");
        endpoints.put("authRegister", "/api/auth/register");
        endpoints.put("h2DatabaseConsole", "/h2-console");
        status.put("availableEndpoints", endpoints);

        status.put("frontendUrl", "http://localhost:5173");

        return ResponseEntity.ok(status);
    }
}