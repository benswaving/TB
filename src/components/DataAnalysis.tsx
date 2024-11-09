import React from 'react';
import { LineChart, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DataAnalysisProps {
  analysisResult: AnalysisResult;
}

export function DataAnalysis({ analysisResult }: DataAnalysisProps) {
  const { trends, patterns, volatility, performance, recommendations } = analysisResult;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
            Market Trends
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Short Term Trend</p>
              <div className="flex items-center mt-1">
                {trends.shortTerm.direction === 'UPWARD' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="font-medium">
                  {(trends.shortTerm.strength * 100).toFixed(1)}% Strength
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Medium Term Trend</p>
              <div className="flex items-center mt-1">
                {trends.mediumTerm.direction === 'UPWARD' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="font-medium">
                  {(trends.mediumTerm.strength * 100).toFixed(1)}% Strength
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-gray-500" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Win Rate</p>
              <p className="text-2xl font-semibold">
                {(performance.winRate * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Return</p>
              <p className="text-2xl font-semibold">
                {(performance.totalReturn * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sharpe Ratio</p>
              <p className="text-2xl font-semibold">
                {performance.sharpeRatio.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-gray-500" />
          Pattern Recognition
        </h3>
        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{pattern.name}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(pattern.timestamp), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pattern.reliability > 0.7
                    ? 'bg-green-100 text-green-800'
                    : pattern.reliability > 0.4
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {(pattern.reliability * 100).toFixed(0)}% reliable
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-blue-500">•</span>
              <span className="ml-2">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface AnalysisResult {
  trends: {
    shortTerm: {
      direction: 'UPWARD' | 'DOWNWARD';
      strength: number;
    };
    mediumTerm: {
      direction: 'UPWARD' | 'DOWNWARD';
      strength: number;
    };
    momentum: number;
  };
  patterns: {
    name: string;
    reliability: number;
    timestamp: number;
  }[];
  volatility: {
    dailyVolatility: number;
    averageReturn: number;
    sharpeRatio: number;
  };
  performance: {
    winRate: number;
    totalReturn: number;
    averageReturn: number;
    sharpeRatio: number;
  };
  recommendations: string[];
}