import { GoogleGenerativeAI } from '@google/generative-ai';

interface APIConfig {
  id: string;
  type: 'gemini' | 'perplexity';
  key: string;
  baseUrl?: string;
  maxRetries: number;
  timeout: number;
  isActive: boolean;
  errorCount: number;
  lastError?: Date;
  rateLimitReset?: Date;
}

interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  apiUsed?: string;
  retryAfter?: number;
}

export interface APIStatus {
  id: string;
  type: 'gemini' | 'perplexity';
  isActive: boolean;
  errorCount: number;
  lastError?: string;
  lastErrorTime?: Date;
  lastSuccessTime?: Date;
}

class APIManager {
  private apis: APIConfig[] = [];
  private currentGeminiIndex = 0;
  private readonly MAX_ERROR_COUNT = 3;
  private readonly ERROR_RESET_TIME = 5 * 60 * 1000; // 5 minutes
  private geminiClients: Map<string, GoogleGenerativeAI> = new Map(); // Cache AI clients
  private lastHealthCheck = 0;
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute

  constructor() {
    this.initializeAPIs();
  }

  private initializeAPIs() {
    // Initialize Gemini APIs
    const geminiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
    ].filter(Boolean);

    geminiKeys.forEach((key, index) => {
      if (key) {
        this.apis.push({
          id: `gemini_${index + 1}`,
          type: 'gemini',
          key,
          maxRetries: 2,
          timeout: 30000,
          isActive: true,
          errorCount: 0,
        });
      }
    });

    // Initialize Perplexity API
    if (process.env.PERPLEXITY_API_KEY) {
      this.apis.push({
        id: 'perplexity_1',
        type: 'perplexity',
        key: process.env.PERPLEXITY_API_KEY,
        baseUrl: 'https://api.perplexity.ai',
        maxRetries: 2,
        timeout: 30000,
        isActive: true,
        errorCount: 0,
      });
    }

    console.log(`Initialized ${this.apis.length} APIs:`, 
      this.apis.map(api => `${api.id} (${api.type})`));
  }

  private resetErrorCount(api: APIConfig) {
    const now = new Date();
    if (api.lastError && (now.getTime() - api.lastError.getTime()) > this.ERROR_RESET_TIME) {
      api.errorCount = 0;
      api.isActive = true;
      api.lastError = undefined;
    }
  }

  private markAPIError(api: APIConfig, error: string) {
    api.errorCount++;
    api.lastError = new Date();
    
    if (api.errorCount >= this.MAX_ERROR_COUNT) {
      api.isActive = false;
      console.warn(`API ${api.id} temporarily disabled due to errors:`, error);
    }
  }

  private getAvailableGeminiAPIs(): APIConfig[] {
    return this.apis
      .filter(api => api.type === 'gemini')
      .map(api => {
        this.resetErrorCount(api);
        return api;
      })
      .filter(api => api.isActive);
  }

  private getAvailablePerplexityAPIs(): APIConfig[] {
    return this.apis
      .filter(api => api.type === 'perplexity')
      .map(api => {
        this.resetErrorCount(api);
        return api;
      })
      .filter(api => api.isActive);
  }

  async analyzeImageWithGemini(imageBuffer: Buffer, mimeType: string, prompt: string): Promise<APIResponse> {
    const availableAPIs = this.getAvailableGeminiAPIs();
    
    if (availableAPIs.length === 0) {
      return {
        success: false,
        error: 'No available Gemini APIs. All APIs are temporarily disabled.',
      };
    }

    // Round-robin through available APIs
    for (let attempt = 0; attempt < availableAPIs.length; attempt++) {
      const apiIndex = (this.currentGeminiIndex + attempt) % availableAPIs.length;
      const api = availableAPIs[apiIndex];
      
      try {
        console.log(`Attempting image analysis with ${api.id}...`);
        
        const genAI = new GoogleGenerativeAI(api.key);
        // Use the basic flash model that should work
        const model = genAI.getGenerativeModel({ 
          model: 'models/gemini-2.0-flash',
          generationConfig: {
            maxOutputTokens: 4096,
          }
        });
        
        const imagePart = {
          inlineData: {
            data: imageBuffer.toString('base64'),
            mimeType: mimeType,
          },
        };

        const result = await Promise.race([
          model.generateContent([prompt, imagePart]),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), api.timeout)
          ),
        ]) as any;

        const response = await result.response;
        const text = response.text();

        // Update current index for next request
        this.currentGeminiIndex = (apiIndex + 1) % availableAPIs.length;

        return {
          success: true,
          data: text,
          apiUsed: api.id,
        };

      } catch (error: any) {
        console.error(`Error with ${api.id}:`, error.message);
        
        // Check for rate limit errors
        if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
          api.rateLimitReset = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
          this.markAPIError(api, `Rate limit: ${error.message}`);
        } else {
          this.markAPIError(api, error.message);
        }

        // If this is the last attempt, continue to try other APIs
        if (attempt === availableAPIs.length - 1) {
          return {
            success: false,
            error: `All Gemini APIs failed. Last error: ${error.message}`,
          };
        }
      }
    }

    return {
      success: false,
      error: 'Unexpected error in image analysis',
    };
  }

  async getInsightsWithPerplexity(query: string): Promise<APIResponse> {
    const availableAPIs = this.getAvailablePerplexityAPIs();
    
    if (availableAPIs.length === 0) {
      return {
        success: false,
        error: 'No available Perplexity APIs',
      };
    }

    const api = availableAPIs[0]; // Use first available Perplexity API

    try {
      console.log(`Getting insights with ${api.id}...`);
      
      const response = await Promise.race([
        fetch(`${api.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${api.key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-large-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful research assistant. Provide detailed insights and analysis about the given topic.'
              },
              {
                role: 'user',
                content: query
              }
            ],
            max_tokens: 2000,
            temperature: 0.2,
            top_p: 0.9,
          }),
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), api.timeout)
        ),
      ]);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.choices[0]?.message?.content || 'No insights generated',
        apiUsed: api.id,
      };

    } catch (error: any) {
      console.error(`Error with ${api.id}:`, error.message);
      
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
        api.rateLimitReset = new Date(Date.now() + 60 * 60 * 1000);
        this.markAPIError(api, `Rate limit: ${error.message}`);
      } else {
        this.markAPIError(api, error.message);
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }

  getAPIStatus(): APIStatus[] {
    return this.apis.map(api => ({
      id: api.id,
      type: api.type,
      isActive: api.isActive,
      errorCount: api.errorCount,
      lastError: api.lastError?.toString(),
      lastErrorTime: api.lastError,
      lastSuccessTime: undefined, // We'll need to track this separately
    }));
  }

  // Method to manually reset an API
  resetAPI(apiId: string) {
    const api = this.apis.find(a => a.id === apiId);
    if (api) {
      api.errorCount = 0;
      api.isActive = true;
      api.lastError = undefined;
      api.rateLimitReset = undefined;
      console.log(`Manually reset API: ${apiId}`);
    }
  }
}

// Singleton instance
export const apiManager = new APIManager();
export type { APIResponse };