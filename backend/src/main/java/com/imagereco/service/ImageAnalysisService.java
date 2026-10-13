package com.imagereco.service;

import com.imagereco.dto.AnalysisResponseDto;
import com.imagereco.dto.DetectedObjectDto;
import com.imagereco.dto.openrouter.RawDetectedItem;
import com.imagereco.dto.openrouter.RawVisionAnalysisResult;
import com.imagereco.entity.AnalysisRecord;
import com.imagereco.entity.DetectedObjectEntity;
import com.imagereco.exception.ResourceNotFoundException;
import com.imagereco.repository.AnalysisRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(ImageAnalysisService.class);

    private final StorageService storageService;
    private final OpenRouterVisionService visionService;
    private final AnalysisRecordRepository analysisRecordRepository;

    public ImageAnalysisService(StorageService storageService,
                                OpenRouterVisionService visionService,
                                AnalysisRecordRepository analysisRecordRepository) {
        this.storageService = storageService;
        this.visionService = visionService;
        this.analysisRecordRepository = analysisRecordRepository;
    }

    @Transactional
    public AnalysisResponseDto analyzeUploadedFile(MultipartFile file, String apiKeyOverride) throws IOException {
        validateFile(file);

        long startTime = System.currentTimeMillis();
        StorageService.StoredFileInfo storedInfo = storageService.store(file);
        byte[] imageBytes = storageService.loadBytes(storedInfo.getStoredFileName());

        RawVisionAnalysisResult aiResult = visionService.analyzeImage(imageBytes, storedInfo.getMimeType(), apiKeyOverride);
        long duration = System.currentTimeMillis() - startTime;

        AnalysisRecord record = createAndPersistRecord(storedInfo, aiResult, duration);
        return mapToDto(record);
    }

    @Transactional
    public AnalysisResponseDto analyzeCapturedBase64(String base64Data, String fileName, String apiKeyOverride) throws IOException {
        if (base64Data == null || base64Data.isBlank()) {
            throw new IllegalArgumentException("Captured image payload cannot be empty.");
        }

        long startTime = System.currentTimeMillis();
        StorageService.StoredFileInfo storedInfo = storageService.storeBase64(base64Data, fileName);
        byte[] imageBytes = storageService.loadBytes(storedInfo.getStoredFileName());

        RawVisionAnalysisResult aiResult = visionService.analyzeImage(imageBytes, storedInfo.getMimeType(), apiKeyOverride);
        long duration = System.currentTimeMillis() - startTime;

        AnalysisRecord record = createAndPersistRecord(storedInfo, aiResult, duration);
        return mapToDto(record);
    }

    @Transactional(readOnly = true)
    public List<AnalysisResponseDto> getAllHistory() {
        return analysisRecordRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnalysisResponseDto getAnalysisById(Long id) {
        AnalysisRecord record = analysisRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis record not found with id: " + id));
        return mapToDto(record);
    }

    @Transactional
    public void deleteAnalysis(Long id) {
        AnalysisRecord record = analysisRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis record not found with id: " + id));
        storageService.delete(record.getStoredFileName());
        analysisRecordRepository.delete(record);
    }

    public Resource getImageResource(String storedFileName) {
        return storageService.loadAsResource(storedFileName);
    }

    private AnalysisRecord createAndPersistRecord(StorageService.StoredFileInfo storedInfo,
                                                  RawVisionAnalysisResult aiResult,
                                                  long durationMs) {
        AnalysisRecord record = new AnalysisRecord();
        record.setOriginalFileName(storedInfo.getOriginalFileName());
        record.setStoredFileName(storedInfo.getStoredFileName());
        record.setMimeType(storedInfo.getMimeType());
        record.setFileSize(storedInfo.getFileSize());
        record.setTotalObjectsDetected(aiResult.getTotalObjectsCount());
        record.setOverallSummary(aiResult.getSummary());
        record.setModelUsed(visionService.getDefaultModel());
        record.setProcessingDurationMs(durationMs);

        if (aiResult.getObjects() != null) {
            for (RawDetectedItem item : aiResult.getObjects()) {
                DetectedObjectEntity entity = new DetectedObjectEntity(
                        item.getName(),
                        item.getDescription(),
                        item.getCondition(),
                        item.getQuantity(),
                        item.getCategory(),
                        item.getConfidence()
                );
                record.addObject(entity);
            }
        }

        AnalysisRecord saved = analysisRecordRepository.save(record);
        log.info("Analysis record #{} successfully saved to database. Total objects: {}",
                saved.getId(), saved.getTotalObjectsDetected());
        return saved;
    }

    public AnalysisResponseDto mapToDto(AnalysisRecord record) {
        AnalysisResponseDto dto = new AnalysisResponseDto();
        dto.setId(record.getId());
        dto.setOriginalFileName(record.getOriginalFileName());
        dto.setStoredFileName(record.getStoredFileName());
        dto.setImageUrl("/api/analysis/image/" + record.getStoredFileName());
        dto.setTotalObjectsDetected(record.getTotalObjectsDetected());
        dto.setOverallSummary(record.getOverallSummary());
        dto.setModelUsed(record.getModelUsed());
        dto.setProcessingDurationMs(record.getProcessingDurationMs());
        dto.setCreatedAt(record.getCreatedAt());

        if (record.getObjects() != null) {
            List<DetectedObjectDto> objectDtos = record.getObjects().stream().map(o ->
                    new DetectedObjectDto(
                            o.getId(),
                            o.getName(),
                            o.getDescription(),
                            o.getConditionQuality(),
                            o.getQuantity(),
                            o.getCategory(),
                            o.getConfidence()
                    )
            ).collect(Collectors.toList());
            dto.setObjects(objectDtos);
        }

        return dto;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please upload a valid image file.");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.equalsIgnoreCase("application/octet-stream"))) {
            throw new IllegalArgumentException("Uploaded file must be a valid image (JPEG, PNG, WebP, etc.).");
        }

        // Limit 20MB
        if (file.getSize() > 20 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 20MB limit.");
        }
    }
}
