import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { useTradingStore } from '../store/tradingStore';

export function TradingStats() {
  const { balance, currentPosition } = useTradingStore();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Current Balance</dt>
                <dd className="text-lg font-semibold text-gray-900">${balance.toFixed(2)}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Current Position</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {currentPosition ? `${currentPosition.side} ${currentPosition.symbol}` : 'No Position'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}