package com.imagereco.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "detected_objects")
public class DetectedObjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_record_id", nullable = false)
    @JsonIgnore
    private AnalysisRecord analysisRecord;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "condition_quality")
    private String conditionQuality;

    @Column(nullable = false)
    private Integer quantity = 1;

    private String category;

    private Double confidence;

    public DetectedObjectEntity() {
    }

    public DetectedObjectEntity(String name, String description, String conditionQuality, Integer quantity, String category, Double confidence) {
        this.name = name;
        this.description = description;
        this.conditionQuality = conditionQuality;
        this.quantity = quantity != null ? quantity : 1;
        this.category = category;
        this.confidence = confidence;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AnalysisRecord getAnalysisRecord() {
        return analysisRecord;
    }

    public void setAnalysisRecord(AnalysisRecord analysisRecord) {
        this.analysisRecord = analysisRecord;
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

    public String getConditionQuality() {
        return conditionQuality;
    }

    public void setConditionQuality(String conditionQuality) {
        this.conditionQuality = conditionQuality;
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
