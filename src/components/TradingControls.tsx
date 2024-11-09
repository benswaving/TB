import React from 'react';
import { Power, Newspaper } from 'lucide-react';
import { useTradingStore } from '../store/tradingStore';

export function TradingControls() {
  const { 
    isTrading, 
    isPaperTrading, 
    startTrading, 
    stopTrading, 
    startPaperTrading, 
    stopPaperTrading 
  } = useTradingStore();

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => isPaperTrading ? stopPaperTrading() : startPaperTrading()}
        className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
          isPaperTrading
            ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
            : 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100'
        }`}
      >
        <Newspaper className="h-4 w-4 mr-2" />
        {isPaperTrading ? 'Stop Paper Trading' : 'Start Paper Trading'}
      </button>
      <button
        onClick={() => isTrading ? stopTrading() : startTrading()}
        className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
          isTrading
            ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
            : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
        }`}
      >
        <Power className="h-4 w-4 mr-2" />
        {isTrading ? 'Stop Trading' : 'Start Trading'}
      </button>
    </div>
  );
}