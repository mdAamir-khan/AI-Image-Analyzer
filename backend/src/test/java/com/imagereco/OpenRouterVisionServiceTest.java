package com.imagereco;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.imagereco.dto.openrouter.RawVisionAnalysisResult;
import com.imagereco.service.OpenRouterVisionService;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

class OpenRouterVisionServiceTest {

    private final OpenRouterVisionService service = new OpenRouterVisionService(new RestTemplate(), new ObjectMapper());

    @Test
    void testParseMarkdownWrappedJson() {
        String markdownResponse = """
                Here is the analysis:
                ```json
                {
                  "totalObjectsCount": 2,
                  "summary": "A clean office desktop with electronics.",
                  "objects": [
                    {
                      "name": "Mechanical Keyboard",
                      "description": "Black RGB backlit mechanical keyboard",
                      "condition": "Excellent",
                      "quantity": 1,
                      "category": "Electronics",
                      "confidence": 0.98
                    },
                    {
                      "name": "Coffee Mug",
                      "description": "White ceramic coffee mug with logo",
                      "condition": "Good",
                      "quantity": 1,
                      "category": "Kitchenware",
                      "confidence": 0.94
                    }
                  ]
                }
                ```
                """;

        RawVisionAnalysisResult result = service.parseAndValidateAiResponse(markdownResponse);
        assertNotNull(result);
        assertEquals(2, result.getTotalObjectsCount());
        assertEquals(2, result.getObjects().size());
        assertEquals("Mechanical Keyboard", result.getObjects().get(0).getName());
        assertEquals("Excellent", result.getObjects().get(0).getCondition());
        assertEquals(1, result.getObjects().get(0).getQuantity());
    }

    @Test
    void testAutoCalculatesTotalCountWhenMissing() {
        String rawJson = """
                {
                  "objects": [
                    {
                      "name": "Apples",
                      "description": "Red fresh apples in bowl",
                      "condition": "Fresh",
                      "quantity": 4,
                      "category": "Food",
                      "confidence": 0.95
                    },
                    {
                      "name": "Banana",
                      "description": "Ripe yellow banana",
                      "condition": "Good",
                      "quantity": 2,
                      "category": "Food",
                      "confidence": 0.92
                    }
                  ]
                }
                """;

        RawVisionAnalysisResult result = service.parseAndValidateAiResponse(rawJson);
        assertNotNull(result);
        assertEquals(6, result.getTotalObjectsCount()); // 4 + 2
        assertEquals(2, result.getObjects().size());
    }
}
