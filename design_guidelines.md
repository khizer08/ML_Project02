# Design Guidelines: AI-Powered Weather Forecasting Website

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern weather apps (Apple Weather, Weather.com) combined with data visualization platforms (Linear, Notion) to create a colorful, glassmorphic interface that balances aesthetic appeal with functional data display.

## Core Design Principles

1. **Weather-Driven Visual Language**: UI responds to weather conditions with themed backgrounds and animations
2. **Glassmorphism & Depth**: Layered cards with frosted glass effects, soft shadows, and elevated components
3. **Data Clarity**: Complex ML metrics presented through clean visualizations and digestible cards
4. **Colorful & Energetic**: Sky blue base with gradient accents, vibrant weather condition colors

---

## Typography System

**Font Families** (Google Fonts):
- Primary: 'Inter' - UI text, body content, data labels
- Display: 'Poppins' - Headlines, page titles, hero text (600-700 weight)

**Type Scale**:
- Hero Headlines: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Titles: text-3xl md:text-4xl, font-semibold
- Card Headers: text-xl md:text-2xl, font-semibold
- Body Text: text-base md:text-lg
- Labels/Metrics: text-sm md:text-base, font-medium
- Small Data: text-xs md:text-sm

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20** consistently
- Component padding: p-6 to p-8
- Section spacing: py-16 md:py-20 lg:py-24
- Card gaps: gap-6 md:gap-8
- Element margins: mb-4, mt-6, mx-8

**Container Strategy**:
- Full-width sections with max-w-7xl inner containers
- Content sections: max-w-6xl
- Forms and inputs: max-w-2xl

**Grid Patterns**:
- Weather cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- ML model sections: grid-cols-1 lg:grid-cols-2
- Forecast items: grid-cols-2 md:grid-cols-4 lg:grid-cols-7

---

## Component Library

### Navigation
- Sticky header with frosted glass background (backdrop-blur-lg)
- Logo left, navigation center, weather toggle/search right
- Mobile: Hamburger menu with slide-in drawer
- Height: h-16 md:h-20

### Homepage Hero
**Layout**: Full viewport height (min-h-screen) with animated weather background
**Structure**:
- Centered content with max-w-4xl
- Large temperature display (text-8xl md:text-9xl)
- City name and current conditions below
- 4-column metric grid (temp, humidity, wind, pressure) below temperature
- CTA buttons row: "5-Day Forecast" + "ML Predictions" (gap-4)

**Images**: Dynamic weather background (full-screen, low opacity overlay) - sunny skies, rain, clouds, or night stars based on conditions. Use high-quality weather photography as full-bleed backgrounds.

### Weather Cards (Glassmorphic)
- Rounded-2xl with backdrop-blur-md
- Padding: p-6 md:p-8
- Border: border border-white/20
- Shadow: shadow-xl
- Gradient overlays for depth
- Weather icon top, metric large center, label below

### Forecast Page
**Structure**:
- 7-day horizontal scroll cards on mobile, grid on desktop
- Each card: rounded-xl, p-6, weather icon, high/low temps, conditions
- Hourly forecast: horizontal scrollable timeline with temperature curve overlay
- Charts section: 2-column grid (temperature trends + precipitation probability)

### ML Models Page
**Linear Regression Section**:
- Split layout: Form inputs left (max-w-md), results visualization right
- Input form: Grouped fields (humidity, pressure, wind speed) with modern input styling
- Results: Large prediction value display + regression plot below
- Metrics cards: 3-column grid (RMSE, MSE, R²) with gradient backgrounds

**Logistic Regression Section**:
- Similar split layout
- Classification form with dropdowns/toggles
- Results: Prediction badge (large, colorful) + confidence percentage
- Confusion matrix: Visual grid with color-coded cells
- Accuracy metrics: 4-column grid (accuracy, precision, recall, F1)

### Model Insights Page
**Dataset Section**:
- Feature table with striped rows
- Statistics cards: 2-3 column grid showing mean, median, std dev
- Scatter plot matrix: full-width visualization

**Training Pipeline**:
- Horizontal step-by-step visualization (icons + arrows)
- Each step: rounded card with icon, title, description

### Charts & Visualizations
- Full-width chart containers with p-6 md:p-8
- Clean axis labels, grid lines at 20% opacity
- Colorful data points matching weather theme
- Legend positioned top-right

### Forms
- Input fields: rounded-lg, p-4, border-2 with focus states
- Labels: text-sm font-medium, mb-2
- Button groups: flex gap-4
- Submit buttons: Large (px-8 py-4), rounded-full, with icon

### Footer
- 3-column grid: About/Dataset Info | Quick Links | Contact
- Newsletter signup centered below columns
- Social icons row
- Background: Subtle gradient overlay
- Padding: py-12 md:py-16

---

## Images Strategy

**Homepage**: Full-screen dynamic weather background (sunny/rainy/cloudy/night)
**Forecast Page**: Weather condition icons throughout (use Heroicons or similar)
**ML Pages**: Dataset visualization thumbnails, training pipeline illustrations
**About Page**: Technology stack logos, data source badges

**Hero Image Treatment**: 
- Full-bleed background with gradient overlay (opacity 40-60%)
- Buttons on images: backdrop-blur-md background, white/10 border

---

## Animations

**Micro-interactions** (minimal, purposeful):
- Card hover: Subtle lift (transform: translateY(-4px))
- Button hover: Slight scale (1.02)
- Weather icon pulse on load
- Chart animations: Fade-in on scroll
- Temperature counter: Animated count-up on page load

**Page Transitions**: Smooth fade between routes (200ms)

---

## Accessibility

- All inputs with proper labels and aria-attributes
- Sufficient contrast ratios maintained across all text
- Focus indicators on all interactive elements
- Keyboard navigation fully supported
- Alt text for all weather icons and images