export interface KlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradingSignal {
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  timestamp: number;
  price: number;
}

export interface Position {
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  quantity: number;
  timestamp: number;
}

export interface TradingState {
  isTrading: boolean;
  isPaperTrading: boolean;
  currentPosition: Position | null;
  balance: number;
  signals: TradingSignal[];
}