import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { geminiService } from '../services/gemini';
import { 
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AIInsights: React.FC = () => {
  const { transactions, products } = useStore();
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transactions.length > 0 && products.length > 0) {
      loadInsights();
    }
  }, [transactions, products]);

  const loadInsights = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analysis = await geminiService.analyzeSalesData(transactions, products);
      setInsights(analysis);
    } catch (err) {
      setError('Gagal memuat analisis AI');
      console.error('Error loading AI insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-primary-600 animate-pulse" />
            <span className="text-gray-600">Menganalisis data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center space-x-2 text-danger-600">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Insights */}
      {insights.insights && insights.insights.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2 text-warning-600" />
            AI Insights
          </h3>
          <div className="space-y-3">
            {insights.insights.map((insight: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-success-600" />
            Rekomendasi AI
          </h3>
          <div className="space-y-3">
            {insights.recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends */}
      {insights.trends && insights.trends.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-primary-600" />
            Tren Terdeteksi
          </h3>
          <div className="space-y-3">
            {insights.trends.map((trend: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{trend}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      {insights.topProducts && insights.topProducts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-primary-600" />
            Produk Unggulan AI
          </h3>
          <div className="space-y-3">
            {insights.topProducts.map((product: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights; 