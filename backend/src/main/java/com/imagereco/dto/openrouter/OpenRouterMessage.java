package com.imagereco.dto.openrouter;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class OpenRouterMessage {
    private String role;
    private Object content; // Can be String or List<Map<String, Object>>

    public OpenRouterMessage() {}

    public OpenRouterMessage(String role, Object content) {
        this.role = role;
        this.content = content;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }
}
