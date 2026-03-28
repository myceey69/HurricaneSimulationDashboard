# AEGIS (Adaptive Emergency Ground Integration System)

AEGIS is a mission-critical disaster response dashboard enabled by the multimodal reasoning of Gemini. It transforms hyper-local terrain and weather data into actionable physical designs and tactical recommendations.

## Core Technical Innovation: Multimodal Disaster Synthesis

AEGIS relies on Gemini's ability to fuse disparate data streams (satellite imagery, NWP weather models, and real-time field reports) into actionable physical designs and tactical recommendations.

### Key Features

- **Multimodal Resource Fusion:** Sync resources from global agencies (USAR TF1, WHO, FEMA) and on-the-ground reports.
- **Gap Identification:** Automatically analyze terrain friction, slope coefficients, and soil saturation to identify where standard hardware will fail.
- **Generative Hardware Design (Nano):** Procedurally design specialized robotic hardware (like the 'Mud-Runner' Hexapod) matched to specific environmental constraints.
- **Tactical Mission Intelligence:** Unified strategic view pooling local, federal, and NGO resources.

## Technology Stack

- **React 19** - UI Framework
- **Vite 8** - Build Tool
- **Leaflet** - Interactive Tactical Mapping
- **Google Gemini (Flash)** - The Brain (Terrain Analysis, Gap Identification, Hardware Design)
- **Lucide React** - Iconography

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   Create a `.env` file in the root directory:
   ```
   VITE_GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
   ```

3. **Start AEGIS:**
   ```bash
   npm run dev
   ```

## Workflow

1. **Pool Resources:** Sync existing assets across agencies.
2. **Identify Gap:** Analyze live terrain data (e.g., soil saturation) to trigger the "AI Veto" on standard equipment.
3. **Generate Spec:** Use "Generative Genesis" to design a custom bot (e.g., Mud-Runner) for the specific failure condition.
4. **Deploy:** Monitor real-time telemetry of specialized units on the tactical map.

---
*AEGIS: Turning a 40GB map of everything into a 40MB playbook of what matters.*
