import * as tf from '@tensorflow/tfjs';
import type { KlineData } from '../types/trading';

export class MLService {
  private model: tf.LayersModel | null = null;

  public async initialize() {
    this.model = tf.sequential({
      layers: [
        tf.layers.lstm({
          units: 50,
          returnSequences: true,
          inputShape: [10, 5],
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({ units: 30, returnSequences: false }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 1, activation: 'linear' }),
      ],
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
    });
  }

  private preprocessData(klines: KlineData[]): { features: tf.Tensor, labels: tf.Tensor } {
    const windowSize = 10;
    const features = [];
    const labels = [];

    for (let i = 0; i < klines.length - windowSize; i++) {
      const window = klines.slice(i, i + windowSize);
      const nextPrice = klines[i + windowSize].close;

      const windowFeatures = window.map(k => [
        k.open / k.close,
        k.high / k.close,
        k.low / k.close,
        k.volume,
        (k.high - k.low) / k.close,
      ]);

      features.push(windowFeatures);
      labels.push(nextPrice);
    }

    return {
      features: tf.tensor3d(features),
      labels: tf.tensor2d(labels.map(l => [l])),
    };
  }

  public async train(klines: KlineData[]) {
    if (!this.model) throw new Error('Model not initialized');

    const { features, labels } = this.preprocessData(klines);

    await this.model.fit(features, labels, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss}`);
        },
      },
    });

    features.dispose();
    labels.dispose();
  }

  public async predict(klines: KlineData[]): Promise<number> {
    if (!this.model) throw new Error('Model not initialized');

    const lastWindow = klines.slice(-10);
    const features = tf.tensor3d([[
      lastWindow.map(k => [
        k.open / k.close,
        k.high / k.close,
        k.low / k.close,
        k.volume,
        (k.high - k.low) / k.close,
      ]),
    ]]);

    const prediction = this.model.predict(features) as tf.Tensor;
    const result = await prediction.data();

    features.dispose();
    prediction.dispose();

    return result[0];
  }
}