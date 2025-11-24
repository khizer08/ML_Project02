import { Brain, Cloud, TrendingUp, Database, Cpu, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const technologies = [
    { name: "React", category: "Frontend" },
    { name: "TypeScript", category: "Language" },
    { name: "Express", category: "Backend" },
    { name: "Python", category: "ML" },
    { name: "scikit-learn", category: "ML" },
    { name: "OpenWeatherMap API", category: "Data" },
    { name: "Recharts", category: "Visualization" },
    { name: "Tailwind CSS", category: "Styling" },
  ];

  const features = [
    {
      icon: Cloud,
      title: "Real-Time Weather",
      description: "Live weather data powered by OpenWeatherMap API with current conditions and 5-day forecasts.",
    },
    {
      icon: Brain,
      title: "Machine Learning",
      description: "AI-powered predictions using Linear and Logistic Regression models trained on historical data.",
    },
    {
      icon: TrendingUp,
      title: "Temperature Prediction",
      description: "Linear Regression model predicts temperature based on humidity, pressure, wind speed, and cloud cover.",
    },
    {
      icon: Database,
      title: "Weather Classification",
      description: "Logistic Regression classifies weather conditions (Rain/No Rain, Cloudy/Clear) with high accuracy.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 bg-gradient-to-br from-background via-primary/5 to-chart-2/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent mb-4">
            About WeatherAI
          </h1>
          <p className="text-lg text-muted-foreground">
            An intelligent weather forecasting platform combining real-time meteorological data with machine learning predictions.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-8">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display font-semibold text-3xl mb-4">
                  The Future of Weather Prediction
                </h2>
                <p className="text-muted-foreground mb-4">
                  WeatherAI leverages cutting-edge machine learning algorithms to provide accurate weather predictions and classifications. 
                  Our platform combines traditional weather APIs with custom-trained ML models to deliver insights beyond standard forecasts.
                </p>
                <p className="text-muted-foreground">
                  Built with modern web technologies and powered by Python's scikit-learn library, WeatherAI demonstrates the 
                  practical application of Linear and Logistic Regression in meteorological predictions.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-chart-2 rounded-3xl rotate-6 opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-3 to-chart-4 rounded-3xl -rotate-6 opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="font-display font-semibold text-3xl mb-6 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Technology Stack</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Built with modern, industry-standard technologies
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {technologies.map((tech, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg text-center hover-elevate">
                  <Code className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium mb-1">{tech.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {tech.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ML Model Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Machine Learning Models
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Linear Regression Model</h3>
              <p className="text-muted-foreground mb-3">
                Predicts continuous temperature values based on multiple weather features including humidity, 
                atmospheric pressure, wind speed, and cloud coverage. The model is trained on historical weather 
                data and evaluated using RMSE, MSE, and R² metrics.
              </p>
              <div className="flex gap-2">
                <Badge>Temperature Prediction</Badge>
                <Badge>Regression Analysis</Badge>
                <Badge>Multi-feature Input</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Logistic Regression Model</h3>
              <p className="text-muted-foreground mb-3">
                Classifies weather conditions into binary categories: Rain vs. No Rain, and Cloudy vs. Clear. 
                The model outputs probability scores and is evaluated using accuracy, precision, recall, and F1 score metrics.
              </p>
              <div className="flex gap-2">
                <Badge>Binary Classification</Badge>
                <Badge>Probability Estimation</Badge>
                <Badge>High Accuracy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Source */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Real-Time Weather Data</h3>
              <p className="text-muted-foreground">
                Current weather conditions and forecasts are provided by the OpenWeatherMap API, 
                a reliable source for meteorological data used by millions of applications worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">ML Training Dataset</h3>
              <p className="text-muted-foreground">
                Our machine learning models are trained on a curated dataset of historical weather observations, 
                containing over 100 samples with features including temperature, humidity, pressure, wind speed, 
                cloud cover, and weather classifications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
