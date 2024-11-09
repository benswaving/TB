import React from 'react';
import { format } from 'date-fns';
import { useTradingStore } from '../store/tradingStore';

export function SignalsList() {
  const { signals } = useTradingStore();

  if (signals.length === 0) return null;

  return (
    <div className="mt-8 bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Signals</h2>
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {signals.slice(-5).reverse().map((signal, index) => (
              <li key={index} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        signal.type === 'BUY'
                          ? 'bg-green-100 text-green-800'
                          : signal.type === 'SELL'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {signal.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Price: ${signal.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(signal.timestamp), 'MMM d, yyyy HH:mm:ss')}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        signal.confidence > 0.7
                          ? 'bg-green-100 text-green-800'
                          : signal.confidence > 0.4
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {(signal.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}