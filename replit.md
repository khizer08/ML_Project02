# WeatherAI - AI-Powered Weather Forecasting Platform

## Overview

WeatherAI is an intelligent weather forecasting platform that combines real-time meteorological data from OpenWeatherMap API with machine learning predictions. The application uses Linear Regression to predict temperature and Logistic Regression to classify weather conditions (Rain/No Rain, Cloudy/Clear). Built with a modern tech stack featuring React, TypeScript, Express, and Python-based ML models, the platform provides users with accurate weather forecasts alongside AI-powered predictions and comprehensive model insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, configured with hot module replacement (HMR)
- Client-side routing using Wouter (lightweight alternative to React Router)
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Custom query client with automatic error handling and 401 unauthorized behavior
- API request wrapper handling fetch operations with credentials and JSON serialization

**UI Component System**
- Shadcn UI component library (New York style) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens for glassmorphic weather-themed interface
- Component variants using class-variance-authority (CVA) for consistent styling patterns
- Design system emphasizing sky blue gradients, colorful accents, and weather-responsive backgrounds

**Typography & Design**
- Google Fonts: Inter (UI/body text) and Poppins (display/headlines)
- Glassmorphism effects with frosted glass cards, soft shadows, and elevated components
- Weather-driven visual language with dynamic backgrounds responding to conditions
- Responsive grid layouts for weather cards, forecasts, and ML model displays

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for API routes and middleware
- Development mode: Vite middleware integration for SSR-ready development experience
- Production mode: Static file serving from pre-built dist/public directory
- Custom logging middleware tracking request duration and JSON responses

**API Structure**
- RESTful endpoints for weather data (`/api/weather/current`, `/api/weather/forecast`)
- ML prediction endpoints (`/api/ml/linear-regression`, `/api/ml/logistic-regression`, `/api/ml/dataset-stats`)
- Integration layer between Express and Python ML scripts using child process spawning
- JSON-based communication protocol between Node.js and Python processes

**Python ML Integration**
- Standalone Python scripts for model training and prediction
- Models persisted using joblib for efficient serialization
- Separate scripts for linear regression (temperature prediction) and logistic regression (weather classification)
- Dataset statistics endpoint for model insights and visualization data

**Data Validation**
- Zod schemas for runtime type validation on both client and server
- Shared schema definitions between frontend and backend (`@shared/schema.ts`)
- Type-safe API contracts using TypeScript inference from Zod schemas

### Machine Learning Models

**Linear Regression Model**
- **Purpose**: Predict temperature based on meteorological features
- **Features**: humidity, pressure, wind_speed, clouds (4 input features)
- **Target**: temperature
- **Metrics**: MSE, RMSE, R² score
- **Training**: Scikit-learn LinearRegression with 80/20 train-test split
- **Storage**: Models and metrics saved as pickle files using joblib

**Logistic Regression Models**
- **Rain Prediction Model**: Binary classification for rain/no-rain conditions
- **Cloud Classification Model**: Binary classification for cloudy/clear conditions
- **Features**: temperature, humidity, pressure, wind_speed, clouds (5 input features)
- **Metrics**: accuracy, precision, recall, F1-score, confusion matrix
- **Training**: Scikit-learn LogisticRegression with max_iter=1000, random_state=42

**Model Workflow**
1. CSV dataset loaded from server-side storage (`server/data/weather_dataset.csv`)
2. Separate training scripts for linear and logistic regression models
3. Models trained once and persisted to disk
4. Prediction scripts load pre-trained models for real-time inference
5. Express API spawns Python processes to execute predictions

### External Dependencies

**Weather Data API**
- **OpenWeatherMap API**: Primary source for real-time weather data and 5-day forecasts
- **Environment Variable**: `OPENWEATHER_API_KEY` required for API authentication
- **Current Weather Endpoint**: Provides temperature, humidity, pressure, wind speed, clouds, description, icon
- **Forecast Endpoint**: Returns hourly predictions for 5 days with probability of precipitation

**Database & ORM**
- **Drizzle ORM**: SQL query builder and migration tool configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL provider (`@neondatabase/serverless`)
- **Database URL**: `DATABASE_URL` environment variable for connection string
- **Schema Location**: `shared/schema.ts` with Drizzle-Zod integration for type safety
- **Migration Path**: `./migrations` directory for database version control

**Python Libraries**
- **pandas**: Data manipulation and CSV processing
- **numpy**: Numerical computations for ML operations
- **scikit-learn**: Machine learning algorithms (LinearRegression, LogisticRegression)
- **joblib**: Model serialization and deserialization

**Data Visualization**
- **Recharts**: React charting library for weather trends and ML metrics
- **Chart Types**: LineChart (temperature/humidity trends), BarChart (dataset statistics), ScatterChart (correlation analysis)
- **Custom Theming**: Charts styled using HSL color variables from Tailwind config

**UI Dependencies**
- **Radix UI Primitives**: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Lucide React**: Icon library for weather and UI icons
- **Embla Carousel**: Touch-friendly carousel for mobile forecast displays
- **cmdk**: Command palette component for search functionality

**Development Tools**
- **Replit Vite Plugins**: Runtime error modal, cartographer (code navigation), dev banner
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server