package com.imagereco.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AnalysisResponseDto {
    private Long id;
    private String originalFileName;
    private String storedFileName;
    private String imageUrl;
    private Integer totalObjectsDetected;
    private String overallSummary;
    private String modelUsed;
    private Long processingDurationMs;
    private LocalDateTime createdAt;
    private List<DetectedObjectDto> objects = new ArrayList<>();

    public AnalysisResponseDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getStoredFileName() {
        return storedFileName;
    }

    public void setStoredFileName(String storedFileName) {
        this.storedFileName = storedFileName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getTotalObjectsDetected() {
        return totalObjectsDetected;
    }

    public void setTotalObjectsDetected(Integer totalObjectsDetected) {
        this.totalObjectsDetected = totalObjectsDetected;
    }

    public String getOverallSummary() {
        return overallSummary;
    }

    public void setOverallSummary(String overallSummary) {
        this.overallSummary = overallSummary;
    }

    public String getModelUsed() {
        return modelUsed;
    }

    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }

    public Long getProcessingDurationMs() {
        return processingDurationMs;
    }

    public void setProcessingDurationMs(Long processingDurationMs) {
        this.processingDurationMs = processingDurationMs;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<DetectedObjectDto> getObjects() {
        return objects;
    }

    public void setObjects(List<DetectedObjectDto> objects) {
        this.objects = objects;
    }
}
