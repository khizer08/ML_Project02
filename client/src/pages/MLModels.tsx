
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Brain, TrendingUp, Target, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type {
  LinearRegressionInput,
  LinearRegressionOutput,
  LogisticRegressionInput,
  LogisticRegressionOutput,
} from "@shared/schema";

export default function MLModels() {
  const { toast } = useToast();

  // Linear Regression State
  const [linearInput, setLinearInput] = useState<LinearRegressionInput>({
    humidity: 70,
    pressure: 1013,
    wind_speed: 5,
    clouds: 50,
  });

  // Logistic Regression State
  const [logisticInput, setLogisticInput] = useState<LogisticRegressionInput>({
    temperature: 22,
    humidity: 70,
    pressure: 1013,
    wind_speed: 5,
    clouds: 50,
  });

  // Linear Regression Mutation
  const linearMutation = useMutation<LinearRegressionOutput, Error, LinearRegressionInput>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/ml/linear-regression", data);
      const json = await res.json();
      console.log("Linear response:", json);
      return json as LinearRegressionOutput;
    },
    onSuccess: () => {
      toast({
        title: "Prediction Complete",
        description: "Temperature prediction generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Prediction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logistic Regression Mutation
  const logisticMutation = useMutation<LogisticRegressionOutput, Error, LogisticRegressionInput>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/ml/logistic-regression", data);
      const json = await res.json();
      console.log("Logistic response:", json);
      return json as LogisticRegressionOutput;
    },
    onSuccess: () => {
      toast({
        title: "Classification Complete",
        description: "Weather classification generated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Classification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLinearPredict = () => {
    linearMutation.mutate(linearInput);
  };

  const handleLogisticPredict = () => {
    logisticMutation.mutate(logisticInput);
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 bg-gradient-to-br from-background via-primary/5 to-chart-2/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Machine Learning Models
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            AI-powered weather predictions using regression models
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Linear Regression */}
          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Linear Regression</CardTitle>
                  <CardDescription>Predict temperature based on weather conditions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linear-humidity">Humidity (%)</Label>
                  <Input
                    id="linear-humidity"
                    type="number"
                    min="0"
                    max="100"
                    value={linearInput.humidity}
                    onChange={(e) =>
                      setLinearInput({ ...linearInput, humidity: parseFloat(e.target.value) })
                    }
                    data-testid="input-linear-humidity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linear-pressure">Pressure (hPa)</Label>
                  <Input
                    id="linear-pressure"
                    type="number"
                    min="900"
                    max="1100"
                    value={linearInput.pressure}
                    onChange={(e) =>
                      setLinearInput({ ...linearInput, pressure: parseFloat(e.target.value) })
                    }
                    data-testid="input-linear-pressure"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linear-wind">Wind Speed (m/s)</Label>
                  <Input
                    id="linear-wind"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={linearInput.wind_speed}
                    onChange={(e) =>
                      setLinearInput({ ...linearInput, wind_speed: parseFloat(e.target.value) })
                    }
                    data-testid="input-linear-wind"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linear-clouds">Cloud Cover (%)</Label>
                  <Input
                    id="linear-clouds"
                    type="number"
                    min="0"
                    max="100"
                    value={linearInput.clouds}
                    onChange={(e) =>
                      setLinearInput({ ...linearInput, clouds: parseFloat(e.target.value) })
                    }
                    data-testid="input-linear-clouds"
                  />
                </div>

                <Button
                  onClick={handleLinearPredict}
                  disabled={linearMutation.isPending}
                  className="w-full gap-2"
                  size="lg"
                  data-testid="button-predict-linear"
                >
                  {linearMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  Predict Temperature
                </Button>
              </div>

              {/* Results */}
              {linearMutation.data && (
                <div className="space-y-4 p-6 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Predicted Temperature</p>
                    <p
                      className="text-5xl font-display font-bold text-primary"
                      data-testid="text-predicted-temp"
                    >
                      {linearMutation.data?.predicted_temperature != null
                        ? `${linearMutation.data.predicted_temperature.toFixed(1)}°C`
                        : "–"}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">RMSE</p>
                      <Badge variant="secondary" data-testid="text-rmse">
                        {linearMutation.data?.metrics?.rmse != null
                          ? linearMutation.data.metrics.rmse.toFixed(2)
                          : "–"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">MSE</p>
                      <Badge variant="secondary" data-testid="text-mse">
                        {linearMutation.data?.metrics?.mse != null
                          ? linearMutation.data.metrics.mse.toFixed(2)
                          : "–"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">R² Score</p>
                      <Badge variant="secondary" data-testid="text-r2">
                        {linearMutation.data?.metrics?.r2_score != null
                          ? linearMutation.data.metrics.r2_score.toFixed(3)
                          : "–"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logistic Regression */}
          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chart-3 to-chart-4 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle>Logistic Regression</CardTitle>
                  <CardDescription>
                    Classify weather conditions (Rain/Clear, Cloudy/Clear)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logistic-temp">Temperature (°C)</Label>
                  <Input
                    id="logistic-temp"
                    type="number"
                    value={logisticInput.temperature}
                    onChange={(e) =>
                      setLogisticInput({
                        ...logisticInput,
                        temperature: parseFloat(e.target.value),
                      })
                    }
                    data-testid="input-logistic-temp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logistic-humidity">Humidity (%)</Label>
                  <Input
                    id="logistic-humidity"
                    type="number"
                    min="0"
                    max="100"
                    value={logisticInput.humidity}
                    onChange={(e) =>
                      setLogisticInput({
                        ...logisticInput,
                        humidity: parseFloat(e.target.value),
                      })
                    }
                    data-testid="input-logistic-humidity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logistic-pressure">Pressure (hPa)</Label>
                  <Input
                    id="logistic-pressure"
                    type="number"
                    min="900"
                    max="1100"
                    value={logisticInput.pressure}
                    onChange={(e) =>
                      setLogisticInput({
                        ...logisticInput,
                        pressure: parseFloat(e.target.value),
                      })
                    }
                    data-testid="input-logistic-pressure"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logistic-wind">Wind Speed (m/s)</Label>
                  <Input
                    id="logistic-wind"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={logisticInput.wind_speed}
                    onChange={(e) =>
                      setLogisticInput({
                        ...logisticInput,
                        wind_speed: parseFloat(e.target.value),
                      })
                    }
                    data-testid="input-logistic-wind"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logistic-clouds">Cloud Cover (%)</Label>
                  <Input
                    id="logistic-clouds"
                    type="number"
                    min="0"
                    max="100"
                    value={logisticInput.clouds}
                    onChange={(e) =>
                      setLogisticInput({
                        ...logisticInput,
                        clouds: parseFloat(e.target.value),
                      })
                    }
                    data-testid="input-logistic-clouds"
                  />
                </div>

                <Button
                  onClick={handleLogisticPredict}
                  disabled={logisticMutation.isPending}
                  className="w-full gap-2"
                  size="lg"
                  data-testid="button-predict-logistic"
                >
                  {logisticMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  Classify Weather
                </Button>
              </div>

              {/* Results */}
              {logisticMutation.data && (
                <div className="space-y-4 p-6 bg-chart-3/10 rounded-lg border border-chart-3/20 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center space-y-2 p-4 bg-background rounded-lg">
                      <p className="text-sm text-muted-foreground">Rain Prediction</p>
                      <Badge
                        variant={
                          logisticMutation.data.rain_prediction === "Rain"
                            ? "default"
                            : "secondary"
                        }
                        className="text-lg px-4 py-2"
                        data-testid="text-rain-prediction"
                      >
                        {logisticMutation.data.rain_prediction}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {logisticMutation.data?.rain_probability != null
                          ? `${(logisticMutation.data.rain_probability * 100).toFixed(
                              1,
                            )}% confidence`
                          : "–"}
                      </p>
                    </div>

                    <div className="text-center space-y-2 p-4 bg-background rounded-lg">
                      <p className="text-sm text-muted-foreground">Cloudiness</p>
                      <Badge
                        variant={
                          logisticMutation.data.cloudiness_prediction === "Cloudy"
                            ? "default"
                            : "secondary"
                        }
                        className="text-lg px-4 py-2"
                        data-testid="text-cloudiness-prediction"
                      >
                        {logisticMutation.data.cloudiness_prediction}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {logisticMutation.data?.cloudiness_probability != null
                          ? `${(logisticMutation.data.cloudiness_probability * 100).toFixed(
                              1,
                            )}% confidence`
                          : "–"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="font-medium" data-testid="text-accuracy">
                        {logisticMutation.data?.metrics?.accuracy != null
                          ? `${(logisticMutation.data.metrics.accuracy * 100).toFixed(1)}%`
                          : "–"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precision:</span>
                      <span className="font-medium" data-testid="text-precision">
                        {logisticMutation.data?.metrics?.precision != null
                          ? `${(logisticMutation.data.metrics.precision * 100).toFixed(1)}%`
                          : "–"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recall:</span>
                      <span className="font-medium" data-testid="text-recall">
                        {logisticMutation.data?.metrics?.recall != null
                          ? `${(logisticMutation.data.metrics.recall * 100).toFixed(1)}%`
                          : "–"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">F1 Score:</span>
                      <span className="font-medium" data-testid="text-f1">
                        {logisticMutation.data?.metrics?.f1_score != null
                          ? logisticMutation.data.metrics.f1_score.toFixed(3)
                          : "–"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
