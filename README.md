# Hurricane Simulation Dashboard

This React + Vite application provides a comprehensive hurricane rescue mission control dashboard with real-time robot tracking, telemetry, and AI-powered image generation capabilities.

## Features

### Mission Control Dashboard
- Real-time robot tracking and telemetry
- Interactive map with various layer overlays
- Timeline playback of mission data
- Multi-robot management interface

### AI-Powered Nano Banana Generator
The dashboard includes an innovative **Nano Banana** feature that uses Google's Generative AI to create artistic images of nano banana dishes with a Gemini theme. This feature demonstrates the integration of advanced AI capabilities into operational dashboards.

**Key Features:**
- Uses Google's Gemini 3.1 Flash Image Preview model
- Generates high-quality AI images on demand
- Secure API key management through environment variables
- Image download functionality
- Integrated seamlessly into the mission control interface

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   Create a `.env` file in the root directory and add your Google GenAI API key:
   ```
   VITE_GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Usage

### Mission Control
- Select different robots from the left panel
- Toggle map layers (planned routes, hazards, flood zones, targets)
- Use the timeline controls to replay mission data
- Monitor real-time telemetry in the right panel

### Nano Banana Generator
- Navigate to the "AI Tools" section in the left panel
- Click "Generate Nano Banana" to create a new AI image
- Download generated images using the download button
- All images feature nano banana dishes in fancy restaurant settings with Gemini themes

## Security

- API keys are stored securely in environment variables
- The `.env` file is included in `.gitignore` to prevent accidental commits
- No sensitive data is hardcoded in the application

## Technology Stack

- **React 19.2.4** - Modern React with hooks
- **Vite 8.0.1** - Fast build tool and dev server
- **Leaflet** - Interactive maps
- **Lucide React** - Beautiful icons
- **Google GenAI** - AI image generation
- **CSS Grid/Flexbox** - Responsive layouts

## React + Vite Configuration

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
