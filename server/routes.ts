import type { Express } from "express";
import { createServer, type Server } from "http";
import { spawn } from "child_process";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

  if (!OPENWEATHER_API_KEY) {
    console.error("Warning: OPENWEATHER_API_KEY not set");
  }

  // Helper function to call Python ML scripts
  async function callPythonScript(scriptName: string, args: string[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonPath = "python";
      const scriptPath = path.join(__dirname, "ml_models", scriptName);
      
      const pythonProcess = spawn(pythonPath, [scriptPath, ...args]);
      
      let stdout = "";
      let stderr = "";

      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${stderr}`));
          return;
        }
        
        try {
          // Find JSON in output
          const jsonMatch = stdout.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            resolve(result);
          } else {
            reject(new Error("No JSON output from Python script"));
          }
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error}`));
        }
      });
    });
  }

  // Current Weather Endpoint
  app.get("/api/weather/current", async (req, res) => {
    try {
      const city = req.query.city as string || "London";
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: "Failed to fetch weather data" 
        });
      }

      const data = await response.json();

      const weatherData = {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind_speed: data.wind.speed,
        clouds: data.clouds.all,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name,
        country: data.sys.country,
        dt: data.dt,
      };

      res.json(weatherData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch weather data" 
      });
    }
  });

  // 5-Day Forecast Endpoint
  app.get("/api/weather/forecast", async (req, res) => {
    try {
      const city = req.query.city as string || "London";
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: "Failed to fetch forecast data" 
        });
      }

      const data = await response.json();

      const forecastData = {
        city: data.city.name,
        country: data.city.country,
        list: data.list.map((item: any) => ({
          dt: item.dt,
          temp: item.main.temp,
          feels_like: item.main.feels_like,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          pressure: item.main.pressure,
          wind_speed: item.wind.speed,
          clouds: item.clouds.all,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          pop: item.pop || 0,
        })),
      };

      res.json(forecastData);
    } catch (error) {
      console.error("Forecast API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch forecast data" 
      });
    }
  });

  // Linear Regression Prediction
  app.post("/api/ml/linear-regression", async (req, res) => {
    try {
      const { humidity, pressure, wind_speed, clouds } = req.body;

      if (
        typeof humidity !== "number" ||
        typeof pressure !== "number" ||
        typeof wind_speed !== "number" ||
        typeof clouds !== "number"
      ) {
        return res.status(400).json({ 
          error: "Invalid input data" 
        });
      }

      // Call Python prediction script
      const result = await callPythonScript("predict_linear.py", [
        humidity.toString(),
        pressure.toString(),
        wind_speed.toString(),
        clouds.toString(),
      ]);

      res.json(result);
    } catch (error) {
      console.error("Linear regression error:", error);
      res.status(500).json({ 
        error: "Failed to make prediction" 
      });
    }
  });

  // Logistic Regression Classification
  app.post("/api/ml/logistic-regression", async (req, res) => {
    try {
      const { temperature, humidity, pressure, wind_speed, clouds } = req.body;

      if (
        typeof temperature !== "number" ||
        typeof humidity !== "number" ||
        typeof pressure !== "number" ||
        typeof wind_speed !== "number" ||
        typeof clouds !== "number"
      ) {
        return res.status(400).json({ 
          error: "Invalid input data" 
        });
      }

      // Call Python classification script
      const result = await callPythonScript("predict_logistic.py", [
        temperature.toString(),
        humidity.toString(),
        pressure.toString(),
        wind_speed.toString(),
        clouds.toString(),
      ]);

      res.json(result);
    } catch (error) {
      console.error("Logistic regression error:", error);
      res.status(500).json({ 
        error: "Failed to classify weather" 
      });
    }
  });

  // Dataset Statistics
  app.get("/api/ml/dataset-stats", async (req, res) => {
    try {
      const result = await callPythonScript("get_stats.py");
      res.json(result);
    } catch (error) {
      console.error("Dataset stats error:", error);
      res.status(500).json({ 
        error: "Failed to get dataset statistics" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
