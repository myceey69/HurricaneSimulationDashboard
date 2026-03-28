# AEGIS (Adaptive Emergency Ground Integration System)

AEGIS is a mission-critical disaster response dashboard enabled by the multimodal reasoning of Gemini. It transforms hyper-local terrain and weather data into actionable physical designs and tactical recommendations.

## Core Technical Innovation: Multimodal Disaster Synthesis

AEGIS relies on Gemini's ability to fuse disparate data streams (satellite imagery, NWP weather models, and real-time field reports) into actionable physical designs and tactical recommendations.

### Key Features

- **Multimodal Resource Fusion:** Sync resources from global agencies (USAR TF1, WHO, FEMA) and on-the-ground reports.
- **Gap Identification:** Automatically analyze terrain friction, slope coefficients, and soil saturation to identify where standard hardware will fail.
- **Generative Hardware Design (Nano):** Procedurally design specialized robotic hardware (like the 'Mud-Runner' Hexapod) matched to specific environmental constraints.
- **Nano Banana Studio:** AI-powered multimedia creation starting with cinematic video generation, then extracting perfect still images from the video content.
- **Veo Video Generation:** Create high-fidelity deployment simulations and culinary cinematography using Google's Veo 3.1 model as the primary creative tool.
- **Tactical Mission Intelligence:** Unified strategic view pooling local, federal, and NGO resources.

## Technology Stack

- **React 19** - UI Framework
- **Vite 8** - Build Tool
- **Leaflet** - Interactive Tactical Mapping
- **Google Gemini (Flash)** - The Brain (Terrain Analysis, Gap Identification, Hardware Design)
- **Google Veo 3.1** - AI Video Generation for Deployment Simulations and Nano Banana Cinematography
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

### Mission Operations
1. **Pool Resources:** Sync existing assets across agencies.
2. **Identify Gap:** Analyze live terrain data (e.g., soil saturation) to trigger the "AI Veto" on standard equipment.
3. **Generate Spec:** Use "Generative Genesis" to design a custom bot (e.g., Mud-Runner) for the specific failure condition.
4. **Deploy:** Monitor real-time telemetry of specialized units on the tactical map.

### Nano Banana Studio
1. **Generate Video:** Click "Generate Nano Banana Video" to create cinematic videos of nano banana dishes in Gemini-themed restaurants using Veo 3.1.
2. **Extract Image:** Use the generated video to create perfect still images showing the dish presentation.
3. **Download Content:** Save both videos (.mp4) and images (.png) for use in presentations, reports, or culinary portfolios.
4. **Reset & Repeat:** Start fresh with new creations anytime.

**Video Generation Process:**
- Takes 2-3 minutes for high-quality 1080p video generation
- Real-time progress updates with culinary-themed messages
- Creates professional restaurant cinematography with smooth camera movements
- Features elegant plating, steam effects, and warm lighting
- Images are then extracted/generated based on the video content

---
*AEGIS: Turning a 40GB map of everything into a 40MB playbook of what matters.*
