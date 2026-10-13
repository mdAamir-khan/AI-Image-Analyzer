package com.imagereco.dto.openrouter;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RawDetectedItem {

    @JsonProperty("name")
    @JsonAlias({"objectName", "title", "label"})
    private String name;

    @JsonProperty("description")
    @JsonAlias({"desc", "details"})
    private String description;

    @JsonProperty("condition")
    @JsonAlias({"quality", "conditionQuality", "physicalCondition", "state"})
    private String condition;

    @JsonProperty("quantity")
    @JsonAlias({"count", "qty", "amount"})
    private Integer quantity;

    @JsonProperty("category")
    @JsonAlias({"type", "classification"})
    private String category;

    @JsonProperty("confidence")
    @JsonAlias({"score", "certainty"})
    private Double confidence;

    public RawDetectedItem() {}

    public String getName() {
        return name != null && !name.isBlank() ? name : "Unknown Object";
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description != null ? description : "Visual object detected in scene.";
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCondition() {
        return condition != null && !condition.isBlank() ? condition : "Standard Condition";
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public Integer getQuantity() {
        return (quantity != null && quantity > 0) ? quantity : 1;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category != null && !category.isBlank() ? category : "General Object";
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getConfidence() {
        return confidence != null ? confidence : 0.95;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
}
