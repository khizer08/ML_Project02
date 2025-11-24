import { z } from "zod";

// Weather Data Types
export const weatherDataSchema = z.object({
  temp: z.number(),
  feels_like: z.number(),
  humidity: z.number(),
  pressure: z.number(),
  wind_speed: z.number(),
  clouds: z.number(),
  description: z.string(),
  icon: z.string(),
  city: z.string(),
  country: z.string(),
  dt: z.number(),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;

// Forecast Data Types
export const forecastItemSchema = z.object({
  dt: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  temp_min: z.number(),
  temp_max: z.number(),
  humidity: z.number(),
  pressure: z.number(),
  wind_speed: z.number(),
  clouds: z.number(),
  description: z.string(),
  icon: z.string(),
  pop: z.number(), // probability of precipitation
});

export type ForecastItem = z.infer<typeof forecastItemSchema>;

export const forecastDataSchema = z.object({
  list: z.array(forecastItemSchema),
  city: z.string(),
  country: z.string(),
});

export type ForecastData = z.infer<typeof forecastDataSchema>;

// ML Prediction Types
export const linearRegressionInputSchema = z.object({
  humidity: z.number().min(0).max(100),
  pressure: z.number().min(900).max(1100),
  wind_speed: z.number().min(0).max(50),
  clouds: z.number().min(0).max(100),
});

export type LinearRegressionInput = z.infer<typeof linearRegressionInputSchema>;

export const linearRegressionOutputSchema = z.object({
  predicted_temperature: z.number(),
  metrics: z.object({
    rmse: z.number(),
    mse: z.number(),
    r2_score: z.number(),
  }),
});

export type LinearRegressionOutput = z.infer<typeof linearRegressionOutputSchema>;

export const logisticRegressionInputSchema = z.object({
  temperature: z.number(),
  humidity: z.number().min(0).max(100),
  pressure: z.number().min(900).max(1100),
  wind_speed: z.number().min(0).max(50),
  clouds: z.number().min(0).max(100),
});

export type LogisticRegressionInput = z.infer<typeof logisticRegressionInputSchema>;

export const logisticRegressionOutputSchema = z.object({
  rain_prediction: z.string(), // "Rain" or "No Rain"
  rain_probability: z.number(),
  cloudiness_prediction: z.string(), // "Cloudy" or "Clear"
  cloudiness_probability: z.number(),
  metrics: z.object({
    accuracy: z.number(),
    precision: z.number(),
    recall: z.number(),
    f1_score: z.number(),
  }),
  confusion_matrix: z.object({
    true_positive: z.number(),
    true_negative: z.number(),
    false_positive: z.number(),
    false_negative: z.number(),
  }),
});

export type LogisticRegressionOutput = z.infer<typeof logisticRegressionOutputSchema>;

// Dataset Statistics Types
export const datasetStatsSchema = z.object({
  total_records: z.number(),
  features: z.array(z.string()),
  statistics: z.record(z.object({
    mean: z.number(),
    median: z.number(),
    std: z.number(),
    min: z.number(),
    max: z.number(),
  })),
  sample_data: z.array(z.record(z.union([z.number(), z.string()]))),
});

export type DatasetStats = z.infer<typeof datasetStatsSchema>;
