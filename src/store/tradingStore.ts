import { create } from 'zustand';

interface Position {
  symbol: string;
  side: 'LONG' | 'SHORT';
  amount: number;
  entryPrice: number;
}

interface Signal {
  type: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  timestamp: number;
  confidence: number;
}

interface TradingStore {
  isTrading: boolean;
  isPaperTrading: boolean;
  balance: number;
  currentPosition: Position | null;
  signals: Signal[];
  startTrading: () => void;
  stopTrading: () => void;
  startPaperTrading: () => void;
  stopPaperTrading: () => void;
  addSignal: (signal: Signal) => void;
  updateBalance: (newBalance: number) => void;
  updatePosition: (position: Position | null) => void;
}

export const useTradingStore = create<TradingStore>((set) => ({
  isTrading: false,
  isPaperTrading: false,
  balance: 10000,
  currentPosition: null,
  signals: [],
  startTrading: () => set({ isTrading: true }),
  stopTrading: () => set({ isTrading: false }),
  startPaperTrading: () => set({ isPaperTrading: true }),
  stopPaperTrading: () => set({ isPaperTrading: false }),
  addSignal: (signal) => set((state) => ({ 
    signals: [...state.signals.slice(-19), signal].sort((a, b) => a.timestamp - b.timestamp)
  })),
  updateBalance: (newBalance) => set({ balance: newBalance }),
  updatePosition: (position) => set({ currentPosition: position }),
}));