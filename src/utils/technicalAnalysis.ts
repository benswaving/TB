export const technicalAnalysis = async (klines: any[]) => {
  const closes = klines.map(k => k.close);
  
  return {
    sma: {
      sma20: calculateSMA(closes, 20),
      sma50: calculateSMA(closes, 50),
      sma200: calculateSMA(closes, 200)
    },
    ema: {
      ema20: calculateEMA(closes, 20),
      ema50: calculateEMA(closes, 50),
      ema100: calculateEMA(closes, 100)
    },
    dema20: calculateDEMA(closes, 20),
    macd: calculateMACD(closes),
    rsi: calculateRSI(closes),
    stochRSI: calculateStochRSI(closes),
    atr: calculateATR(klines),
    bollinger: calculateBollingerBands(closes),
    donchian: calculateDonchianChannels(klines),
    cci: calculateCCI(klines),
    trendDirection: calculateTrendDirection(closes),
    supportLevel: calculateSupportLevel(closes),
    resistanceLevel: calculateResistanceLevel(closes)
  };
};

function calculateSMA(data: number[], period: number): number[] {
  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
}

function calculateEMA(data: number[], period: number): number[] {
  const multiplier = 2 / (period + 1);
  const result = [data[0]];
  
  for (let i = 1; i < data.length; i++) {
    const ema = (data[i] - result[i - 1]) * multiplier + result[i - 1];
    result.push(ema);
  }
  
  return result;
}

function calculateDEMA(data: number[], period: number): number[] {
  const ema1 = calculateEMA(data, period);
  const ema2 = calculateEMA(ema1, period);
  return ema1.map((v, i) => 2 * v - ema2[i]);
}

function calculateMACD(data: number[]): { macd: number[], signal: number[], histogram: number[] } {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  const macd = ema12.map((v, i) => v - ema26[i]);
  const signal = calculateEMA(macd, 9);
  const histogram = macd.map((v, i) => v - signal[i]);
  
  return { macd, signal, histogram };
}

function calculateRSI(data: number[], period: number = 14): number[] {
  const changes = data.slice(1).map((value, index) => value - data[index]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);
  
  const avgGain = calculateSMA(gains, period)[0];
  const avgLoss = calculateSMA(losses, period)[0];
  
  const result = [100 - (100 / (1 + avgGain / avgLoss))];
  
  for (let i = period + 1; i < data.length; i++) {
    const gain = gains[i - 1];
    const loss = losses[i - 1];
    
    const newAvgGain = (avgGain * (period - 1) + gain) / period;
    const newAvgLoss = (avgLoss * (period - 1) + loss) / period;
    
    result.push(100 - (100 / (1 + newAvgGain / newAvgLoss)));
  }
  
  return result;
}

function calculateStochRSI(data: number[], period: number = 14): number[] {
  const rsi = calculateRSI(data, period);
  const result = [];
  
  for (let i = period - 1; i < rsi.length; i++) {
    const windowRsi = rsi.slice(i - period + 1, i + 1);
    const minRsi = Math.min(...windowRsi);
    const maxRsi = Math.max(...windowRsi);
    const stochRsi = (rsi[i] - minRsi) / (maxRsi - minRsi);
    result.push(stochRsi);
  }
  
  return result;
}

function calculateATR(klines: any[], period: number = 14): number[] {
  const trueRanges = klines.map((kline, i) => {
    if (i === 0) return kline.high - kline.low;
    
    const previousClose = klines[i - 1].close;
    return Math.max(
      kline.high - kline.low,
      Math.abs(kline.high - previousClose),
      Math.abs(kline.low - previousClose)
    );
  });
  
  return calculateSMA(trueRanges, period);
}

function calculateBollingerBands(data: number[], period: number = 20, multiplier: number = 2): {
  middle: number[],
  upper: number[],
  lower: number[]
} {
  const sma = calculateSMA(data, period);
  const stdDev = data.map((_, i) => {
    if (i < period - 1) return 0;
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const squaredDiffs = slice.map(x => Math.pow(x - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / period);
  });
  
  return {
    middle: sma,
    upper: sma.map((v, i) => v + multiplier * stdDev[i]),
    lower: sma.map((v, i) => v - multiplier * stdDev[i])
  };
}

function calculateDonchianChannels(klines: any[], period: number = 20): {
  high: number[],
  low: number[]
} {
  const result = {
    high: [],
    low: []
  };
  
  for (let i = period - 1; i < klines.length; i++) {
    const window = klines.slice(i - period + 1, i + 1);
    result.high.push(Math.max(...window.map(k => k.high)));
    result.low.push(Math.min(...window.map(k => k.low)));
  }
  
  return result;
}

function calculateCCI(klines: any[], period: number = 20): number[] {
  const typicalPrices = klines.map(k => (k.high + k.low + k.close) / 3);
  const sma = calculateSMA(typicalPrices, period);
  const meanDeviation = typicalPrices.map((_, i) => {
    if (i < period - 1) return 0;
    const slice = typicalPrices.slice(i - period + 1, i + 1);
    return slice.reduce((sum, price) => sum + Math.abs(price - sma[i]), 0) / period;
  });
  
  return typicalPrices.map((tp, i) => {
    if (i < period - 1) return 0;
    return (tp - sma[i]) / (0.015 * meanDeviation[i]);
  });
}

function calculateTrendDirection(data: number[], period: number = 20): string[] {
  const sma = calculateSMA(data, period);
  return sma.map((v, i) => {
    if (i === 0) return 'NEUTRAL';
    return v > sma[i - 1] ? 'UP' : v < sma[i - 1] ? 'DOWN' : 'NEUTRAL';
  });
}

function calculateSupportLevel(data: number[]): number {
  const lows = data.slice(-20);
  return Math.min(...lows);
}

function calculateResistanceLevel(data: number[]): number {
  const highs = data.slice(-20);
  return Math.max(...highs);
}