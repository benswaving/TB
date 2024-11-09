import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { KuCoinService } from './services/kucoin';
import { DataAnalysisService } from './services/dataAnalysis';
import { SelfCodingService } from './services/selfCoding';
import { TradingControls } from './components/TradingControls';
import { AnalysisControls } from './components/AnalysisControls';
import { TradingStats } from './components/TradingStats';
import { SignalsList } from './components/SignalsList';
import { useTradingStore } from './store/tradingStore';

function App() {
  const { addSignal } = useTradingStore();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const initializeServices = async () => {
      try {
        const kuCoin = KuCoinService.getInstance();
        await kuCoin.initialize('demo', 'demo', 'demo');
        setStatus('Trading bot initialized in demo mode');
        
        // Generate initial demo signal
        addSignal({
          type: 'BUY',
          price: 40000 + Math.random() * 1000,
          timestamp: Date.now(),
          confidence: 0.85
        });
      } catch (err) {
        setStatus('Failed to initialize trading bot');
      }
    };

    initializeServices();
  }, [addSignal]);

  const handleOptimizeStrategy = async () => {
    setIsOptimizing(true);
    try {
      const selfCoding = SelfCodingService.getInstance();
      const kuCoin = KuCoinService.getInstance();
      const klines = await kuCoin.getKlines('BTC-USDT', '1hour');
      await selfCoding.optimizeStrategies(klines);
      setStatus('Strategy optimization completed');
    } catch (error) {
      setStatus('Failed to optimize strategy');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAnalyzeData = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = DataAnalysisService.getInstance();
      const kuCoin = KuCoinService.getInstance();
      const klines = await kuCoin.getKlines('BTC-USDT', '1hour');
      await analysis.analyzeHistoricalData(klines);
      setStatus('Data analysis completed');
    } catch (error) {
      setStatus('Failed to analyze data');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {status && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 fixed top-0 right-0 m-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">{status}</p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">CryptoBot AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <AnalysisControls
                onAnalyze={handleAnalyzeData}
                onOptimize={handleOptimizeStrategy}
                isAnalyzing={isAnalyzing}
                isOptimizing={isOptimizing}
              />
              <TradingControls />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <TradingStats />
          <SignalsList />
        </div>
      </main>
    </div>
  );
}

export default App;