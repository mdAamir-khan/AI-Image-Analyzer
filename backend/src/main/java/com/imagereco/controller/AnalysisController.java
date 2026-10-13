package com.imagereco.controller;

import com.imagereco.dto.AnalysisResponseDto;
import com.imagereco.dto.CaptureRequestDto;
import com.imagereco.service.ImageAnalysisService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final ImageAnalysisService analysisService;

    public AnalysisController(ImageAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    /**
     * Upload and analyze an image file (JPEG, PNG, WebP).
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalysisResponseDto> uploadAndAnalyze(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-OpenRouter-Key", required = false) String apiKeyOverride) throws IOException {

        AnalysisResponseDto result = analysisService.analyzeUploadedFile(file, apiKeyOverride);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * Analyze image captured directly via camera (webcam).
     */
    @PostMapping(value = "/capture", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AnalysisResponseDto> captureAndAnalyze(
            @Valid @RequestBody CaptureRequestDto request,
            @RequestHeader(value = "X-OpenRouter-Key", required = false) String apiKeyOverride) throws IOException {

        AnalysisResponseDto result = analysisService.analyzeCapturedBase64(
                request.getImageBase64(),
                request.getFileName(),
                apiKeyOverride
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * Retrieve analysis history.
     */
    @GetMapping("/history")
    public ResponseEntity<List<AnalysisResponseDto>> getHistory() {
        return ResponseEntity.ok(analysisService.getAllHistory());
    }

    /**
     * Retrieve a specific analysis record by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AnalysisResponseDto> getAnalysisById(@PathVariable Long id) {
        return ResponseEntity.ok(analysisService.getAnalysisById(id));
    }

    /**
     * Delete an analysis record and stored image.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAnalysis(@PathVariable Long id) {
        analysisService.deleteAnalysis(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Analysis record #" + id + " successfully deleted"
        ));
    }

    /**
     * Serve stored image with appropriate media type.
     */
    @GetMapping("/image/{fileName:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String fileName) {
        Resource resource = analysisService.getImageResource(fileName);

        String contentType = "image/jpeg";
        try {
            String probed = Files.probeContentType(Paths.get(resource.getFile().getAbsolutePath()));
            if (probed != null) {
                contentType = probed;
            }
        } catch (Exception ignored) {}

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(resource);
    }
}
