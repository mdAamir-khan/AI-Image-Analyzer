package com.imagereco.dto;

public class DetectedObjectDto {
    private Long id;
    private String name;
    private String description;
    private String condition; // quality/condition
    private Integer quantity;
    private String category;
    private Double confidence;

    public DetectedObjectDto() {}

    public DetectedObjectDto(Long id, String name, String description, String condition, Integer quantity, String category, Double confidence) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.condition = condition;
        this.quantity = quantity;
        this.category = category;
        this.confidence = confidence;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
}
