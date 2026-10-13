package com.imagereco.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "analysis_records")
public class AnalysisRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String storedFileName;

    private String mimeType;

    private Long fileSize;

    @Column(nullable = false)
    private Integer totalObjectsDetected;

    @Column(columnDefinition = "TEXT")
    private String overallSummary;

    private String modelUsed;

    private Long processingDurationMs;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "analysisRecord", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DetectedObjectEntity> objects = new ArrayList<>();

    public AnalysisRecord() {
        this.createdAt = LocalDateTime.now();
    }

    public void addObject(DetectedObjectEntity objectEntity) {
        objects.add(objectEntity);
        objectEntity.setAnalysisRecord(this);
    }

    public void removeObject(DetectedObjectEntity objectEntity) {
        objects.remove(objectEntity);
        objectEntity.setAnalysisRecord(null);
    }

    // Getters and Setters
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

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
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

    public List<DetectedObjectEntity> getObjects() {
        return objects;
    }

    public void setObjects(List<DetectedObjectEntity> objects) {
        this.objects = objects;
    }
}
