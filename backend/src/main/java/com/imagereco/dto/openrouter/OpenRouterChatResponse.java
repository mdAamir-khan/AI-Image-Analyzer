package com.imagereco.dto.openrouter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenRouterChatResponse {
    private String id;
    private String model;
    private List<Choice> choices;

    public OpenRouterChatResponse() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        private Message message;
        private Integer index;
        private String finishReason;

        public Choice() {}

        public Message getMessage() {
            return message;
        }

        public void setMessage(Message message) {
            this.message = message;
        }

        public Integer getIndex() {
            return index;
        }

        public void setIndex(Integer index) {
            this.index = index;
        }

        public String getFinishReason() {
            return finishReason;
        }

        public void setFinishReason(String finishReason) {
            this.finishReason = finishReason;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Message {
        private String role;
        private Object content;
        private String refusal;
        private Object reasoning;

        public Message() {}

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContent() {
            if (content == null) {
                if (reasoning != null) {
                    return reasoning.toString();
                }
                return null;
            }
            if (content instanceof String) {
                return (String) content;
            }
            return content.toString();
        }

        public void setContent(Object content) {
            this.content = content;
        }

        public String getRefusal() {
            return refusal;
        }

        public void setRefusal(String refusal) {
            this.refusal = refusal;
        }

        public Object getReasoning() {
            return reasoning;
        }

        public void setReasoning(Object reasoning) {
            this.reasoning = reasoning;
        }
    }
}
