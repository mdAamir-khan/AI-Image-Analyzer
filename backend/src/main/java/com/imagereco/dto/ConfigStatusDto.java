package com.imagereco.dto;

public class ConfigStatusDto {
    private boolean apiKeyConfigured;
    private String defaultModel;
    private String activeProfile;
    private boolean databaseConnected;
    private String appName;

    public ConfigStatusDto() {}

    public ConfigStatusDto(boolean apiKeyConfigured, String defaultModel, String activeProfile, boolean databaseConnected, String appName) {
        this.apiKeyConfigured = apiKeyConfigured;
        this.defaultModel = defaultModel;
        this.activeProfile = activeProfile;
        this.databaseConnected = databaseConnected;
        this.appName = appName;
    }

    public boolean isApiKeyConfigured() {
        return apiKeyConfigured;
    }

    public void setApiKeyConfigured(boolean apiKeyConfigured) {
        this.apiKeyConfigured = apiKeyConfigured;
    }

    public String getDefaultModel() {
        return defaultModel;
    }

    public void setDefaultModel(String defaultModel) {
        this.defaultModel = defaultModel;
    }

    public String getActiveProfile() {
        return activeProfile;
    }

    public void setActiveProfile(String activeProfile) {
        this.activeProfile = activeProfile;
    }

    public boolean isDatabaseConnected() {
        return databaseConnected;
    }

    public void setDatabaseConnected(boolean databaseConnected) {
        this.databaseConnected = databaseConnected;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }
}
