import React from 'react';
import { BarChart2, Brain } from 'lucide-react';

interface AnalysisControlsProps {
  onAnalyze: () => void;
  onOptimize: () => void;
  isAnalyzing: boolean;
  isOptimizing: boolean;
}

export function AnalysisControls({ 
  onAnalyze, 
  onOptimize, 
  isAnalyzing, 
  isOptimizing 
}: AnalysisControlsProps) {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
      >
        <BarChart2 className="h-4 w-4 mr-2" />
        {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
      </button>
      <button
        onClick={onOptimize}
        disabled={isOptimizing}
        className="inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
      >
        <Brain className="h-4 w-4 mr-2" />
        {isOptimizing ? 'Optimizing...' : 'Optimize Strategy'}
      </button>
    </div>
  );
}