package com.imagereco.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.imagereco.dto.openrouter.OpenRouterChatRequest;
import com.imagereco.dto.openrouter.OpenRouterChatResponse;
import com.imagereco.dto.openrouter.OpenRouterMessage;
import com.imagereco.dto.openrouter.RawDetectedItem;
import com.imagereco.dto.openrouter.RawVisionAnalysisResult;
import com.imagereco.exception.OpenRouterException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Path;
import java.util.*;

@Service
public class OpenRouterVisionService {

    private static final Logger log = LoggerFactory.getLogger(OpenRouterVisionService.class);

    public static final String OPENROUTER_FREE_MODEL = "openrouter/free";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${openrouter.api-url:https://openrouter.ai/api/v1/chat/completions}")
    private String apiUrl;

    @Value("${openrouter.api-key:}")
    private String configuredApiKey;

    @Value("${openrouter.default-model:openrouter/free}")
    private String defaultModel = OPENROUTER_FREE_MODEL;

    @Value("${openrouter.app-name:ImageReco AI Visual Analyzer}")
    private String appName;

    @Value("${openrouter.site-url:http://localhost:5173}")
    private String siteUrl;

    public OpenRouterVisionService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public boolean isApiKeyConfigured() {
        String key = resolveApiKey(null);
        return key != null && !key.isBlank() && !key.startsWith("your_");
    }

    public String getDefaultModel() {
        return OPENROUTER_FREE_MODEL;
    }

    /**
     * Analyzes image with OpenRouter Multimodal Vision model using openrouter/free.
     *
     * @param imageBytes image raw bytes
     * @param mimeType image MIME type (e.g. image/jpeg, image/png)
     * @param apiKeyOverride optional API key provided per-request (e.g. from UI settings)
     * @return RawVisionAnalysisResult parsed and validated
     */
    public RawVisionAnalysisResult analyzeImage(byte[] imageBytes, String mimeType, String apiKeyOverride) {
        String activeApiKey = resolveApiKey(apiKeyOverride);

        if (activeApiKey == null || activeApiKey.isBlank()) {
            throw new OpenRouterException(
                    "OpenRouter API key is not configured. Please set the OPENROUTER_API_KEY environment variable, " +
                    "add it to your .env file, or enter your API key in the ImageReco Settings modal.", 401
            );
        }

        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        String dataUrl = "data:" + (mimeType != null && !mimeType.isBlank() ? mimeType : "image/jpeg") + ";base64," + base64Image;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + activeApiKey);
        headers.set("HTTP-Referer", (siteUrl != null && !siteUrl.isBlank()) ? siteUrl : "http://localhost:5173");
        headers.set("X-Title", (appName != null && !appName.isBlank()) ? appName : "ImageReco AI Visual Analyzer");

        String systemPrompt = """
                You are ImageReco, an expert AI computer vision and inventory inspection engine.
                Your task is to thoroughly analyze the provided image and detect all distinct, visible physical objects.
                
                For EVERY detected physical object, you must extract:
                1. 'name': Concise, recognizable name (e.g., 'MacBook Pro Laptop', 'Ceramic Coffee Mug', 'Steel Scissors').
                2. 'description': Detailed description of the object, noting its color, material, visual texture, spatial location, and distinguishing features.
                3. 'condition': Objective assessment of quality/condition (e.g., 'Brand New', 'Excellent / Like New', 'Good with Minor Wear', 'Fair / Aged', 'Worn / Scratched', 'Fresh', 'Damaged').
                4. 'quantity': The exact number of identical items of this type visible (e.g., 1, 2, 3...).
                5. 'category': Broad classification (e.g., 'Electronics', 'Furniture', 'Kitchenware', 'Office Supplies', 'Apparel', 'Automotive', 'Plant / Nature', 'Food & Beverage', 'Tools').
                6. 'confidence': A confidence score between 0.70 and 1.00 reflecting visual certainty.

                You must also provide:
                - 'totalObjectsCount': Total count of individual physical items detected in the image.
                - 'summary': A comprehensive 2-3 sentence overview describing the scene, environment, lighting, and layout.

                CRITICAL INSTRUCTION: Respond strictly with a single valid JSON object matching this schema. Do not write any conversational text, introductory remarks, or markdown other than the JSON:
                {
                  "totalObjectsCount": 3,
                  "summary": "Scene overview text here...",
                  "objects": [
                    {
                      "name": "Object Name",
                      "description": "Object description...",
                      "condition": "Condition rating",
                      "quantity": 1,
                      "category": "Category name",
                      "confidence": 0.95
                    }
                  ]
                }
                """;

        List<Map<String, Object>> userContent = new ArrayList<>();
        userContent.add(Map.of(
                "type", "text",
                "text", "Analyze this image and identify all visible physical objects. First provide total objects count, then each object's name, description, condition/quality, and quantity according to the JSON format."
        ));
        userContent.add(Map.of(
                "type", "image_url",
                "image_url", Map.of("url", dataUrl)
        ));

        List<OpenRouterMessage> messages = List.of(
                new OpenRouterMessage("system", systemPrompt),
                new OpenRouterMessage("user", userContent)
        );

        OpenRouterChatRequest requestPayload = new OpenRouterChatRequest(OPENROUTER_FREE_MODEL, messages);
        requestPayload.setResponseFormat(Map.of("type", "json_object"));
        requestPayload.setTemperature(0.15);

        HttpEntity<OpenRouterChatRequest> entity = new HttpEntity<>(requestPayload, headers);

        try {
            log.info("Sending image analysis request to OpenRouter (Model: {})...", OPENROUTER_FREE_MODEL);
            ResponseEntity<OpenRouterChatResponse> responseEntity = restTemplate.postForEntity(apiUrl, entity, OpenRouterChatResponse.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                OpenRouterChatResponse response = responseEntity.getBody();
                if (response.getChoices() == null || response.getChoices().isEmpty()) {
                    throw new OpenRouterException("OpenRouter returned an empty choices list.");
                }

                String rawContent = response.getChoices().get(0).getMessage().getContent();
                log.debug("OpenRouter raw response content: {}", rawContent);
                RawVisionAnalysisResult result = parseAndValidateAiResponse(rawContent);
                result.setModelUsed(OPENROUTER_FREE_MODEL);
                return result;
            } else {
                throw new OpenRouterException("OpenRouter responded with status: " + responseEntity.getStatusCode());
            }

        } catch (HttpStatusCodeException e) {
            String errorBody = e.getResponseBodyAsString();
            log.error("OpenRouter API error [{}]: {}", e.getStatusCode(), errorBody);

            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new OpenRouterException("Invalid OpenRouter API Key. Please verify your API key in Settings or .env file.", 401);
            } else if (e.getStatusCode() == HttpStatus.PAYMENT_REQUIRED) {
                throw new OpenRouterException("OpenRouter account credit is insufficient. Please check your OpenRouter balance.", 402);
            } else if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                throw new OpenRouterException("OpenRouter rate limit reached. Please wait a few seconds and retry.", 429);
            } else {
                throw new OpenRouterException("OpenRouter API error: " + errorBody, e.getStatusCode().value());
            }
        } catch (Exception e) {
            if (e instanceof OpenRouterException) {
                throw (OpenRouterException) e;
            }
            log.error("Unexpected error during OpenRouter call: {}", e.getMessage(), e);
            throw new OpenRouterException("Failed to analyze image with OpenRouter: " + e.getMessage(), e);
        }
    }

    private String resolveApiKey(String apiKeyOverride) {
        if (apiKeyOverride != null && !apiKeyOverride.isBlank()
                && !apiKeyOverride.equalsIgnoreCase("null")
                && !apiKeyOverride.equalsIgnoreCase("undefined")
                && !apiKeyOverride.startsWith("your_")) {
            return cleanApiKey(apiKeyOverride);
        }
        if (configuredApiKey != null && !configuredApiKey.isBlank() && !configuredApiKey.startsWith("your_")) {
            return cleanApiKey(configuredApiKey);
        }
        String envKey = System.getenv("OPENROUTER_API_KEY");
        if (envKey != null && !envKey.isBlank()) {
            return cleanApiKey(envKey);
        }
        String sysPropKey = System.getProperty("OPENROUTER_API_KEY");
        if (sysPropKey != null && !sysPropKey.isBlank()) {
            return cleanApiKey(sysPropKey);
        }
        String dotEnvKey = loadKeyFromDotEnv();
        if (dotEnvKey != null && !dotEnvKey.isBlank()) {
            return cleanApiKey(dotEnvKey);
        }
        return null;
    }

    private String cleanApiKey(String key) {
        if (key == null) return null;
        String trimmed = key.trim();
        if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            trimmed = trimmed.substring(1, trimmed.length() - 1).trim();
        }
        if (trimmed.startsWith("Bearer ") || trimmed.startsWith("bearer ")) {
            trimmed = trimmed.substring(7).trim();
        }
        return trimmed;
    }

    private String loadKeyFromDotEnv() {
        List<java.nio.file.Path> candidatePaths = List.of(
                java.nio.file.Path.of(".env"),
                java.nio.file.Path.of("..", ".env"),
                java.nio.file.Path.of(".env.example"),
                java.nio.file.Path.of("..", ".env.example"),
                java.nio.file.Paths.get(System.getProperty("user.dir"), ".env"),
                java.nio.file.Paths.get(System.getProperty("user.dir"), ".env.example"),
                java.nio.file.Paths.get(System.getProperty("user.dir"), "..", ".env"),
                java.nio.file.Paths.get(System.getProperty("user.dir"), "..", ".env.example")
        );

        for (java.nio.file.Path path : candidatePaths) {
            try {
                if (java.nio.file.Files.exists(path) && java.nio.file.Files.isRegularFile(path)) {
                    List<String> lines = java.nio.file.Files.readAllLines(path);
                    for (String line : lines) {
                        String trimmed = line.trim();
                        if (trimmed.startsWith("OPENROUTER_API_KEY=")) {
                            String value = trimmed.substring("OPENROUTER_API_KEY=".length()).trim();
                            if (!value.isBlank() && !value.startsWith("your_")) {
                                return cleanApiKey(value);
                            }
                        }
                    }
                }
            } catch (Exception ignored) {
                // Ignore and try next path
            }
        }
        return null;
    }

    /**
     * Robustly extracts and validates JSON content from the AI response.
     */
    public RawVisionAnalysisResult parseAndValidateAiResponse(String rawContent) {
        if (rawContent == null || rawContent.isBlank()) {
            throw new OpenRouterException("Received empty response content from AI model.");
        }

        String cleanedJson = extractJson(rawContent);

        // If no JSON object wrapper could be found, provide a clean fallback result
        if (!cleanedJson.startsWith("{") || !cleanedJson.endsWith("}")) {
            log.warn("AI model response was not in JSON format. Raw output: {}", rawContent);
            RawVisionAnalysisResult fallback = new RawVisionAnalysisResult();
            fallback.setSummary(rawContent.trim());
            fallback.setObjects(new ArrayList<>());
            fallback.setTotalObjectsCount(0);
            return fallback;
        }

        try {
            RawVisionAnalysisResult result = objectMapper.readValue(cleanedJson, RawVisionAnalysisResult.class);

            if (result.getObjects() == null) {
                result.setObjects(new ArrayList<>());
            }

            // Calculate total quantity across detected objects
            int calculatedTotal = 0;
            for (RawDetectedItem item : result.getObjects()) {
                calculatedTotal += item.getQuantity();
            }

            if (result.getTotalObjectsCount() == null || result.getTotalObjectsCount() <= 0) {
                result.setTotalObjectsCount(calculatedTotal > 0 ? calculatedTotal : result.getObjects().size());
            }

            if (result.getSummary() == null || result.getSummary().isBlank()) {
                result.setSummary(String.format("Analysis detected %d distinct physical item(s) in the image.", result.getTotalObjectsCount()));
            }

            return result;
        } catch (IOException e) {
            log.error("Failed to parse JSON response from AI. Content: {}", cleanedJson, e);
            throw new OpenRouterException("AI model responded with unparseable format. Please try analyzing again.", e);
        }
    }

    private String extractJson(String text) {
        String trimmed = text.trim();

        // Check if wrapped in markdown code blocks: ```json ... ``` or ``` ... ```
        if (trimmed.contains("```")) {
            int firstFence = trimmed.indexOf("```");
            int afterFirstFence = trimmed.indexOf('\n', firstFence);
            if (afterFirstFence == -1) {
                afterFirstFence = firstFence + 3;
            }
            int lastFence = trimmed.lastIndexOf("```");
            if (lastFence > afterFirstFence) {
                trimmed = trimmed.substring(afterFirstFence, lastFence).trim();
            }
        }

        int firstBrace = trimmed.indexOf('{');
        int lastBrace = trimmed.lastIndexOf('}');
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            return trimmed.substring(firstBrace, lastBrace + 1).trim();
        }

        return trimmed;
    }
}
