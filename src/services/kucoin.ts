import axios from 'axios';
import type { KlineData } from '../types/trading';

const KUCOIN_API_URL = 'https://api.kucoin.com';

export class KuCoinService {
  private static instance: KuCoinService;
  private apiKey: string = '';
  private secretKey: string = '';
  private passphrase: string = '';
  private isInitialized: boolean = false;
  private isDemoMode: boolean = false;

  private constructor() {}

  static getInstance(): KuCoinService {
    if (!KuCoinService.instance) {
      KuCoinService.instance = new KuCoinService();
    }
    return KuCoinService.instance;
  }

  async initialize(apiKey: string, secretKey: string, passphrase: string): Promise<void> {
    if (apiKey === 'demo' && secretKey === 'demo' && passphrase === 'demo') {
      this.isDemoMode = true;
      this.isInitialized = true;
      return;
    }

    if (!apiKey || !secretKey || !passphrase) {
      throw new Error('API credentials are required for initialization');
    }
    
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.passphrase = passphrase;
    this.isInitialized = true;
  }

  async getKlines(symbol: string, interval: string): Promise<KlineData[]> {
    if (!this.isInitialized) {
      throw new Error('KuCoin service not initialized');
    }

    if (this.isDemoMode) {
      return this.getDemoKlines();
    }

    try {
      const response = await axios.get(`${KUCOIN_API_URL}/api/v1/market/histories`, {
        params: {
          symbol,
        },
        headers: {
          'KC-API-KEY': this.apiKey,
          'KC-API-SIGN': this.secretKey,
          'KC-API-PASSPHRASE': this.passphrase,
          'KC-API-TIMESTAMP': Date.now().toString(),
        },
      });

      return response.data.data.map((item: any) => ({
        timestamp: new Date(item.time).getTime(),
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
        volume: parseFloat(item.volume),
      }));
    } catch (error) {
      console.error('Failed to fetch KuCoin data:', error);
      return this.getDemoKlines();
    }
  }

  private getDemoKlines(): KlineData[] {
    const basePrice = 40000;
    const now = Date.now();
    return Array.from({ length: 100 }, (_, i) => ({
      timestamp: now - i * 60000,
      open: basePrice + Math.random() * 1000,
      high: basePrice + 1000 + Math.random() * 1000,
      low: basePrice - 1000 + Math.random() * 1000,
      close: basePrice + Math.random() * 1000,
      volume: 10 + Math.random() * 5
    }));
  }
}