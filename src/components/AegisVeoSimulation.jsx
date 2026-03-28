import React, { useState } from 'react';
import { Play, Loader2, Download, AlertTriangle, Video } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function AegisVeoSimulation({ gapAnalysis }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState("");

  const generateVeoSimulation = async () => {
    if (!import.meta.env.VITE_GOOGLE_GENAI_API_KEY) {
      setError("Google GenAI API key not configured");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setProgress("Initializing Veo 3.1...");

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const robotName = gapAnalysis?.recommendation || "'Mud-Runner' hexapod";
      const terrain = gapAnalysis ? "through deep mud and urban debris" : "through rushing brown floodwater and urban debris";
      
      const prompt = `A 5-second cinematic deployment simulation of the ${robotName} robot navigating ${terrain}. The robot stabilizes itself using advanced sensors and reaches a rescue target. High-fidelity disaster simulation style.`;

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      setProgress("Dreaming up your robot... (2-3 minutes)");

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        const messages = ["Rendering flood waters...", "Simulating hurricane physics...", "Polishing sensors...", "Almost ready..."];
        setProgress(messages[Math.floor(Math.random() * messages.length)]);
      }

      setProgress("Downloading video...");

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) throw new Error("No video URI received from Veo");

      // Fetch the video file using the API key in the headers as seen in the reference
      const response = await fetch(videoUri, {
        method: 'GET',
        headers: { 'x-goog-api-key': apiKey },
      });

      if (!response.ok) throw new Error("Failed to fetch video file from Google storage");

      const blob = await response.blob();
      setVideoUrl(URL.createObjectURL(blob));

    } catch (err) {
      console.error("Error generating Veo simulation:", err);
      setError(`Simulation Failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setProgress("");
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <h3 style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        marginBottom: '1rem',
        color: 'var(--accent-blue)'
      }}>
        <Video size={20} />
        Veo 3 Deployment Simulation
      </h3>
      
      <p style={{ 
        fontSize: '0.875rem', 
        color: 'var(--text-secondary)', 
        marginBottom: '1rem' 
      }}>
        Create high-fidelity deployment simulations of custom hardware in the predicted failure environment.
      </p>

      {!videoUrl && (
        <button
          onClick={generateVeoSimulation}
          disabled={isGenerating}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--accent-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            opacity: isGenerating ? 0.7 : 1,
            marginBottom: '1rem'
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {progress || "Simulating..."}
            </>
          ) : (
            <>
              <Play size={16} />
              Generate Simulation (The WOW)
            </>
          )}
        </button>
      )}

      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: 'var(--error-red)',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {videoUrl && (
        <div>
          <video 
            src={videoUrl} 
            controls 
            autoPlay
            loop
            style={{ 
              width: '100%', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              backgroundColor: '#000'
            }} 
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setVideoUrl(null)}
              className="btn"
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              Reset
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 2, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Download size={14} /> Export to Playbook
            </button>
          </div>
        </div>
      )}
    </div>
  );
}