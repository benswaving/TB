import { SMA, RSI, MACD } from 'technicalindicators';
import type { KlineData } from '../types/trading';

export class TechnicalAnalysisService {
  public static calculateSMA(prices: number[], period: number): number[] {
    const sma = new SMA({ period, values: prices });
    return sma.getResult();
  }

  public static calculateRSI(prices: number[], period: number = 14): number[] {
    const rsi = new RSI({ period, values: prices });
    return rsi.getResult();
  }

  public static calculateMACD(prices: number[]): any {
    const macd = new MACD({
      values: prices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });
    return macd.getResult();
  }

  public static analyzeMarketCondition(klines: KlineData[]): {
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    strength: number;
  } {
    const closes = klines.map(k => k.close);
    const rsi = this.calculateRSI(closes);
    const macd = this.calculateMACD(closes);
    const lastRSI = rsi[rsi.length - 1];
    const lastMACD = macd[macd.length - 1];

    let trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
    let strength = 0;

    if (lastRSI > 70 && lastMACD.histogram < 0) {
      trend = 'BEARISH';
      strength = (lastRSI - 70) / 30;
    } else if (lastRSI < 30 && lastMACD.histogram > 0) {
      trend = 'BULLISH';
      strength = (30 - lastRSI) / 30;
    }

    return { trend, strength: Math.min(Math.max(strength, 0), 1) };
  }
}