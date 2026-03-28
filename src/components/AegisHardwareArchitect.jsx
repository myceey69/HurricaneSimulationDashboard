import React, { useState } from 'react';
import { Bot, Camera, Download, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function AegisHardwareArchitect() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const generateAegisBotImage = async () => {
    if (!import.meta.env.VITE_GOOGLE_GENAI_API_KEY) {
      setError("Google GenAI API key not configured");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY
      });

      const prompt = "A hyper-realistic hero image of a specialized disaster rescue robot called the 'Mud-Runner'. It is a hexapod with wide-traction gimbals, a sealed IP68 elevated chassis, and a heavy-duty payload module. It is navigating deep, thick brown mud and urban debris during a hurricane rescue mission. Dramatic lighting, 8k resolution, cinematic style.";

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: prompt,
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          setGeneratedImage(`data:image/png;base64,${imageData}`);
          break;
        }
      }
    } catch (err) {
      console.error("Error generating AEGIS bot image:", err);
      setError(`Failed to generate image: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'aegis-mud-runner-design.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <Sparkles size={20} />
        Generative Genesis
      </h3>
      
      <p style={{ 
        fontSize: '0.875rem', 
        color: 'var(--text-secondary)', 
        marginBottom: '1rem' 
      }}>
        Procedurally design specialized robotic hardware matched to hyper-local terrain coefficients.
      </p>

      <button
        onClick={generateAegisBotImage}
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
            Synthesizing Design...
          </>
        ) : (
          <>
            <Bot size={16} />
            Generate 'Mud-Runner' Spec
          </>
        )}
      </button>

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

      {generatedImage && (
        <div>
          <img
            src={generatedImage}
            alt="Generated AEGIS bot design"
            style={{
              width: '100%',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}
          />
          <button
            onClick={downloadImage}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <Download size={16} />
            Export Technical Brief
          </button>
        </div>
      )}
    </div>
  );
}