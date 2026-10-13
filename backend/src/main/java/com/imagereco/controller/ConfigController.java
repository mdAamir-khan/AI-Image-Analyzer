package com.imagereco.controller;

import com.imagereco.dto.ConfigStatusDto;
import com.imagereco.service.OpenRouterVisionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ConfigController {

    private final OpenRouterVisionService visionService;
    private final Environment environment;

    @Value("${openrouter.app-name:ImageReco AI Visual Analyzer}")
    private String appName;

    public ConfigController(OpenRouterVisionService visionService, Environment environment) {
        this.visionService = visionService;
        this.environment = environment;
    }

    @GetMapping("/config/status")
    public ResponseEntity<ConfigStatusDto> getSystemStatus() {
        String[] activeProfiles = environment.getActiveProfiles();
        String activeProfile = activeProfiles.length > 0 ? String.join(", ", activeProfiles) : "mysql";

        ConfigStatusDto status = new ConfigStatusDto(
                visionService.isApiKeyConfigured(),
                visionService.getDefaultModel(),
                activeProfile,
                true,
                appName
        );

        return ResponseEntity.ok(status);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "timestamp", System.currentTimeMillis(),
                "service", "ImageReco Backend API"
        ));
    }
}
