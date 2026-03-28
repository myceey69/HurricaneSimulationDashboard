import React, { useState } from 'react';
import { Banana, Camera, Download, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function NanoBanana() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const generateNanoBananaImage = async () => {
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

      const prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

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
      console.error("Error generating nano banana image:", err);
      setError(`Failed to generate image: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'nano-banana-gemini.png';
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
        color: 'var(--accent-green)'
      }}>
        <Banana size={20} />
        Nano Banana Generator
      </h3>
      
      <p style={{ 
        fontSize: '0.875rem', 
        color: 'var(--text-secondary)', 
        marginBottom: '1rem' 
      }}>
        Generate AI-powered images of nano banana dishes with a Gemini theme using Google's GenAI.
      </p>

      <button
        onClick={generateNanoBananaImage}
        disabled={isGenerating}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: 'var(--accent-green)',
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
            Generating...
          </>
        ) : (
          <>
            <Camera size={16} />
            Generate Nano Banana
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
            alt="Generated nano banana dish"
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
              backgroundColor: 'var(--accent-blue)',
              color: 'white',
              border: 'none',
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
            Download Image
          </button>
        </div>
      )}
    </div>
  );
}