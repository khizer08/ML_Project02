import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Cloud, Droplets, Wind, Gauge, CloudRain, TrendingUp, Search, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeatherData } from "@shared/schema";

export default function Home() {
  const [city, setCity] = useState("London");
  const [searchCity, setSearchCity] = useState("London");

  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ["/api/weather/current", city],
  });

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCity(searchCity.trim());
    }
  };

  const getWeatherGradient = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes("clear") || desc.includes("sun")) {
      return "from-amber-400 via-orange-400 to-yellow-500";
    } else if (desc.includes("cloud")) {
      return "from-slate-400 via-gray-400 to-slate-500";
    } else if (desc.includes("rain")) {
      return "from-blue-400 via-cyan-500 to-blue-600";
    } else if (desc.includes("storm")) {
      return "from-slate-600 via-gray-700 to-slate-800";
    }
    return "from-primary via-chart-2 to-chart-3";
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero Section */}
      <div className={`relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br ${weather ? getWeatherGradient(weather.description) : 'from-primary via-chart-2 to-chart-3'} overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Search Bar */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-2 shadow-xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  <Input
                    type="text"
                    placeholder="Enter city name..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-12 bg-white/5 border-0 text-white placeholder:text-white/60 h-12 text-lg focus-visible:ring-white/30"
                    data-testid="input-city-search"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md gap-2"
                  data-testid="button-search-city"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Weather Display */}
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-64 mx-auto bg-white/20" />
              <Skeleton className="h-32 w-96 mx-auto bg-white/20" />
              <Skeleton className="h-8 w-48 mx-auto bg-white/20" />
            </div>
          ) : weather ? (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2">
                <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white drop-shadow-lg" data-testid="text-city-name">
                  {weather.city}
                </h1>
                <p className="text-xl md:text-2xl text-white/90" data-testid="text-country">
                  {weather.country}
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-8xl md:text-9xl font-display font-bold text-white drop-shadow-2xl" data-testid="text-temperature">
                  {Math.round(weather.temp)}°
                </div>
                <p className="text-2xl md:text-3xl text-white/90 capitalize" data-testid="text-description">
                  {weather.description}
                </p>
                <p className="text-lg text-white/80" data-testid="text-feels-like">
                  Feels like {Math.round(weather.feels_like)}°
                </p>
              </div>

              {/* Weather Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
                <Card className="backdrop-blur-md bg-white/10 border-white/20 p-6 hover-elevate">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Droplets className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white/70">Humidity</p>
                      <p className="text-2xl font-semibold text-white" data-testid="text-humidity">
                        {weather.humidity}%
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="backdrop-blur-md bg-white/10 border-white/20 p-6 hover-elevate">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Wind className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white/70">Wind</p>
                      <p className="text-2xl font-semibold text-white" data-testid="text-wind-speed">
                        {weather.wind_speed} m/s
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="backdrop-blur-md bg-white/10 border-white/20 p-6 hover-elevate">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Gauge className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white/70">Pressure</p>
                      <p className="text-2xl font-semibold text-white" data-testid="text-pressure">
                        {weather.pressure} hPa
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="backdrop-blur-md bg-white/10 border-white/20 p-6 hover-elevate">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Cloud className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-white/70">Clouds</p>
                      <p className="text-2xl font-semibold text-white" data-testid="text-clouds">
                        {weather.clouds}%
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mt-12">
                <Link href="/forecast">
                  <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md gap-2 px-8" data-testid="button-view-forecast">
                    <CloudRain className="w-5 h-5" />
                    5-Day Forecast
                  </Button>
                </Link>
                <Link href="/ml-models">
                  <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md gap-2 px-8" data-testid="button-ml-predictions">
                    <TrendingUp className="w-5 h-5" />
                    ML Predictions
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-white">
              <p className="text-xl">No weather data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
