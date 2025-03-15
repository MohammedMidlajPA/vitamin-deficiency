
interface PlantApiResponse {
  health_assessment: {
    diseases: Array<{
      name: string;
      probability: number;
      description: string;
      treatment?: {
        biological: string[];
        chemical: string[];
        prevention: string[];
      };
      classification: {
        taxonomy: {
          class: string;
          family: string;
          genus: string;
          kingdom: string;
          order: string;
          phylum: string;
        };
      };
      common_names?: string[];
      url?: string;
    }>;
    is_healthy: boolean;
    is_healthy_probability: number;
  };
  meta_data: {
    latitude?: number;
    longitude?: number;
    date: string;
    datetime: string;
  };
}

export interface DiseaseInfo {
  name: string;
  probability: number;
  description: string;
  treatment?: {
    biological: string[];
    chemical: string[];
    prevention: string[];
  };
  taxonomy?: {
    class: string;
    family: string;
    genus: string;
    kingdom: string;
    order: string;
    phylum: string;
  };
  common_names?: string[];
  url?: string;
}

export class PlantService {
  private static API_KEY = "7E2TkZqU0bWsLwRv0D0p3gwK2KIavIonujj0q6g6TaryXmDAwz";
  private static MAX_RETRIES = 3;
  private static RETRY_DELAY = 1000; // ms

  static async identifyDisease(base64Image: string): Promise<DiseaseInfo[]> {
    try {
      // Prepare data for Plant.id API
      const data = {
        api_key: this.API_KEY,
        images: [base64Image],
        modifiers: ["health_all"],
        disease_details: ["description", "treatment", "classification"],
        language: "en",
      };

      // Make API call to Plant.id with retries
      const response = await this.retryFetch('https://api.plant.id/v2/health_assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }, this.MAX_RETRIES);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json() as PlantApiResponse;
      
      if (!result.health_assessment || !result.health_assessment.diseases) {
        return [];
      }
      
      // Map and enhance the disease information
      return result.health_assessment.diseases
        .filter(disease => disease.probability > 0.6)
        .map(disease => ({
          name: disease.name,
          probability: disease.probability,
          description: disease.description,
          treatment: disease.treatment,
          taxonomy: disease.classification?.taxonomy,
          common_names: disease.common_names,
          url: disease.url
        }));
    } catch (error) {
      console.error('Error analyzing plant image:', error);
      throw error;
    }
  }

  // Implements a retry mechanism for fetch operations
  private static async retryFetch(url: string, options: RequestInit, maxRetries: number): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          return response;
        }
        
        lastError = new Error(`API request failed with status ${response.status}`);
        
        // If this is a 429 (too many requests) or 5xx (server error), retry
        if (response.status === 429 || response.status >= 500) {
          console.log(`Retrying API request, attempt ${attempt + 1} of ${maxRetries}`);
          await this.delay(this.RETRY_DELAY * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }
        
        // For other error codes, don't retry
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.log(`API request error, attempt ${attempt + 1} of ${maxRetries}:`, lastError);
        await this.delay(this.RETRY_DELAY * Math.pow(2, attempt));
      }
    }
    
    throw lastError || new Error("Maximum retries reached");
  }
  
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async getEnhancedPlantInfo(diseaseInfo: DiseaseInfo, geminiApiKey: string): Promise<string> {
    try {
      const prompt = `
      You are a plant disease expert specialized in ${diseaseInfo.name}.
      
      Disease details: 
      - Name: ${diseaseInfo.name}
      - Description: ${diseaseInfo.description || 'No detailed description available.'}
      - Probability: ${(diseaseInfo.probability * 100).toFixed(2)}%
      ${diseaseInfo.taxonomy ? `- Plant taxonomy: Kingdom ${diseaseInfo.taxonomy.kingdom}, Family ${diseaseInfo.taxonomy.family}, Genus ${diseaseInfo.taxonomy.genus}` : ''}
      ${diseaseInfo.common_names ? `- Common names: ${diseaseInfo.common_names.join(', ')}` : ''}
      
      Create a comprehensive plant disease guide that includes:
      1. A brief introduction to this plant disease
      2. Clear symptoms identification with visual cues
      3. Causes and environmental factors
      4. Progression stages
      5. Treatment options with organic and chemical solutions
      6. Prevention strategies for gardeners
      7. Risk levels to other plants, humans, or pets
      
      Format your response with markdown for better readability.
      Use bullet points for lists of treatment options or prevention steps.
      Include scientific terminology where relevant but explain it for amateur gardeners.
      Keep your response focused, engaging, and actionable.
      Focus especially on detailed biological control methods.
      `;

      // Make API call to Gemini with retries
      let response;
      try {
        response = await this.retryFetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1200,
            }
          }),
        }, this.MAX_RETRIES);
      } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
      }

      if (!response.ok) {
        throw new Error(`Gemini API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error) {
      console.error('Error generating enhanced plant information:', error);
      return "Unable to generate enhanced information at this time. Please try again later.";
    }
  }
}
