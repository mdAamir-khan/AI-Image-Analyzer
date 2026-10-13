package com.imagereco.dto;

import jakarta.validation.constraints.NotBlank;

public class CaptureRequestDto {

    @NotBlank(message = "Image data is required")
    private String imageBase64;

    private String fileName;

    public CaptureRequestDto() {}

    public CaptureRequestDto(String imageBase64, String fileName) {
        this.imageBase64 = imageBase64;
        this.fileName = fileName;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
