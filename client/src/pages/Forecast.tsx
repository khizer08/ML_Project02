import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cloud, Droplets, Wind, MapPin, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ForecastData } from "@shared/schema";

export default function Forecast() {
  const [city, setCity] = useState("London");
  const [searchCity, setSearchCity] = useState("London");

  const { data: forecast, isLoading } = useQuery<ForecastData>({
    queryKey: ["/api/weather/forecast", city],
  });

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity.trim());
    }
  };

  // Group forecast by days (take one reading per day at noon)
  const dailyForecast = forecast?.list.filter((_, index) => index % 8 === 0).slice(0, 7) || [];

  // Prepare chart data
  const chartData = forecast?.list.slice(0, 40).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
    temperature: Math.round(item.temp),
    humidity: item.humidity,
    precipitation: Math.round(item.pop * 100),
  })) || [];

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 bg-gradient-to-br from-background via-primary/5 to-chart-2/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-6">
          <div>
            <h1 className="font-display font-bold text-4xl md:text-5xl bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Weather Forecast
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              5-day hourly weather predictions
            </p>
          </div>

          {/* Search Bar */}
          <Card className="max-w-2xl">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter city name..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                    data-testid="input-forecast-city"
                  />
                </div>
                <Button onClick={handleSearch} data-testid="button-search-forecast">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        ) : forecast ? (
          <div className="space-y-8 animate-fade-in">
            {/* Current Location */}
            <div className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-semibold" data-testid="text-forecast-location">
                {forecast.city}, {forecast.country}
              </span>
            </div>

            {/* Temperature Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  Temperature & Humidity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Temperature (°C)" />
                    <Line type="monotone" dataKey="humidity" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Humidity (%)" />
                    <Line type="monotone" dataKey="precipitation" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Precipitation (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Forecast Cards */}
            <div>
              <h2 className="text-2xl font-display font-semibold mb-4">7-Day Forecast</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {dailyForecast.map((day, index) => {
                  const date = new Date(day.dt * 1000);
                  const dayName = index === 0 ? "Today" : date.toLocaleDateString('en-US', { weekday: 'short' });

                  return (
                    <Card key={day.dt} className="hover-elevate" data-testid={`card-forecast-day-${index}`}>
                      <CardContent className="p-6 text-center space-y-4">
                        <p className="font-semibold text-lg">{dayName}</p>
                        <img
                          src={getWeatherIcon(day.icon)}
                          alt={day.description}
                          className="w-16 h-16 mx-auto"
                        />
                        <div className="space-y-1">
                          <p className="text-3xl font-bold" data-testid={`text-day-${index}-temp`}>
                            {Math.round(day.temp)}°
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {day.description}
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Droplets className="w-3 h-3" />
                              Humidity
                            </span>
                            <span className="font-medium">{day.humidity}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Wind className="w-3 h-3" />
                              Wind
                            </span>
                            <span className="font-medium">{day.wind_speed} m/s</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Cloud className="w-3 h-3" />
                              Rain
                            </span>
                            <span className="font-medium">{Math.round(day.pop * 100)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No forecast data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
