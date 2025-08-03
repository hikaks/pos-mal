import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiConfig } from '../config/env';

// Initialize Gemini AI dengan environment variable
const geminiConfig = getGeminiConfig();
const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  /**
   * Analisis data penjualan dan berikan rekomendasi
   */
  async analyzeSalesData(transactions: any[], products: any[]) {
    try {
      const prompt = `
        Analisis data penjualan berikut dan berikan rekomendasi untuk meningkatkan bisnis:
        
        Transaksi: ${JSON.stringify(transactions.slice(0, 10))}
        Produk: ${JSON.stringify(products.slice(0, 10))}
        
        Berikan analisis dalam format JSON dengan struktur:
        {
          "insights": [
            "string insight"
          ],
          "recommendations": [
            "string recommendation"
          ],
          "trends": [
            "string trend"
          ],
          "topProducts": [
            {
              "name": "string",
              "reason": "string"
            }
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Error analyzing sales data:', error);
      return {
        insights: ['Tidak dapat menganalisis data saat ini'],
        recommendations: ['Pastikan koneksi internet stabil'],
        trends: ['Data tidak cukup untuk analisis tren'],
        topProducts: []
      };
    }
  }

  /**
   * Rekomendasi kategori produk berdasarkan tren
   */
  async recommendProductCategories(products: any[], transactions: any[]) {
    try {
      const prompt = `
        Berdasarkan data produk dan transaksi berikut, rekomendasikan kategori produk yang potensial:
        
        Produk: ${JSON.stringify(products)}
        Transaksi: ${JSON.stringify(transactions.slice(0, 20))}
        
        Berikan rekomendasi dalam format JSON:
        {
          "recommendedCategories": [
            {
              "name": "string",
              "reason": "string",
              "potentialRevenue": "string"
            }
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Error recommending categories:', error);
      return {
        recommendedCategories: []
      };
    }
  }

  /**
   * Analisis kebiasaan pelanggan
   */
  async analyzeCustomerBehavior(customers: any[], transactions: any[]) {
    try {
      const prompt = `
        Analisis kebiasaan belanja pelanggan berdasarkan data berikut:
        
        Pelanggan: ${JSON.stringify(customers)}
        Transaksi: ${JSON.stringify(transactions)}
        
        Berikan analisis dalam format JSON:
        {
          "customerSegments": [
            {
              "segment": "string",
              "characteristics": ["string"],
              "recommendations": ["string"]
            }
          ],
          "loyaltyInsights": [
            "string insight"
          ],
          "retentionStrategies": [
            "string strategy"
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Error analyzing customer behavior:', error);
      return {
        customerSegments: [],
        loyaltyInsights: ['Tidak dapat menganalisis data pelanggan'],
        retentionStrategies: ['Fokus pada layanan pelanggan yang baik']
      };
    }
  }

  /**
   * Prediksi penjualan
   */
  async predictSales(transactions: any[], products: any[]) {
    try {
      const prompt = `
        Berdasarkan data penjualan historis, prediksi penjualan untuk periode berikutnya:
        
        Transaksi: ${JSON.stringify(transactions)}
        Produk: ${JSON.stringify(products)}
        
        Berikan prediksi dalam format JSON:
        {
          "predictedRevenue": "string",
          "topSellingProducts": [
            {
              "name": "string",
              "predictedQuantity": "number"
            }
          ],
          "seasonalTrends": [
            "string trend"
          ],
          "recommendations": [
            "string recommendation"
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Error predicting sales:', error);
      return {
        predictedRevenue: 'Tidak dapat memprediksi',
        topSellingProducts: [],
        seasonalTrends: ['Data tidak cukup untuk prediksi'],
        recommendations: ['Kumpulkan lebih banyak data historis']
      };
    }
  }

  /**
   * Optimasi stok
   */
  async optimizeInventory(products: any[], transactions: any[]) {
    try {
      const prompt = `
        Analisis dan rekomendasikan optimasi stok berdasarkan data berikut:
        
        Produk: ${JSON.stringify(products)}
        Transaksi: ${JSON.stringify(transactions)}
        
        Berikan rekomendasi dalam format JSON:
        {
          "lowStockAlerts": [
            {
              "productName": "string",
              "currentStock": "number",
              "recommendedStock": "number",
              "urgency": "high|medium|low"
            }
          ],
          "overstockedProducts": [
            {
              "productName": "string",
              "currentStock": "number",
              "recommendedAction": "string"
            }
          ],
          "reorderRecommendations": [
            {
              "productName": "string",
              "quantity": "number",
              "reason": "string"
            }
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Error optimizing inventory:', error);
      return {
        lowStockAlerts: [],
        overstockedProducts: [],
        reorderRecommendations: []
      };
    }
  }
}

export const geminiService = new GeminiService(); 