package com.imagereco.dto.openrouter;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class OpenRouterChatRequest {

    private String model;
    private List<OpenRouterMessage> messages = new ArrayList<>();

    @JsonProperty("response_format")
    private Map<String, String> responseFormat;

    private Double temperature;

    public OpenRouterChatRequest() {}

    public OpenRouterChatRequest(String model, List<OpenRouterMessage> messages) {
        this.model = model;
        this.messages = messages;
        this.temperature = 0.2;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<OpenRouterMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<OpenRouterMessage> messages) {
        this.messages = messages;
    }

    public Map<String, String> getResponseFormat() {
        return responseFormat;
    }

    public void setResponseFormat(Map<String, String> responseFormat) {
        this.responseFormat = responseFormat;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
}
