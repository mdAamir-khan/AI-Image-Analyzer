package com.imagereco.dto.openrouter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RawVisionAnalysisResult {

    @JsonProperty("totalObjectsCount")
    private Integer totalObjectsCount;

    @JsonProperty("summary")
    private String summary;

    @JsonProperty("objects")
    private List<RawDetectedItem> objects = new ArrayList<>();

    private String modelUsed;

    public RawVisionAnalysisResult() {}

    public String getModelUsed() {
        return modelUsed;
    }

    public void setModelUsed(String modelUsed) {
        this.modelUsed = modelUsed;
    }

    public Integer getTotalObjectsCount() {
        return totalObjectsCount;
    }

    public void setTotalObjectsCount(Integer totalObjectsCount) {
        this.totalObjectsCount = totalObjectsCount;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<RawDetectedItem> getObjects() {
        return objects;
    }

    public void setObjects(List<RawDetectedItem> objects) {
        this.objects = objects;
    }
}
