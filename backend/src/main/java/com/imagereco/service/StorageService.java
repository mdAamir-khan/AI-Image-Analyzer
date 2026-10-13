package com.imagereco.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Base64;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${app.upload-dir:./uploads}")
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        try {
            this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory at " + uploadDir, e);
        }
    }

    public StoredFileInfo store(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "uploaded_image.jpg";
        }

        String extension = getFileExtension(originalFilename);
        if (extension.isEmpty()) {
            extension = ".jpg";
        }

        String storedFileName = UUID.randomUUID() + extension;
        Path destinationFile = this.rootLocation.resolve(storedFileName).normalize();

        // Security check against directory traversal
        if (!destinationFile.getParent().equals(this.rootLocation)) {
            throw new SecurityException("Cannot store file outside current directory.");
        }

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        }

        return new StoredFileInfo(originalFilename, storedFileName, file.getContentType(), file.getSize(), destinationFile);
    }

    public StoredFileInfo storeBase64(String base64Data, String preferredFileName) throws IOException {
        if (base64Data == null || base64Data.isBlank()) {
            throw new IllegalArgumentException("Empty base64 data.");
        }

        String mimeType = "image/jpeg";
        String cleanBase64 = base64Data;
        String extension = ".jpg";

        // Check data URL format: data:image/png;base64,....
        if (base64Data.contains(",")) {
            String[] parts = base64Data.split(",", 2);
            String header = parts[0];
            cleanBase64 = parts[1];

            if (header.contains("image/png")) {
                mimeType = "image/png";
                extension = ".png";
            } else if (header.contains("image/webp")) {
                mimeType = "image/webp";
                extension = ".webp";
            } else if (header.contains("image/gif")) {
                mimeType = "image/gif";
                extension = ".gif";
            }
        }

        byte[] decodedBytes = Base64.getDecoder().decode(cleanBase64.trim());
        String storedFileName = UUID.randomUUID() + extension;
        String originalName = (preferredFileName != null && !preferredFileName.isBlank())
                ? preferredFileName
                : "camera_capture_" + System.currentTimeMillis() + extension;

        Path destinationFile = this.rootLocation.resolve(storedFileName).normalize();
        if (!destinationFile.getParent().equals(this.rootLocation)) {
            throw new SecurityException("Cannot store file outside current directory.");
        }

        Files.copy(new ByteArrayInputStream(decodedBytes), destinationFile, StandardCopyOption.REPLACE_EXISTING);

        return new StoredFileInfo(originalName, storedFileName, mimeType, (long) decodedBytes.length, destinationFile);
    }

    public Resource loadAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }

    public byte[] loadBytes(String filename) throws IOException {
        Path file = rootLocation.resolve(filename).normalize();
        return Files.readAllBytes(file);
    }

    public void delete(String filename) {
        try {
            Path file = rootLocation.resolve(filename).normalize();
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex >= 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex);
        }
        return "";
    }

    public static class StoredFileInfo {
        private final String originalFileName;
        private final String storedFileName;
        private final String mimeType;
        private final Long fileSize;
        private final Path path;

        public StoredFileInfo(String originalFileName, String storedFileName, String mimeType, Long fileSize, Path path) {
            this.originalFileName = originalFileName;
            this.storedFileName = storedFileName;
            this.mimeType = mimeType;
            this.fileSize = fileSize;
            this.path = path;
        }

        public String getOriginalFileName() {
            return originalFileName;
        }

        public String getStoredFileName() {
            return storedFileName;
        }

        public String getMimeType() {
            return mimeType;
        }

        public Long getFileSize() {
            return fileSize;
        }

        public Path getPath() {
            return path;
        }
    }
}
